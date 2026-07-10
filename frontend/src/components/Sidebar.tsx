"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle, BarChart3, DollarSign } from "lucide-react";

export function Sidebar() {
  const [isDark, setIsDark] = useState(true);

  // Apply dark mode to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const pathname = usePathname();

  // Helper to determine link styles
  const getLinkClasses = (path: string) => {
    return pathname === path
      ? "flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-primary/20 transition-all"
      : "flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all";
  };

  const getIconClasses = (path: string) => {
    return pathname === path ? "mr-3" : "mr-3 opacity-70";
  };

  return (
    <aside className="w-full md:w-64 glass border-b md:border-b-0 md:border-r-0 border-white/5 flex flex-col md:m-4 md:mr-0 md:rounded-2xl relative shrink-0">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="p-4 md:p-6 relative hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">CrowdPilot AI</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-semibold">Stadium Intel</p>
      </div>
      
      <nav className="flex-none md:flex-1 overflow-x-auto md:overflow-y-auto py-2 md:py-4 relative z-10 custom-scrollbar">
        <ul className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 px-2 md:px-4">
          <li>
            <Link href="/" className={getLinkClasses("/")}>
              <LayoutDashboard size={18} className={getIconClasses("/")} />
              Volunteer Dashboard
            </Link>
          </li>
          <li>
            <Link href="/incident-copilot" className={getLinkClasses("/incident-copilot")}>
              <AlertTriangle size={18} className={getIconClasses("/incident-copilot")} />
              Incident Copilot
            </Link>
          </li>
          <li>
            <Link href="/analytics" className={getLinkClasses("/analytics")}>
              <BarChart3 size={18} className={getIconClasses("/analytics")} />
              Analytics
            </Link>
          </li>
          <li>
            <Link href="/cost-dashboard" className={getLinkClasses("/cost-dashboard")}>
              <DollarSign size={18} className={getIconClasses("/cost-dashboard")} />
              Cost Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      {/* Added Settings Panel for Hackathon Requirements */}
      <div className="px-6 py-4 relative z-10 border-t border-white/5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settings</h3>
        
        <div className="space-y-3">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Dark Mode</span>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-5 rounded-full relative transition-colors shadow-inner ${isDark ? 'bg-emerald-500' : 'bg-gray-400'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transform transition-transform ${isDark ? 'right-1' : 'translate-x-1'}`}></span>
            </button>
          </div>
          
        </div>
      </div>
      
      <div className="p-4 relative z-10 m-4 glass-panel rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30">V4</div>
          <div>
            <p className="text-sm font-semibold text-white">Volunteer 42</p>
            <p className="text-xs text-primary/80 font-medium">Gate C Team</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
