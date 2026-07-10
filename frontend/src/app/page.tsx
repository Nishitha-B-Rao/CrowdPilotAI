"use client";

import { API_URL } from "@/lib/config";
import { useState, useEffect, useCallback } from "react";
import { CsvUploader } from "@/components/CsvUploader";
import { Metrics } from "@/components/Metrics";
import { DecisionTimeline } from "@/components/DecisionTimeline";
import { Heatmap } from "@/components/Heatmap";
import { Translation } from "@/components/Translation";
import { AILog } from "@/components/AILog";
import type { StadiumState, Recommendation, AILogEntry } from "@/lib/types";

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stadiumState, setStadiumState] = useState<StadiumState | null>(null);
  const [aiLogs, setAiLogs] = useState<AILogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Fetch live telemetry state
      const telemetryRes = await fetch(`${API_URL}/api/v1/telemetry/state`);
      if (!telemetryRes.ok) throw new Error("Failed to fetch telemetry");
      const state: StadiumState = await telemetryRes.json();
      setStadiumState(state);

      // Fetch AI recommendation based on this context
      const copilotRes = await fetch(`${API_URL}/api/v1/copilot/recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: JSON.stringify(state) })
      });
      
      if (copilotRes.ok) {
        const aiRec = await copilotRes.json();
        setRecommendations(prev => {
          // Prevent duplicates by checking if the ID already exists
          if (prev.some(r => r.id === aiRec.id)) return prev;
          return [aiRec, ...prev.slice(0, 4)];
        });
      }
      
      // Fetch AI Logs
      const logsRes = await fetch(`${API_URL}/api/v1/telemetry/ai-logs`);
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAiLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);

    const handleForceFetch = () => fetchData();
    document.addEventListener("forceFetchData", handleForceFetch);

    return () => {
      clearInterval(interval);
      document.removeEventListener("forceFetchData", handleForceFetch);
    };
  }, [fetchData]);

  return (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <Metrics 
        stadiumState={stadiumState} 
        recommendationsCount={recommendations.length} 
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Decision Timeline */}
        <DecisionTimeline recommendations={recommendations} />

        {/* Right Column: Map & Multilingual */}
        <div className="flex flex-col space-y-6">
          <Heatmap stadiumState={stadiumState} />
          
          <Translation />

          <AILog aiLogs={aiLogs} />

          <CsvUploader onUploadSuccess={() => {
            // Force an immediate fetch to bypass the 10s interval
            const fetchEvent = new Event("forceFetchData");
            document.dispatchEvent(fetchEvent);
          }} />
        </div>
      </div>
    </div>
  );
}
