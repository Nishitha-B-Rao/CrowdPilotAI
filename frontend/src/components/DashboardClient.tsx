"use client";

import { API_URL } from "@/lib/config";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { StadiumState, Recommendation, AILogEntry } from "@/lib/types";

// Dynamic imports for heavy components
const CsvUploader = dynamic(() => import("@/components/CsvUploader").then(mod => mod.CsvUploader), { ssr: false });
const Metrics = dynamic(() => import("@/components/Metrics").then(mod => mod.Metrics));
const DecisionTimeline = dynamic(() => import("@/components/DecisionTimeline").then(mod => mod.DecisionTimeline));
const Heatmap = dynamic(() => import("@/components/Heatmap").then(mod => mod.Heatmap));
const Translation = dynamic(() => import("@/components/Translation").then(mod => mod.Translation));
const AILog = dynamic(() => import("@/components/AILog").then(mod => mod.AILog));

export default function DashboardClient() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stadiumState, setStadiumState] = useState<StadiumState | null>(null);
  const [aiLogs, setAiLogs] = useState<AILogEntry[]>([]);

  const fetchData = useCallback(async () => {
    try {
      // Aggregated endpoint
      const syncRes = await fetch(`${API_URL}/api/v1/dashboard/sync`);
      if (!syncRes.ok) throw new Error("Failed to fetch dashboard sync");
      const data = await syncRes.json();
      
      setStadiumState(data.state);
      setAiLogs(data.ai_logs || []);
      
      if (data.recommendation) {
        setRecommendations(prev => {
          // Use observation as unique ID if not provided
          const recId = data.recommendation.id || data.recommendation.observation;
          if (prev.some(r => (r.id || r.observation) === recId)) return prev;
          
          const newRec = {
            ...data.recommendation,
            id: recId,
            timestamp: data.recommendation.timestamp || new Date().toLocaleTimeString()
          };
          return [newRec, ...prev.slice(0, 4)];
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <Metrics 
        stadiumState={stadiumState} 
        recommendationsCount={recommendations.length} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <DecisionTimeline recommendations={recommendations} />

        <div className="flex flex-col space-y-6">
          <Heatmap stadiumState={stadiumState} />
          <Translation />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AILog aiLogs={aiLogs} />
        </div>
        <div className="flex flex-col justify-start">
          <CsvUploader onUploadSuccess={() => {
            const fetchEvent = new Event("forceFetchData");
            document.dispatchEvent(fetchEvent);
          }} />
        </div>
      </div>
    </div>
  );
}
