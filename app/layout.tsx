"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, useTheme } from "./theme-context";
import { useState, createContext, useContext, ReactNode } from "react";
import { clients, Client } from "./data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/* ── Client selection context ── */
const ClientContext = createContext<{
  activeClient: Client;
  setActiveClientId: (id: string) => void;
}>({
  activeClient: clients[0],
  setActiveClientId: () => {},
});

export const useActiveClient = () => useContext(ClientContext);

function ClientProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState(clients[0].id);
  const activeClient = clients.find((c) => c.id === activeId) || clients[0];
  return (
    <ClientContext.Provider value={{ activeClient, setActiveClientId: setActiveId }}>
      {children}
    </ClientContext.Provider>
  );
}

/* ── Sidebar ── */
function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { activeClient, setActiveClientId } = useActiveClient();
  const dark = theme === "dark";

  const statusDot: Record<string, string> = {
    Active: "bg-emerald-400",
    Onboarding: "bg-amber-400",
    Paused: "bg-slate-400",
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col ${
        dark
          ? "bg-[#0d1117] border-r border-[#1e293b]"
          : "bg-white border-r border-slate-200"
      }`}
    >
      <div className="gradient-accent h-[2px] w-full" />

      {/* Header */}
      <div
        className={`flex h-14 items-center justify-between border-b px-4 ${
          dark ? "border-[#1e293b]" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-[11px] text-white">
            MW
          </div>
          <div>
            <h1 className={`text-xs font-semibold tracking-wide ${dark ? "text-white" : "text-slate-900"}`}>
              Marketwake
            </h1>
            <p className={`text-[9px] uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Client Hub
            </p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            dark
              ? "bg-[#1a2234] text-slate-400 hover:text-yellow-400 hover:bg-[#1e293b]"
              : "bg-slate-100 text-slate-500 hover:text-amber-500 hover:bg-slate-200"
          }`}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </div>

      {/* Client list */}
      <div className={`px-3 pt-3 pb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        <p className="text-[10px] font-semibold uppercase tracking-widest">Clients</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-1 overflow-y-auto">
        {clients.map((client) => {
          const isActive = client.id === activeClient.id;
          return (
            <button
              key={client.id}
              onClick={() => setActiveClientId(client.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? dark
                    ? "bg-blue-600/15 border border-blue-500/20"
                    : "bg-blue-50 border border-blue-200"
                  : dark
                    ? "hover:bg-[#1a2234] border border-transparent"
                    : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${client.color} text-xs font-bold text-white shrink-0`}
              >
                {client.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isActive
                      ? "text-blue-500"
                      : dark
                        ? "text-slate-300"
                        : "text-slate-700"
                  }`}
                >
                  {client.name}
                </p>
                <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  {client.industry}
                </p>
              </div>
              <span className={`h-2 w-2 rounded-full shrink-0 ${statusDot[client.status]}`} />
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`border-t p-3 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
          dark
            ? "text-blue-400 hover:bg-[#1a2234]"
            : "text-blue-600 hover:bg-slate-50"
        }`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Client
        </div>
      </div>
    </aside>
  );
}

/* ── Shell ── */
function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`ml-64 flex-1 min-h-screen ${dark ? "bg-[#0a0f1a]" : "bg-slate-50"}`}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <title>Marketwake Client Hub</title>
        <meta name="description" content="Marketwake internal client hub -- all client info in one place." />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ClientProvider>
            <AppShell>{children}</AppShell>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
