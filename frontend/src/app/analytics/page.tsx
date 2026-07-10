"use client";

import { useState, useEffect } from "react";

export default function Analytics() {
  const [capacity, setCapacity] = useState("72");
  const [history, setHistory] = useState([40, 70, 45, 90, 65, 85, 100, 60, 50, 80]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/telemetry/state`);
        if (res.ok) {
          const data = await res.json();
          // Total capacity of stadium is 80,000 for this demo
          const capPercent = Math.min(100, Math.round((data.total_occupancy / 80000) * 100));
          setCapacity(capPercent.toString());
          
          // Just shift history slightly based on current cap to simulate a live chart
          setHistory(prev => {
            const newHist = [...prev.slice(1), capPercent];
            return newHist;
          });
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Deep Analytics</h2>
        <p className="text-muted-foreground mb-8">Historical crowd flow patterns dynamically updated from live telemetry.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            
            <div className="w-full flex">
              {/* Y Axis */}
              <div className="flex flex-col justify-between h-40 text-[10px] text-white/40 pr-2 pb-6 border-r border-white/10">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>
              
              {/* Chart Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-end space-x-2 h-40 w-full px-2 opacity-70 group-hover:opacity-100 transition-opacity border-b border-white/10">
                  {history.map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/50 to-purple-400 rounded-t-sm transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                
                {/* X Axis */}
                <div className="flex justify-between w-full px-2 mt-2 text-[10px] text-white/40">
                  <span>-45m</span>
                  <span>-30m</span>
                  <span>-15m</span>
                  <span>Now</span>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-white mt-6 z-10">Live Entry Volume Trend</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent"></div>
            
            {/* Dynamic CSS circle depending on capacity */}
            <div className="relative w-40 h-40 rounded-full border-[16px] border-white/5 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-[16px] border-emerald-400 opacity-80" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${capacity}%, 0 ${capacity}%)` }}></div>
               <div className="flex flex-col items-center justify-center z-10">
                 <span className="text-3xl font-bold text-white">{capacity}%</span>
                 <span className="text-xs text-white/50">Capacity</span>
               </div>
            </div>
            
            <p className="text-sm font-semibold text-white mt-8 z-10">Total Stadium Utilization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
