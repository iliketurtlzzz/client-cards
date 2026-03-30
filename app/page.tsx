"use client";

import { useState } from "react";
import { useTheme } from "./theme-context";
import { useActiveClient } from "./layout";

type Tab = "overview" | "personas" | "brand" | "services" | "writing" | "seo";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "personas", label: "Audience Personas" },
  { key: "brand", label: "Brand Voice" },
  { key: "services", label: "Services" },
  { key: "writing", label: "Writing Rules" },
  { key: "seo", label: "SEO" },
];

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function renewalColor(days: number): string {
  if (days <= 0) return "text-red-500";
  if (days <= 30) return "text-red-400";
  if (days <= 90) return "text-amber-400";
  return "text-emerald-400";
}

function renewalBg(days: number): string {
  if (days <= 0) return "bg-red-500";
  if (days <= 30) return "bg-red-400";
  if (days <= 90) return "bg-amber-400";
  return "bg-emerald-400";
}

export default function ClientHub() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { theme } = useTheme();
  const { activeClient: client } = useActiveClient();
  const dark = theme === "dark";

  const card = `rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`;
  const sectionTitle = `text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`;
  const textPrimary = dark ? "text-white" : "text-slate-900";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const textMuted = dark ? "text-slate-500" : "text-slate-400";

  const statusBadge: Record<string, string> = {
    Active: dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700",
    Onboarding: dark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700",
    Paused: dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-500",
  };

  const days = daysUntil(client.renewalDate);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${client.color} text-lg font-bold text-white`}>
            {client.initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-bold ${textPrimary}`}>{client.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[client.status]}`}>
                {client.status}
              </span>
            </div>
            <p className={`text-sm ${textSecondary}`}>{client.industry}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
            <span className={`h-2 w-2 rounded-full ${renewalBg(days)}`} />
            <span className={renewalColor(days)}>
              {days > 0 ? `${days} days to renewal` : "Renewal overdue"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className={`mb-8 flex gap-1 border-b ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? `${dark ? "text-blue-400" : "text-blue-600"}`
                : `${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "personas" && <PersonasTab />}
      {activeTab === "brand" && <BrandVoiceTab />}
      {activeTab === "services" && <ServicesTab />}
      {activeTab === "writing" && <WritingRulesTab />}
      {activeTab === "seo" && <SEOTab />}
    </div>
  );

  /* ─────────── Overview ─────────── */
  function OverviewTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Website & Info */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Client Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Website</span>
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-500 hover:text-blue-400"
                >
                  {client.website.replace("https://", "")}
                  <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Industry</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{client.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[client.status]}`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          {/* POC Contact */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Point of Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  dark ? "bg-[#1a2234]" : "bg-slate-100"
                }`}>
                  <svg className={`h-5 w-5 ${textSecondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>{client.pocName}</p>
                  <p className={`text-xs ${textMuted}`}>{client.pocRole}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Email</span>
                <a href={`mailto:${client.pocEmail}`} className="text-sm font-medium text-blue-500 hover:text-blue-400">
                  {client.pocEmail}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Phone</span>
                <span className={`text-sm font-medium ${textPrimary}`}>{client.pocPhone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Renewal */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Contract & Renewal</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className={`text-sm ${textSecondary}`}>Renewal Date</p>
                <p className={`text-lg font-bold ${textPrimary}`}>
                  {new Date(client.renewalDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={`mt-1 text-sm font-medium ${renewalColor(days)}`}>
                  {days > 0 ? `${days} days remaining` : `${Math.abs(days)} days overdue`}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${
                  dark ? "bg-[#1a2234]" : "bg-slate-100"
                }`}>
                  <svg className="absolute h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke={dark ? "#1e293b" : "#e2e8f0"} strokeWidth="5" />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke={days <= 30 ? "#f87171" : days <= 90 ? "#fbbf24" : "#34d399"}
                      strokeWidth="5"
                      strokeDasharray={`${Math.min(Math.max(days / 365, 0), 1) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`text-lg font-bold ${renewalColor(days)}`}>{days > 0 ? days : 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scope & Deliverables */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Scope & Deliverables</h3>
            <div className={`rounded-lg border-2 border-dashed p-6 text-center ${
              dark ? "border-[#1e293b]" : "border-slate-200"
            }`}>
              <svg className={`mx-auto h-8 w-8 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className={`mt-2 text-sm font-medium ${textPrimary}`}>{client.scopeDocumentName}</p>
              <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Scope
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={card + " p-6"}>
          <h3 className={sectionTitle + " mb-4"}>Notes</h3>
          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
            {client.notes}
          </p>
        </div>
      </div>
    );
  }

  /* ─────────── Personas ─────────── */
  function PersonasTab() {
    const colors = [
      { bg: dark ? "bg-blue-500/10" : "bg-blue-50", text: dark ? "text-blue-400" : "text-blue-600", border: dark ? "border-blue-500/20" : "border-blue-200" },
      { bg: dark ? "bg-purple-500/10" : "bg-purple-50", text: dark ? "text-purple-400" : "text-purple-600", border: dark ? "border-purple-500/20" : "border-purple-200" },
      { bg: dark ? "bg-emerald-500/10" : "bg-emerald-50", text: dark ? "text-emerald-400" : "text-emerald-600", border: dark ? "border-emerald-500/20" : "border-emerald-200" },
      { bg: dark ? "bg-amber-500/10" : "bg-amber-50", text: dark ? "text-amber-400" : "text-amber-600", border: dark ? "border-amber-500/20" : "border-amber-200" },
      { bg: dark ? "bg-rose-500/10" : "bg-rose-50", text: dark ? "text-rose-400" : "text-rose-600", border: dark ? "border-rose-500/20" : "border-rose-200" },
    ];

    return (
      <div>
        <p className={`mb-6 text-sm ${textSecondary}`}>
          {client.icps.length} ideal customer {client.icps.length === 1 ? "profile" : "profiles"} defined for {client.name}
        </p>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {client.icps.map((icp, i) => {
            const color = colors[i % colors.length];
            return (
              <div key={icp.id} className={`${card} overflow-hidden`}>
                {/* Card header */}
                <div className={`px-6 py-4 ${color.bg} border-b ${color.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      dark ? "bg-white/10" : "bg-white/80"
                    }`}>
                      <svg className={`h-5 w-5 ${color.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${color.text}`}>{icp.name}</h3>
                      <p className={`text-xs ${textMuted}`}>{icp.ageRange} years old</p>
                    </div>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Role</p>
                    <p className={`mt-1 text-sm ${textPrimary}`}>{icp.role}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Company Size</p>
                      <p className={`mt-1 text-sm ${textPrimary}`}>{icp.companySize}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Industry</p>
                      <p className={`mt-1 text-sm ${textPrimary}`}>{icp.industry}</p>
                    </div>
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Pain Points</p>
                    <ul className="mt-2 space-y-1.5">
                      {icp.painPoints.map((pp, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                          <span className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{pp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Content Preferences</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {icp.contentPreferences.map((pref, j) => (
                        <span
                          key={j}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─────────── Brand Voice ─────────── */
  function BrandVoiceTab() {
    return (
      <div className="space-y-8">
        {/* Brand Positioning */}
        <div className={card + " p-6"}>
          <h3 className={sectionTitle + " mb-4"}>Brand Positioning</h3>
          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
            {client.brandPositioning || "No brand positioning defined yet."}
          </p>
        </div>

        {/* Tone Attributes */}
        {client.toneAttributes.length > 0 && (
          <div>
            <h3 className={sectionTitle + " mb-4"}>Tone Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {client.toneAttributes.map((tone, i) => (
                <div key={i} className={card + " p-5"}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {tone.positive}
                    </span>
                    <span className={`text-xs ${textMuted}`}>not</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      dark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-700"
                    }`}>
                      {tone.negative}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${textSecondary}`}>{tone.description}</p>
                  <div className={`mt-3 rounded-lg p-3 ${dark ? "bg-[#0d1117]" : "bg-slate-50"}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Example</p>
                    <p className={`mt-1 text-xs italic leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
                      &ldquo;{tone.example}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* On/Off Voice Examples */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {client.onVoiceExamples.length > 0 && (
            <div className={card + " p-6"}>
              <div className="flex items-center gap-2 mb-4">
                <svg className={`h-5 w-5 ${dark ? "text-emerald-400" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={sectionTitle}>On-Voice Examples</h3>
              </div>
              <ul className="space-y-3">
                {client.onVoiceExamples.map((ex, i) => (
                  <li key={i} className={`rounded-lg p-3 text-sm leading-relaxed ${
                    dark ? "bg-emerald-500/5 text-emerald-300 border border-emerald-500/10" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                  }`}>
                    &ldquo;{ex}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}
          {client.offVoiceExamples.length > 0 && (
            <div className={card + " p-6"}>
              <div className="flex items-center gap-2 mb-4">
                <svg className={`h-5 w-5 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={sectionTitle}>Off-Voice Examples</h3>
              </div>
              <ul className="space-y-3">
                {client.offVoiceExamples.map((ex, i) => (
                  <li key={i} className={`rounded-lg p-3 ${
                    dark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50 border border-red-100"
                  }`}>
                    <p className={`text-sm leading-relaxed ${dark ? "text-red-300" : "text-red-800"}`}>
                      &ldquo;{ex.text}&rdquo;
                    </p>
                    <p className={`mt-1 text-xs ${dark ? "text-red-400/60" : "text-red-600/60"}`}>
                      {ex.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────── Services ─────────── */
  function ServicesTab() {
    return (
      <div className="space-y-8">
        {/* Services Grid */}
        <div>
          <h3 className={sectionTitle + " mb-4"}>Services</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {client.services.map((svc, i) => (
              <div key={i} className={card + " p-5"}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                    dark ? "bg-blue-500/10" : "bg-blue-50"
                  }`}>
                    <svg className={`h-5 w-5 ${dark ? "text-blue-400" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${textPrimary}`}>{svc.name}</h4>
                    <p className={`mt-1 text-xs ${textSecondary}`}>{svc.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <div className={card + " p-6"}>
          <h3 className={sectionTitle + " mb-4"}>Differentiators</h3>
          <ul className="space-y-3">
            {client.differentiators.map((diff, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? "text-purple-400" : "text-purple-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* ─────────── Writing Rules ─────────── */
  function WritingRulesTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Writing Rules (Do's) */}
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              dark ? "bg-emerald-500/10" : "bg-emerald-50"
            }`}>
              <svg className={`h-5 w-5 ${dark ? "text-emerald-400" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
              Writing Rules
            </h3>
          </div>
          <ul className="space-y-3">
            {client.writingRules.map((rule, i) => (
              <li key={i} className={`flex items-start gap-3 rounded-lg p-3 ${
                dark ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-emerald-50/50 border border-emerald-100"
              }`}>
                <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${
                  dark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {i + 1}
                </span>
                <span className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Do Not Say */}
        <div className={card + " p-6"}>
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              dark ? "bg-red-500/10" : "bg-red-50"
            }`}>
              <svg className={`h-5 w-5 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-red-400" : "text-red-600"}`}>
              Do Not Say
            </h3>
          </div>
          <ul className="space-y-3">
            {client.doNotSay.map((phrase, i) => (
              <li key={i} className={`flex items-center gap-3 rounded-lg p-3 ${
                dark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50/50 border border-red-100"
              }`}>
                <svg className={`h-4 w-4 shrink-0 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{phrase}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* ─────────── SEO ─────────── */
  function SEOTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Target Keywords */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Target Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {client.targetKeywords.map((kw, i) => (
                <span
                  key={i}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    dark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Competitor URLs */}
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Competitor URLs</h3>
            <ul className="space-y-2">
              {client.competitorUrls.map((url, i) => (
                <li key={i} className={`flex items-center gap-2 rounded-lg p-3 ${
                  dark ? "bg-[#0d1117]" : "bg-slate-50"
                }`}>
                  <svg className={`h-4 w-4 shrink-0 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-400 truncate"
                  >
                    {url.replace("https://", "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Notes */}
        <div className={card + " p-6"}>
          <h3 className={sectionTitle + " mb-4"}>SEO Notes & Requirements</h3>
          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
            {client.seoNotes || "No SEO notes defined yet."}
          </p>
        </div>
      </div>
    );
  }
}
