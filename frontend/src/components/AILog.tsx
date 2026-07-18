"use client";

import React, { memo } from "react";
import type { AILogEntry } from "@/lib/types";

interface AILogProps {
  aiLogs: AILogEntry[];
}

export const AILog = memo(function AILog({ aiLogs }: AILogProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col min-h-[250px]">
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
  );
});
