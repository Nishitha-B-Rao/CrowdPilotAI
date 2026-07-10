"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Users, Mic } from "lucide-react";

type Recommendation = {
  id: string;
  timestamp: string;
  observation: string;
  reasoning: string[];
  prediction: string;
  recommendation: string;
  expectedImpact: string;
  priority: "low" | "medium" | "high" | "critical";
  confidence: string;
  affectedZones: string[];
};

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mock data for demo purposes before backend is connected
  useEffect(() => {
    setRecommendations([
      {
        id: "rec-1",
        timestamp: new Date().toLocaleTimeString(),
        observation: "Gate C occupancy reached 84%.",
        reasoning: [
          "Recent metro arrival increased incoming fans.",
          "Security screening speed decreased by 15% due to staff shortage.",
          "Historical matches with similar traffic caused congestion bottlenecks."
        ],
        prediction: "Gate C will exceed safe capacity (100%) within 7 minutes.",
        recommendation: "Redirect incoming fans from South Transit Hub to Gate D.",
        expectedImpact: "Average wait time decreases from 18 minutes to 6 minutes. Prevents crush risk.",
        priority: "high",
        confidence: "92%",
        affectedZones: ["Gate C", "Gate D", "South Transit Hub"]
      }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Stadium Occupancy", value: "68,402", icon: Users },
          { label: "Active Incidents", value: "3", icon: AlertTriangle, color: "text-orange-500" },
          { label: "Avg Queue Time", value: "12m", icon: Activity },
          { label: "AI Recommendations", value: "14", icon: CheckCircle2, color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-3 bg-secondary rounded-lg ${stat.color || "text-primary"}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        
        {/* Left Column: Decision Timeline */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">AI Decision Timeline</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Analysis</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <AnimatePresence>
              {recommendations.map((rec) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={rec.id}
                  className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Card Header (Summary) */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityColor(rec.priority)} uppercase tracking-wider`}>
                          {rec.priority} PRIORITY
                        </span>
                        <span className="text-sm text-muted-foreground">{rec.timestamp}</span>
                      </div>
                      <div className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                        {rec.confidence} Confidence
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2">Recommendation: {rec.recommendation}</h3>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <ArrowRight size={16} className="mr-2 text-primary" />
                      {rec.expectedImpact}
                    </p>

                    {/* Expand Toggle */}
                    <button 
                      onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                      className="mt-4 flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {expandedId === rec.id ? (
                        <><ChevronUp size={16} className="mr-1" /> Hide Reasoning</>
                      ) : (
                        <><ChevronDown size={16} className="mr-1" /> Why this recommendation?</>
                      )}
                    </button>
                  </div>

                  {/* Expanded XAI Content */}
                  <AnimatePresence>
                    {expandedId === rec.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-secondary/30"
                      >
                        <div className="p-5 space-y-6">
                          {/* XAI Flow Pipeline */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border hidden md:block -z-10"></div>
                            
                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                              <div className="font-semibold text-primary mb-2 flex items-center">
                                <Activity size={16} className="mr-2" /> 1. Observation
                              </div>
                              <p className="text-muted-foreground">{rec.observation}</p>
                            </div>
                            
                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                              <div className="font-semibold text-blue-400 mb-2 flex items-center">
                                <CheckCircle2 size={16} className="mr-2" /> 2. Reasoning
                              </div>
                              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                {rec.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                              </ul>
                            </div>
                            
                            <div className="bg-card p-4 rounded-lg border border-border shadow-sm border-l-4 border-l-orange-500">
                              <div className="font-semibold text-orange-500 mb-2 flex items-center">
                                <AlertTriangle size={16} className="mr-2" /> 3. Prediction
                              </div>
                              <p className="text-muted-foreground">{rec.prediction}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground mr-2 py-1">Affected Zones:</span>
                            {rec.affectedZones.map(z => (
                              <span key={z} className="bg-secondary text-foreground text-xs px-2 py-1 rounded-md border border-border">{z}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Map & Multilingual */}
        <div className="flex flex-col space-y-6">
          {/* Mock Stadium Map */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex-1 flex flex-col">
            <h3 className="font-semibold mb-3">Live Heatmap</h3>
            <div className="flex-1 bg-secondary rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #ef4444 0%, transparent 40%), radial-gradient(circle at 80% 70%, #f59e0b 0%, transparent 40%)' }}></div>
              <p className="text-muted-foreground text-sm z-10 flex items-center"><Activity className="mr-2 animate-pulse" /> Stadium Map Visualization Loading...</p>
            </div>
          </div>

          {/* Multilingual Assistant */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Multilingual Assistant</h3>
              <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-full border border-blue-500/20">Auto-Detect</span>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 mb-4 border border-border min-h-[100px] flex flex-col justify-center items-center text-center">
              <p className="text-sm text-muted-foreground mb-2">Hold to translate fan requests</p>
              <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <Mic size={20} />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
