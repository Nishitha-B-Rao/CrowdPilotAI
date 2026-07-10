"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function IncidentCopilot() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/copilot/incidents/upload`, {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch (err) {
      console.error("Failed to upload incidents", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Incident Copilot</h2>
            <p className="text-muted-foreground">AI-assisted incident resolution and emergency dispatch.</p>
          </div>
          <label className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center text-sm font-medium">
            <Upload size={16} className="mr-2" />
            Upload incident.csv
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white/90 flex items-center">
              Active Incidents
              {loading && <span className="ml-4 text-xs font-normal text-cyan-400 animate-pulse">Processing with AI...</span>}
            </h3>
            
            {incidents.length === 0 && !loading && (
              <div className="text-white/50 text-sm italic p-4 border border-white/10 rounded-lg border-dashed text-center">
                Upload a CSV to generate AI incident responses.
              </div>
            )}

            {incidents.map((inc, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{inc.incident}</h4>
                    <p className="text-xs text-muted-foreground">{inc.gate} • {inc.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    inc.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    inc.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                    inc.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {inc.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm bg-black/40 rounded-lg p-4 border border-white/5 space-y-2">
                  <p><span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">AI Reasoning:</span> <span className="text-white/80">{inc.reasoning}</span></p>
                  <p><span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">Recommended Action:</span> <span className="text-white/80">{inc.response}</span></p>
                  {inc.announcement !== "N/A" && (
                    <p><span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">Public Announcement:</span> <span className="text-white/80 italic">"{inc.announcement}"</span></p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col h-[400px]">
            <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              AI Copilot Terminal
            </h3>
            <div className="flex-1 bg-white/5 rounded-lg p-3 text-xs text-emerald-400 mb-4 font-mono overflow-y-auto">
              {loading ? (
                <>
                  <p>{">"} Processing CSV...</p>
                  <p className="animate-pulse">{">"} Vertex AI generating response plans...</p>
                </>
              ) : incidents.length > 0 ? (
                <>
                  <p>{">"} CSV uploaded successfully.</p>
                  <p>{">"} AI assigned priorities and generated action plans.</p>
                  <p>{">"} System ready.</p>
                </>
              ) : (
                <p>{">"} System idle. Waiting for incident reports...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
