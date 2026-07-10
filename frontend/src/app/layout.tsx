import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
            <div className="p-4 border-b border-border">
              <h1 className="text-xl font-bold tracking-tight text-primary">CrowdPilot AI</h1>
              <p className="text-xs text-muted-foreground">Stadium Intelligence</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                    Volunteer Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                    Incident Copilot
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                    Cost Dashboard
                  </a>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">V</div>
                <div>
                  <p className="text-sm font-medium">Volunteer 42</p>
                  <p className="text-xs text-muted-foreground">Gate C Team</p>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
              <h2 className="text-sm font-medium">Live Operations</h2>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-xs font-medium text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  System Online
                </span>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 bg-background/95">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
