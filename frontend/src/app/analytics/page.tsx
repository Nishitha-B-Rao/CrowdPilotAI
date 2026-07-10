export default function Analytics() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Deep Analytics</h2>
        <p className="text-muted-foreground mb-8">Historical crowd flow patterns and predictive modeling.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
            <div className="flex items-end space-x-2 h-40 w-full px-8 opacity-70 group-hover:opacity-100 transition-opacity">
              {[40, 70, 45, 90, 65, 85, 100, 60, 50, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/50 to-purple-400 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-sm font-semibold text-white mt-6 z-10">Gate C Entry Volume (Last 2 Hrs)</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent"></div>
            <div className="relative w-40 h-40 rounded-full border-[16px] border-emerald-500/20 border-t-emerald-400 border-r-emerald-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col mt-4">
              <span className="text-3xl font-bold text-white">72%</span>
              <span className="text-xs text-white/50">Capacity</span>
            </div>
            <p className="text-sm font-semibold text-white mt-12 z-10">Total Stadium Utilization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
