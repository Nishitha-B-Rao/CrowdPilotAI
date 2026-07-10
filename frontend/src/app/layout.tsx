import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";

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
        
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          <Sidebar />
          
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
