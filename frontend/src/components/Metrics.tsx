"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Users, AlertTriangle, Activity, CheckCircle2 } from "lucide-react";
import type { StadiumState, Recommendation } from "@/lib/types";

interface MetricsProps {
  stadiumState: StadiumState | null;
  recommendationsCount: number;
}

export const Metrics = memo(function Metrics({ stadiumState, recommendationsCount }: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: "Total Occupancy", value: stadiumState ? stadiumState.total_occupancy.toLocaleString() : "...", icon: Users, color: "from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/20" },
        { label: "Active Incidents", value: stadiumState ? stadiumState.active_incidents.toString() : "...", icon: AlertTriangle, color: "from-orange-400 to-red-500", shadow: "shadow-orange-500/20" },
        { label: "Avg Queue Time", value: stadiumState ? `${stadiumState.avg_queue_time}m` : "...", icon: Activity, color: "from-indigo-400 to-purple-500", shadow: "shadow-indigo-500/20" },
        { label: "AI Decisions", value: recommendationsCount.toString(), icon: CheckCircle2, color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
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
  );
});
