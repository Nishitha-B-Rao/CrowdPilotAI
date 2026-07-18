"use client";

import React, { memo } from "react";
import { Activity } from "lucide-react";
import type { StadiumState } from "@/lib/types";

interface HeatmapProps {
  stadiumState: StadiumState | null;
}

export const Heatmap = memo(function Heatmap({ stadiumState }: HeatmapProps) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-[350px]">
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
  );
});
