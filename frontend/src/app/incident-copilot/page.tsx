export default function IncidentCopilot() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Incident Copilot</h2>
        <p className="text-muted-foreground mb-8">AI-assisted incident resolution and emergency dispatch.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white/90">Active Incidents</h3>
            
            {[
              { id: "INC-992", type: "Medical", loc: "Section 104", time: "2 min ago", status: "Dispatching" },
              { id: "INC-991", type: "Security", loc: "Gate C", time: "15 min ago", status: "Resolved" }
            ].map(inc => (
              <div key={inc.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{inc.id}</span>
                  <h4 className="text-white font-medium mt-2">{inc.type} Emergency</h4>
                  <p className="text-xs text-muted-foreground">{inc.loc} • {inc.time}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${inc.status === 'Resolved' ? 'bg-white/10 text-white/50' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col">
            <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              AI Copilot Chat
            </h3>
            <div className="flex-1 bg-white/5 rounded-lg p-3 text-sm text-white/70 mb-4 italic">
              "How should I handle a lost child at Gate C?"
            </div>
            <div className="mt-auto relative">
              <input type="text" placeholder="Ask AI..." className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-cyan-400 transition-colors" disabled />
              <span className="absolute right-3 top-2.5 text-xs text-white/30">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
