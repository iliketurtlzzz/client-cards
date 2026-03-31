"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, useTheme } from "./theme-context";
import { useState, createContext, useContext, ReactNode } from "react";
import { defaultClients, Client } from "./data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

interface ClientContextValue {
  clients: Client[];
  activeClient: Client;
  setActiveClientId: (id: string) => void;
  addClient: (c: Client) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  showWizard: boolean;
  setShowWizard: (v: boolean) => void;
  editingClientId: string | null;
  setEditingClientId: (id: string | null) => void;
}

const ClientContext = createContext<ClientContextValue>({
  clients: defaultClients, activeClient: defaultClients[0],
  setActiveClientId: () => {}, addClient: () => {}, updateClient: () => {}, deleteClient: () => {},
  showWizard: false, setShowWizard: () => {}, editingClientId: null, setEditingClientId: () => {},
});

export const useClientHub = () => useContext(ClientContext);

function ClientHubProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(defaultClients);
  const [activeId, setActiveId] = useState(defaultClients[0].id);
  const [showWizard, setShowWizard] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const activeClient = clients.find((c) => c.id === activeId) || clients[0];

  return (
    <ClientContext.Provider value={{
      clients, activeClient, setActiveClientId: setActiveId,
      addClient: (c) => { setClients((p) => [...p, c]); setActiveId(c.id); },
      updateClient: (c) => setClients((p) => p.map((x) => (x.id === c.id ? c : x))),
      deleteClient: (id) => setClients((p) => { const n = p.filter((x) => x.id !== id); if (activeId === id && n.length) setActiveId(n[0].id); return n; }),
      showWizard, setShowWizard, editingClientId, setEditingClientId,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { clients, activeClient, setActiveClientId, setShowWizard, setEditingClientId } = useClientHub();
  const dark = theme === "dark";
  const dot: Record<string, string> = { Active: "bg-emerald-400", Onboarding: "bg-amber-400", Paused: "bg-neutral-400" };

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col backdrop-blur-xl ${dark ? "bg-black/80 border-r border-white/[0.06]" : "bg-white/70 border-r border-black/[0.04]"}`}>
      <div className="gradient-accent h-[2px] w-full" />

      {/* Logo */}
      <div className={`flex h-14 items-center justify-between px-5 ${dark ? "border-b border-white/[0.06]" : "border-b border-black/[0.04]"}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-[11px] text-white">MW</div>
          <div>
            <h1 className={`text-[13px] font-semibold tracking-tight ${dark ? "text-white" : "text-neutral-900"}`}>Marketwake</h1>
            <p className={`text-[10px] tracking-wide ${dark ? "text-neutral-500" : "text-neutral-400"}`}>Client Hub</p>
          </div>
        </div>
        <button onClick={toggleTheme} className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${dark ? "text-neutral-500 hover:text-amber-400 hover:bg-white/[0.06]" : "text-neutral-400 hover:text-amber-500 hover:bg-black/[0.04]"}`}>
          {dark ? (
            <svg className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          ) : (
            <svg className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          )}
        </button>
      </div>

      {/* Client list */}
      <div className={`px-4 pt-4 pb-1.5`}>
        <p className={`text-[10px] font-medium uppercase tracking-widest ${dark ? "text-neutral-600" : "text-neutral-400"}`}>Clients</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-1 overflow-y-auto">
        {clients.map((c) => {
          const active = c.id === activeClient.id;
          return (
            <button key={c.id} onClick={() => setActiveClientId(c.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${active ? (dark ? "bg-white/[0.08]" : "bg-black/[0.04]") : (dark ? "hover:bg-white/[0.04]" : "hover:bg-black/[0.02]")}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br ${c.color} text-[11px] font-bold text-white shrink-0`}>{c.initials}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium truncate ${active ? (dark ? "text-white" : "text-neutral-900") : (dark ? "text-neutral-400" : "text-neutral-600")}`}>{c.name}</p>
                <p className={`text-[10px] truncate ${dark ? "text-neutral-600" : "text-neutral-400"}`}>{c.industry}</p>
              </div>
              <span className={`h-[6px] w-[6px] rounded-full shrink-0 ${dot[c.status]}`} />
            </button>
          );
        })}
      </nav>

      <div className={`p-3 ${dark ? "border-t border-white/[0.06]" : "border-t border-black/[0.04]"}`}>
        <button onClick={() => { setEditingClientId(null); setShowWizard(true); }} className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${dark ? "bg-white/[0.06] text-neutral-300 hover:bg-white/[0.1]" : "bg-black/[0.03] text-neutral-600 hover:bg-black/[0.06]"}`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Client
        </button>
      </div>
    </aside>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`ml-[260px] flex-1 min-h-screen ${dark ? "bg-black" : "bg-[#f5f5f7]"}`}>{children}</main>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <title>Marketwake Client Hub</title>
        <meta name="description" content="Marketwake internal client hub" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ClientHubProvider>
            <AppShell>{children}</AppShell>
          </ClientHubProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
