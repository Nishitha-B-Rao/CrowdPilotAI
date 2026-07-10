"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Users, Mic, Radio } from "lucide-react";
import { CsvUploader } from "@/components/CsvUploader";

type AILogEntry = {
  timestamp: string;
  input_type: string;
  model: string;
  latency_ms: number;
  confidence: string;
  status: string;
};

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

type Gate = {
  id: string;
  name: string;
  occupancy_percentage: number;
  queue_time_minutes: number;
};

type StadiumState = {
  total_occupancy: number;
  active_incidents: number;
  avg_queue_time: number;
  gates: Gate[];
};

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stadiumState, setStadiumState] = useState<StadiumState | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationData, setTranslationData] = useState<{originalText: string, translatedText: string, detectedLanguage: string, confidence?: string} | null>(null);
  const [aiLogs, setAiLogs] = useState<AILogEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        // Fetch live telemetry state
        const telemetryRes = await fetch(`${apiUrl}/api/v1/telemetry/state`);
        if (!telemetryRes.ok) throw new Error("Failed to fetch telemetry");
        const state: StadiumState = await telemetryRes.json();
        setStadiumState(state);

        // Fetch AI recommendation based on this context
        const copilotRes = await fetch(`${apiUrl}/api/v1/copilot/recommendation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: JSON.stringify(state) })
        });
        
        if (copilotRes.ok) {
          const aiRec = await copilotRes.json();
          setRecommendations(prev => [aiRec, ...prev.slice(0, 4)]);
        }
        
        // Fetch AI Logs
        const logsRes = await fetch(`${apiUrl}/api/v1/telemetry/ai-logs`);
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAiLogs(logsData.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 30 seconds to avoid hitting free-tier API rate limits
    const interval = setInterval(fetchData, 30000);
    
    // Listen for manual fetch triggers (e.g. from CsvUploader)
    const handleForceFetch = () => {
      fetchData();
    };
    document.addEventListener("forceFetchData", handleForceFetch);

    return () => {
      clearInterval(interval);
      document.removeEventListener("forceFetchData", handleForceFetch);
    };
  }, []);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      case "high": return "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
      case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
      default: return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Occupancy", value: stadiumState ? stadiumState.total_occupancy.toLocaleString() : "...", icon: Users, color: "from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/20" },
          { label: "Active Incidents", value: stadiumState ? stadiumState.active_incidents.toString() : "...", icon: AlertTriangle, color: "from-orange-400 to-red-500", shadow: "shadow-orange-500/20" },
          { label: "Avg Queue Time", value: stadiumState ? `${stadiumState.avg_queue_time}m` : "...", icon: Activity, color: "from-indigo-400 to-purple-500", shadow: "shadow-indigo-500/20" },
          { label: "AI Decisions", value: recommendations.length.toString(), icon: CheckCircle2, color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass rounded-2xl p-5 flex items-center justify-between group overflow-hidden relative"
          >
            {/* Hover subtle glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="relative z-10">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
            
            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.color} ${stat.shadow} shadow-lg`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Decision Timeline */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
              <Radio size={20} className="mr-3 text-cyan-400" />
              AI Decision Timeline
            </h2>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE RAG STREAM</span>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <AnimatePresence>
              {recommendations.map((rec) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={rec.id}
                  className="glass rounded-2xl overflow-hidden relative"
                >
                  {/* Subtle top border gradient */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                  
                  {/* Card Header (Summary) */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPriorityStyle(rec.priority)} uppercase tracking-wider`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">{rec.timestamp}</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {rec.confidence} Confidence
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight leading-snug">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        {rec.recommendation}
                      </span>
                    </h3>
                    
                    <p className="text-emerald-400/90 text-sm flex items-center font-medium bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                      <CheckCircle2 size={18} className="mr-3" />
                      {rec.expectedImpact}
                    </p>

                    {/* Expand Toggle */}
                    <button 
                      onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                      className="mt-6 flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20"
                    >
                      {expandedId === rec.id ? (
                        <><ChevronUp size={16} className="mr-2 group-hover:-translate-y-1 transition-transform" /> Hide XAI Pipeline</>
                      ) : (
                        <><ChevronDown size={16} className="mr-2 group-hover:translate-y-1 transition-transform" /> View XAI Reasoning</>
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
                        className="bg-black/20 backdrop-blur-sm border-t border-white/5"
                      >
                        <div className="p-6 space-y-8">
                          {/* XAI Flow Pipeline */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm relative">
                            {/* Glowing Connector Line */}
                            <div className="absolute top-[28px] left-1/6 right-1/6 w-2/3 h-0.5 bg-gradient-to-r from-cyan-500/50 via-indigo-500/50 to-orange-500/50 hidden md:block -z-10 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                            
                            {/* Observation Node */}
                            <div className="glass-panel p-5 rounded-xl relative group hover:border-cyan-500/30 transition-colors">
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-background z-10 flex items-center justify-center hidden md:flex"></div>
                              <div className="font-bold text-cyan-400 mb-3 flex items-center tracking-wide uppercase text-xs">
                                <Activity size={14} className="mr-2" /> Observation
                              </div>
                              <p className="text-white/80 leading-relaxed">{rec.observation}</p>
                            </div>
                            
                            {/* Reasoning Node */}
                            <div className="glass-panel p-5 rounded-xl relative group hover:border-indigo-500/30 transition-colors">
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] border-2 border-background z-10 flex items-center justify-center hidden md:flex"></div>
                              <div className="font-bold text-indigo-400 mb-3 flex items-center tracking-wide uppercase text-xs">
                                <CheckCircle2 size={14} className="mr-2" /> Reasoning
                              </div>
                              <ul className="space-y-2 text-white/80 list-none">
                                {rec.reasoning.map((r, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-indigo-400 mr-2 mt-0.5">•</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Prediction Node */}
                            <div className="glass-panel p-5 rounded-xl relative group hover:border-orange-500/30 transition-colors">
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] border-2 border-background z-10 flex items-center justify-center hidden md:flex"></div>
                              <div className="font-bold text-orange-400 mb-3 flex items-center tracking-wide uppercase text-xs">
                                <AlertTriangle size={14} className="mr-2" /> Prediction
                              </div>
                              <p className="text-white/80 leading-relaxed">{rec.prediction}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-3 items-center">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Impacted Zones:</span>
                                {rec.affectedZones.map(z => (
                                  <span key={z} className="bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">{z}</span>
                                ))}
                              </div>
                              
                              <div className="flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">AI Confidence</span>
                                <div className="flex items-center">
                                  <div className="w-16 h-2 bg-white/10 rounded-full mr-3 overflow-hidden">
                                    <div className="h-full bg-emerald-400" style={{ width: `${rec.confidence.replace('%', '')}%` }}></div>
                                  </div>
                                  <span className="text-emerald-400 font-bold">{rec.confidence}</span>
                                </div>
                              </div>
                            </div>
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
          <div className="glass rounded-2xl p-6 flex-1 flex flex-col min-h-[350px]">
            <h3 className="font-bold tracking-tight text-white mb-4 flex items-center">
              <Activity size={18} className="mr-2 text-primary" /> Live Heatmap
            </h3>
            
            {/* Dynamic Telemetry Heatmap */}
            <div className="flex-1 rounded-xl border border-white/10 relative overflow-hidden flex flex-col p-4 bg-black/40">
              <div className="grid grid-cols-2 gap-3 h-full">
                {stadiumState?.gates?.slice(0, 4).map(gate => {
                  const isHigh = gate.occupancy_percentage > 80;
                  const isMed = gate.occupancy_percentage > 50;
                  const bgClass = isHigh ? "bg-red-500/20 border-red-500/50" : (isMed ? "bg-yellow-500/20 border-yellow-500/50" : "bg-emerald-500/20 border-emerald-500/50");
                  const textClass = isHigh ? "text-red-400" : (isMed ? "text-yellow-400" : "text-emerald-400");
                  
                  return (
                    <div key={gate.id} className={`rounded-lg border p-3 flex flex-col justify-between transition-colors ${bgClass}`}>
                      <span className="text-xs font-semibold text-white/70 uppercase">{gate.name}</span>
                      <div className="flex items-end justify-between mt-2">
                        <span className={`text-2xl font-bold ${textClass}`}>{gate.occupancy_percentage}%</span>
                        <span className="text-xs text-white/50">{gate.queue_time_minutes}m wait</span>
                      </div>
                    </div>
                  );
                }) || (
                  <div className="col-span-2 flex items-center justify-center h-full">
                     <span className="text-white/50 text-sm animate-pulse">Waiting for telemetry...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Multilingual Assistant */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            {/* Auto-Translate component logic remains here */}
            {/* Ambient glow for microphone card */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <h3 className="font-bold tracking-tight text-white flex items-center">
                <Mic size={18} className="mr-2 text-cyan-400" /> Auto-Translate
              </h3>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">Active</span>
            </div>
            
            <div className="glass-panel rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center relative z-10 group min-h-[200px]">
              
              {isListening ? (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="flex space-x-1 mb-6">
                    {[1,2,3,4,5].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-cyan-400 rounded-full"
                        animate={{ height: ["10px", "30px", "10px"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-cyan-400 font-medium animate-pulse">Listening to microphone...</p>
                </div>
              ) : isTranslating ? (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <p className="text-sm text-cyan-400 font-medium animate-pulse">Translating with Vertex AI...</p>
                </div>
              ) : translationData ? (
                <div className="flex flex-col items-center justify-center w-full animate-in fade-in duration-500">
                  <div className="flex space-x-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">{translationData.detectedLanguage}</span>
                    {translationData.confidence && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {translationData.confidence} Confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white/90 mb-2 italic">"{translationData.originalText}"</p>
                  <div className="w-full h-px bg-white/10 my-2"></div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 mb-2">English Translation</span>
                  <p className="text-sm font-bold text-emerald-400">"{translationData.translatedText}"</p>
                  <button 
                    onClick={() => setTranslationData(null)}
                    className="mt-4 text-xs text-muted-foreground hover:text-cyan-500 underline transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-white/70 mb-6">Click to speak a fan request</p>
                  
                  {/* Glowing Mic Button */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                    <button 
                      onClick={() => {
                        setIsListening(true);
                        
                        // Web Speech API Integration
                        try {
                          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                          if (SpeechRecognition) {
                            const recognition = new SpeechRecognition();
                            recognition.lang = 'es-ES'; // Listen for Spanish or default
                            recognition.interimResults = false;
                            recognition.maxAlternatives = 1;
                            
                            recognition.onresult = async (event: any) => {
                              const transcript = event.results[0][0].transcript;
                              setIsListening(false);
                              setIsTranslating(true);
                              
                              try {
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                                const res = await fetch(`${apiUrl}/api/v1/copilot/translate`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ text: transcript })
                                });
                                
                                if (!res.ok) throw new Error("Translation failed");
                                const data = await res.json();
                                setTranslationData(data);
                              } catch (err) {
                                console.error(err);
                                setTranslationData({
                                  originalText: transcript,
                                  translatedText: "API Error: Could not reach translation service.",
                                  detectedLanguage: "Error"
                                });
                              } finally {
                                setIsTranslating(false);
                              }
                            };
                            
                            recognition.onerror = (event: any) => {
                              console.error('Speech recognition error', event.error);
                              setIsListening(false);
                              setTranslationData({
                                originalText: "",
                                translatedText: "Error accessing microphone.",
                                detectedLanguage: "Error"
                              });
                            };
                            
                            recognition.onnomatch = () => {
                              setIsListening(false);
                              setTranslationData({
                                originalText: "",
                                translatedText: "Could not understand audio.",
                                detectedLanguage: "Error"
                              });
                            };
                            
                            recognition.start();
                          } else {
                            setIsListening(false);
                            setTranslationData({
                                originalText: "",
                                translatedText: "Browser does not support Speech API.",
                                detectedLanguage: "Error"
                            });
                          }
                        } catch (e) {
                          setIsListening(false);
                          setTranslationData({
                              originalText: "",
                              translatedText: "Microphone permission denied.",
                              detectedLanguage: "Error"
                          });
                        }
                      }}
                      className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-white/20"
                    >
                      <Mic size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Activity Log Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col min-h-[250px] mt-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                AI Activity Log
              </h2>
              <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                <span className="text-xs font-medium text-green-400">Live</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[300px] relative z-10">
              {aiLogs.length === 0 ? (
                <div className="text-white/40 text-sm italic text-center py-8">Waiting for AI Activity...</div>
              ) : (
                aiLogs.map((log, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs font-mono">
                    <div className="flex justify-between text-white/50 mb-1">
                      <span>[{log.timestamp}]</span>
                      <span className={log.latency_ms > 2000 ? 'text-orange-400' : 'text-emerald-400'}>{log.latency_ms}ms</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-2 mt-2">
                      <span className="text-muted-foreground">Input:</span>
                      <span className="text-white/90">{log.input_type}</span>
                      
                      <span className="text-muted-foreground">Model:</span>
                      <span className="text-cyan-400">{log.model}</span>
                      
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="text-emerald-400">{log.confidence}</span>
                      
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-white/80">{log.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CSV Uploader */}
          <CsvUploader onUploadSuccess={() => {
            // Force an immediate fetch to bypass the 30s interval
            const fetchEvent = new Event("forceFetchData");
            document.dispatchEvent(fetchEvent);
          }} />
        </div>
        
      </div>
    </div>
  );
}
