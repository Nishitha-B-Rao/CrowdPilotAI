"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, CheckCircle2, ChevronDown, ChevronUp, Activity, AlertTriangle, ArrowRight } from "lucide-react";
import type { Recommendation } from "@/lib/types";

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "critical": return "text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
    case "high": return "text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]";
    case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
    default: return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
  }
};

interface DecisionTimelineProps {
  recommendations: Recommendation[];
}

export const DecisionTimeline = memo(function DecisionTimeline({ recommendations }: DecisionTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="lg:col-span-2 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
          <Radio size={20} className="mr-3 text-cyan-400" />
          Explainable AI Decision Timeline
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
                  <CheckCircle2 size={18} className="mr-3 shrink-0" />
                  Expected Impact: {rec.expectedImpact}
                </p>

                {/* Expand Toggle */}
                <button 
                  aria-expanded={expandedId === rec.id}
                  aria-controls={`xai-reasoning-${rec.id}`}
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
                    id={`xai-reasoning-${rec.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black/20 backdrop-blur-sm border-t border-white/5"
                  >
                    <div className="p-6 space-y-8">
                      {/* XAI Flow Pipeline */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm relative">
                        {/* Glowing Connector Line */}
                        <div className="absolute top-[28px] left-1/8 right-1/8 w-3/4 h-0.5 bg-gradient-to-r from-cyan-500/50 via-indigo-500/50 to-orange-500/50 hidden md:block -z-10 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        
                        {/* Observation Node */}
                        <div className="glass-panel p-4 rounded-xl relative group hover:border-cyan-500/30 transition-colors">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-background z-10 hidden md:flex items-center justify-center"></div>
                          <div className="font-bold text-cyan-400 mb-2 flex items-center tracking-wide uppercase text-[10px]">
                            <Activity size={12} className="mr-1.5" /> Observation
                          </div>
                          <p className="text-white/80 leading-relaxed text-xs">{rec.observation}</p>
                        </div>
                        
                        {/* Reasoning Node */}
                        <div className="glass-panel p-4 rounded-xl relative group hover:border-indigo-500/30 transition-colors">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] border-2 border-background z-10 hidden md:flex items-center justify-center"></div>
                          <div className="font-bold text-indigo-400 mb-2 flex items-center tracking-wide uppercase text-[10px]">
                            <CheckCircle2 size={12} className="mr-1.5" /> Reasoning
                          </div>
                          <ul className="space-y-1.5 text-white/80 list-none text-xs">
                            {rec.reasoning.map((r, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-indigo-400 mr-1.5 mt-0.5">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Prediction Node */}
                        <div className="glass-panel p-4 rounded-xl relative group hover:border-orange-500/30 transition-colors">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] border-2 border-background z-10 hidden md:flex items-center justify-center"></div>
                          <div className="font-bold text-orange-400 mb-2 flex items-center tracking-wide uppercase text-[10px]">
                            <AlertTriangle size={12} className="mr-1.5" /> Prediction
                          </div>
                          <p className="text-white/80 leading-relaxed text-xs">{rec.prediction}</p>
                        </div>

                        {/* Recommendation Node */}
                        <div className="glass-panel p-4 rounded-xl relative group hover:border-emerald-500/30 transition-colors">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] border-2 border-background z-10 hidden md:flex items-center justify-center"></div>
                          <div className="font-bold text-emerald-400 mb-2 flex items-center tracking-wide uppercase text-[10px]">
                            <ArrowRight size={12} className="mr-1.5" /> Recommendation
                          </div>
                          <p className="text-white/80 leading-relaxed text-xs">{rec.recommendation}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
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
  );
});
