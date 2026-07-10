import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LayoutDashboard, AlertTriangle, BarChart3, DollarSign, Activity } from "lucide-react";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrowdPilot AI - Stadium Operations",
  description: "AI Copilot for Stadium Volunteers - Explainable Crowd Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased relative`}>
        {/* Ambient glow effects behind everything */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
        
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 glass border-r-0 border-r-white/5 hidden md:flex flex-col m-4 mr-0 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <div className="p-6 relative">
              <h1 className="text-2xl font-bold tracking-tight text-gradient">CrowdPilot AI</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-semibold">Stadium Intel</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 relative z-10">
              <ul className="space-y-2 px-4">
                <li>
                  <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-primary/20 transition-all">
                    <LayoutDashboard size={18} className="mr-3" />
                    Volunteer Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <AlertTriangle size={18} className="mr-3 opacity-70" />
                    Incident Copilot
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <BarChart3 size={18} className="mr-3 opacity-70" />
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <DollarSign size={18} className="mr-3 opacity-70" />
                    Cost Dashboard
                  </a>
                </li>
              </ul>
            </nav>
            
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
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
            <header className="h-20 flex items-center justify-between px-8 z-20">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white/90">Live Operations</h2>
                <p className="text-sm text-muted-foreground">Real-time stadium insights and AI recommendations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="glass-panel px-4 py-2 rounded-full flex items-center text-xs font-medium text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <span className="relative flex h-2.5 w-2.5 mr-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  System Online
                </div>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto px-8 pb-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
