"use client";

import { useState } from "react";
import { useTheme } from "./theme-context";
import { useClientHub } from "./layout";
import { Client, ICP, TeamNote, industryOptions, gradientOptions } from "./data";

type Tab = "overview" | "personas" | "brand" | "services" | "writing" | "notes";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "personas", label: "Audience Personas" },
  { key: "brand", label: "Brand Voice" },
  { key: "services", label: "Services" },
  { key: "writing", label: "Writing Rules" },
  { key: "notes", label: "Team Notes" },
];

const wizardSteps = ["Basic Info", "Brand Voice", "Audience", "Services & Rules", "Review"];

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
function renewalColor(d: number) { return d <= 0 ? "text-red-500" : d <= 30 ? "text-red-400" : d <= 90 ? "text-amber-400" : "text-emerald-400"; }
function renewalBg(d: number) { return d <= 0 ? "bg-red-500" : d <= 30 ? "bg-red-400" : d <= 90 ? "bg-amber-400" : "bg-emerald-400"; }

/* ── Wizard data ── */
interface WizardData {
  name: string; industry: string; website: string; status: "Active" | "Onboarding" | "Paused";
  color: string; initials: string;
  pocName: string; pocEmail: string; pocPhone: string; pocRole: string;
  renewalDate: string; scopeDocumentName: string; notes: string;
  brandPositioning: string; onVoiceText: string; offVoiceText: string;
  icps: ICP[];
  servicesText: string; differentiatorsText: string; writingRulesText: string; doNotSayText: string;
}

function emptyWizard(): WizardData {
  return {
    name: "", industry: "SaaS/Tech", website: "", status: "Onboarding",
    color: gradientOptions[0], initials: "",
    pocName: "", pocEmail: "", pocPhone: "", pocRole: "",
    renewalDate: "", scopeDocumentName: "", notes: "",
    brandPositioning: "", onVoiceText: "", offVoiceText: "",
    icps: [],
    servicesText: "", differentiatorsText: "", writingRulesText: "", doNotSayText: "",
  };
}

function clientToWizard(c: Client): WizardData {
  return {
    name: c.name, industry: c.industry, website: c.website, status: c.status,
    color: c.color, initials: c.initials,
    pocName: c.pocName, pocEmail: c.pocEmail, pocPhone: c.pocPhone, pocRole: c.pocRole,
    renewalDate: c.renewalDate, scopeDocumentName: c.scopeDocumentName, notes: c.notes,
    brandPositioning: c.brandPositioning,
    onVoiceText: c.onVoiceExamples.join("\n"),
    offVoiceText: c.offVoiceExamples.map((e) => `${e.text} | ${e.reason}`).join("\n"),
    icps: [...c.icps],
    servicesText: c.services.map((s) => `${s.name}: ${s.details}`).join("\n"),
    differentiatorsText: c.differentiators.join("\n"),
    writingRulesText: c.writingRules.join("\n"),
    doNotSayText: c.doNotSay.join("\n"),
  };
}

function wizardToClient(w: WizardData, existingId?: string, existingNotes?: TeamNote[]): Client {
  return {
    id: existingId || Date.now().toString(),
    name: w.name, industry: w.industry, website: w.website, status: w.status,
    color: w.color, initials: w.initials || w.name.split(/\s+/).map((x) => x[0]).join("").toUpperCase().slice(0, 2),
    pocName: w.pocName, pocEmail: w.pocEmail, pocPhone: w.pocPhone, pocRole: w.pocRole,
    renewalDate: w.renewalDate, scopeDocumentName: w.scopeDocumentName, notes: w.notes,
    brandPositioning: w.brandPositioning,
    toneAttributes: [],
    onVoiceExamples: w.onVoiceText.split("\n").map((s) => s.trim()).filter(Boolean),
    offVoiceExamples: w.offVoiceText.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
      const [text, reason] = line.split("|").map((p) => p.trim());
      return { text: text || line, reason: reason || "" };
    }),
    icps: w.icps,
    services: w.servicesText.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
      const [name, ...rest] = line.split(":");
      return { name: name.trim(), details: rest.join(":").trim() };
    }),
    differentiators: w.differentiatorsText.split("\n").map((s) => s.trim()).filter(Boolean),
    writingRules: w.writingRulesText.split("\n").map((s) => s.trim()).filter(Boolean),
    doNotSay: w.doNotSayText.split("\n").map((s) => s.trim()).filter(Boolean),
    teamNotes: existingNotes || [],
  };
}

export default function ClientHub() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { theme } = useTheme();
  const { activeClient: client, updateClient, showWizard, setShowWizard, editingClientId, setEditingClientId, addClient, clients, deleteClient } = useClientHub();
  const dark = theme === "dark";

  /* Wizard state */
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(emptyWizard());
  const [icpDraft, setIcpDraft] = useState({ name: "", role: "", companySize: "", industry: "", ageRange: "", painPoints: "", contentPreferences: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* Inline editing state */
  const [editing, setEditing] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string, string>>({});

  /* Team notes */
  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteText, setNoteText] = useState("");

  const card = `rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`;
  const sectionTitle = `text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`;
  const textPrimary = dark ? "text-white" : "text-slate-900";
  const textSecondary = dark ? "text-slate-400" : "text-slate-500";
  const textMuted = dark ? "text-slate-500" : "text-slate-400";
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${dark ? "bg-[#1a2234] border-[#1e293b] text-white placeholder-slate-500 focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"}`;
  const labelClass = `mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`;

  const statusBadge: Record<string, string> = {
    Active: dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700",
    Onboarding: dark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700",
    Paused: dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-500",
  };

  const days = daysUntil(client.renewalDate);

  /* ── Inline edit helpers ── */
  function startEdit(field: string, value: string) { setEditing(field); setEditBuffer({ ...editBuffer, [field]: value }); }
  function cancelEdit() { setEditing(null); }
  function saveField(field: string, value: string) {
    updateClient({ ...client, [field]: value });
    setEditing(null);
  }
  function saveArrayField(field: string, value: string) {
    updateClient({ ...client, [field]: value.split("\n").map((s) => s.trim()).filter(Boolean) });
    setEditing(null);
  }

  /* Editable text field */
  function EditableField({ label, field, value }: { label: string; field: string; value: string }) {
    const isEditing = editing === field;
    return (
      <div className="flex items-center justify-between">
        <span className={`text-sm ${textSecondary}`}>{label}</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input type="text" value={editBuffer[field] || ""} onChange={(e) => setEditBuffer({ ...editBuffer, [field]: e.target.value })} className={`${inputClass} w-48`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveField(field, editBuffer[field] || ""); if (e.key === "Escape") cancelEdit(); }} />
            <button onClick={() => saveField(field, editBuffer[field] || "")} className="text-emerald-500 hover:text-emerald-400"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-300"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEdit(field, value)}>
            <span className={`text-sm font-medium ${textPrimary}`}>{value || "Click to add"}</span>
            <svg className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
          </div>
        )}
      </div>
    );
  }

  /* Editable textarea block */
  function EditableBlock({ label, field, value, isArray }: { label: string; field: string; value: string; isArray?: boolean }) {
    const isEditing = editing === field;
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className={sectionTitle}>{label}</h3>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => isArray ? saveArrayField(field, editBuffer[field] || "") : saveField(field, editBuffer[field] || "")} className="text-xs font-medium text-emerald-500 hover:text-emerald-400">Save</button>
              <button onClick={cancelEdit} className="text-xs font-medium text-slate-400 hover:text-slate-300">Cancel</button>
            </div>
          ) : (
            <button onClick={() => startEdit(field, value)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
          )}
        </div>
        {isEditing ? (
          <textarea value={editBuffer[field] || ""} onChange={(e) => setEditBuffer({ ...editBuffer, [field]: e.target.value })} rows={5} className={inputClass} autoFocus />
        ) : (
          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{value || "Click Edit to add content."}</p>
        )}
      </div>
    );
  }

  /* ── Open wizard for editing ── */
  function openEditWizard() {
    setEditingClientId(client.id);
    setWizardData(clientToWizard(client));
    setWizardStep(0);
    setShowWizard(true);
  }

  function openNewWizard() {
    setEditingClientId(null);
    setWizardData(emptyWizard());
    setWizardStep(0);
    setShowWizard(true);
  }

  const updateWizard = (field: string, value: unknown) => setWizardData((p) => ({ ...p, [field]: value }));

  const addIcp = () => {
    if (!icpDraft.name.trim()) return;
    const newIcp: ICP = {
      id: Date.now().toString(),
      name: icpDraft.name, role: icpDraft.role, companySize: icpDraft.companySize,
      industry: icpDraft.industry, ageRange: icpDraft.ageRange,
      painPoints: icpDraft.painPoints.split("\n").map((s) => s.trim()).filter(Boolean),
      contentPreferences: icpDraft.contentPreferences.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    setWizardData((p) => ({ ...p, icps: [...p.icps, newIcp] }));
    setIcpDraft({ name: "", role: "", companySize: "", industry: "", ageRange: "", painPoints: "", contentPreferences: "" });
  };

  const saveWizard = () => {
    const existingClient = editingClientId ? clients.find((c) => c.id === editingClientId) : null;
    const newClient = wizardToClient(wizardData, editingClientId || undefined, existingClient?.teamNotes);
    if (existingClient) {
      newClient.toneAttributes = existingClient.toneAttributes;
      updateClient(newClient);
    } else {
      addClient(newClient);
    }
    setShowWizard(false);
    setEditingClientId(null);
  };

  /* ── Add team note ── */
  function addNote() {
    if (!noteText.trim()) return;
    const note: TeamNote = { id: Date.now().toString(), author: noteAuthor || "Team Member", date: new Date().toISOString().split("T")[0], text: noteText };
    updateClient({ ...client, teamNotes: [note, ...client.teamNotes] });
    setNoteText("");
  }

  function deleteNote(id: string) {
    updateClient({ ...client, teamNotes: client.teamNotes.filter((n) => n.id !== id) });
  }

  /* ── Remove ICP ── */
  function removeIcp(id: string) {
    updateClient({ ...client, icps: client.icps.filter((i) => i.id !== id) });
  }

  /* ── Remove service ── */
  function removeService(idx: number) {
    updateClient({ ...client, services: client.services.filter((_, i) => i !== idx) });
  }

  /* ── Remove differentiator ── */
  function removeDifferentiator(idx: number) {
    updateClient({ ...client, differentiators: client.differentiators.filter((_, i) => i !== idx) });
  }

  /* ── Remove writing rule / do not say ── */
  function removeWritingRule(idx: number) { updateClient({ ...client, writingRules: client.writingRules.filter((_, i) => i !== idx) }); }
  function removeDoNotSay(idx: number) { updateClient({ ...client, doNotSay: client.doNotSay.filter((_, i) => i !== idx) }); }
  function removeOnVoice(idx: number) { updateClient({ ...client, onVoiceExamples: client.onVoiceExamples.filter((_, i) => i !== idx) }); }
  function removeOffVoice(idx: number) { updateClient({ ...client, offVoiceExamples: client.offVoiceExamples.filter((_, i) => i !== idx) }); }

  /* ── Add inline items ── */
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [itemBuffer, setItemBuffer] = useState("");
  const [itemBuffer2, setItemBuffer2] = useState("");

  function addInlineItem(field: string) {
    if (!itemBuffer.trim()) return;
    if (field === "writingRules") updateClient({ ...client, writingRules: [...client.writingRules, itemBuffer.trim()] });
    else if (field === "doNotSay") updateClient({ ...client, doNotSay: [...client.doNotSay, itemBuffer.trim()] });
    else if (field === "differentiators") updateClient({ ...client, differentiators: [...client.differentiators, itemBuffer.trim()] });
    else if (field === "onVoiceExamples") updateClient({ ...client, onVoiceExamples: [...client.onVoiceExamples, itemBuffer.trim()] });
    else if (field === "offVoiceExamples") updateClient({ ...client, offVoiceExamples: [...client.offVoiceExamples, { text: itemBuffer.trim(), reason: itemBuffer2.trim() }] });
    else if (field === "services") updateClient({ ...client, services: [...client.services, { name: itemBuffer.trim(), details: itemBuffer2.trim() }] });
    setItemBuffer(""); setItemBuffer2(""); setAddingItem(null);
  }

  /* ── RENDER ── */
  return (
    <>
      {/* Wizard Modal */}
      {showWizard && <WizardModal />}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${client.color} text-lg font-bold text-white`}>{client.initials}</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`text-2xl font-bold ${textPrimary}`}>{client.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[client.status]}`}>{client.status}</span>
              </div>
              <p className={`text-sm ${textSecondary}`}>{client.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
              <span className={`h-2 w-2 rounded-full ${renewalBg(days)}`} />
              <span className={renewalColor(days)}>{days > 0 ? `${days} days to renewal` : "Renewal overdue"}</span>
            </div>
            <button onClick={openEditWizard} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">Edit Client</button>
          </div>
        </div>

        {/* Tab bar */}
        <div className={`mb-8 flex gap-1 border-b ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === tab.key ? (dark ? "text-blue-400" : "text-blue-600") : (dark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700")}`}>
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "personas" && <PersonasTab />}
        {activeTab === "brand" && <BrandVoiceTab />}
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "writing" && <WritingRulesTab />}
        {activeTab === "notes" && <NotesTab />}
      </div>
    </>
  );

  /* ═══════════ OVERVIEW ═══════════ */
  function OverviewTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Client Info</h3>
            <div className="space-y-3">
              <EditableField label="Website" field="website" value={client.website} />
              <EditableField label="Industry" field="industry" value={client.industry} />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${textSecondary}`}>Status</span>
                {editing === "status" ? (
                  <div className="flex gap-2">
                    {(["Active", "Onboarding", "Paused"] as const).map((s) => (
                      <button key={s} onClick={() => { updateClient({ ...client, status: s }); setEditing(null); }} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[s]}`}>{s}</button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditing("status")}>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[client.status]}`}>{client.status}</span>
                    <svg className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Point of Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                  <svg className={`h-5 w-5 ${textSecondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>{client.pocName}</p>
                  <p className={`text-xs ${textMuted}`}>{client.pocRole}</p>
                </div>
              </div>
              <EditableField label="Name" field="pocName" value={client.pocName} />
              <EditableField label="Role" field="pocRole" value={client.pocRole} />
              <EditableField label="Email" field="pocEmail" value={client.pocEmail} />
              <EditableField label="Phone" field="pocPhone" value={client.pocPhone} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Contract & Renewal</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <EditableField label="Renewal Date" field="renewalDate" value={client.renewalDate} />
                <p className={`mt-2 text-lg font-bold ${textPrimary}`}>
                  {new Date(client.renewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className={`mt-1 text-sm font-medium ${renewalColor(days)}`}>
                  {days > 0 ? `${days} days remaining` : `${Math.abs(days)} days overdue`}
                </p>
              </div>
              <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                <svg className="absolute h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke={dark ? "#1e293b" : "#e2e8f0"} strokeWidth="5" />
                  <circle cx="40" cy="40" r="35" fill="none" stroke={days <= 30 ? "#f87171" : days <= 90 ? "#fbbf24" : "#34d399"} strokeWidth="5" strokeDasharray={`${Math.min(Math.max(days / 365, 0), 1) * 220} 220`} strokeLinecap="round" />
                </svg>
                <span className={`text-lg font-bold ${renewalColor(days)}`}>{Math.max(days, 0)}</span>
              </div>
            </div>
          </div>

          <div className={card + " p-6"}>
            <h3 className={sectionTitle + " mb-4"}>Scope & Deliverables</h3>
            <div className={`rounded-lg border-2 border-dashed p-6 text-center ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
              <svg className={`mx-auto h-8 w-8 ${textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              <p className={`mt-2 text-sm font-medium ${textPrimary}`}>{client.scopeDocumentName || "No document attached"}</p>
              <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Download Scope
              </button>
            </div>
          </div>
        </div>

        <div className={card + " p-6"}>
          <EditableBlock label="Notes" field="notes" value={client.notes} />
        </div>
      </div>
    );
  }

  /* ═══════════ PERSONAS ═══════════ */
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
        <div className="flex items-center justify-between mb-6">
          <p className={`text-sm ${textSecondary}`}>{client.icps.length} ideal customer {client.icps.length === 1 ? "profile" : "profiles"}</p>
          <button onClick={() => { setAddingItem("icp"); setIcpDraft({ name: "", role: "", companySize: "", industry: "", ageRange: "", painPoints: "", contentPreferences: "" }); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add ICP</button>
        </div>

        {addingItem === "icp" && (
          <div className={`${card} p-5 mb-6`}>
            <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Add New ICP</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Name *</label><input type="text" value={icpDraft.name} onChange={(e) => setIcpDraft((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Small Business Owner" className={inputClass} /></div>
              <div><label className={labelClass}>Role</label><input type="text" value={icpDraft.role} onChange={(e) => setIcpDraft((p) => ({ ...p, role: e.target.value }))} placeholder="e.g., CEO" className={inputClass} /></div>
              <div><label className={labelClass}>Company Size</label><input type="text" value={icpDraft.companySize} onChange={(e) => setIcpDraft((p) => ({ ...p, companySize: e.target.value }))} placeholder="e.g., 10-50 employees" className={inputClass} /></div>
              <div><label className={labelClass}>Industry</label><input type="text" value={icpDraft.industry} onChange={(e) => setIcpDraft((p) => ({ ...p, industry: e.target.value }))} placeholder="e.g., Healthcare" className={inputClass} /></div>
              <div><label className={labelClass}>Age Range</label><input type="text" value={icpDraft.ageRange} onChange={(e) => setIcpDraft((p) => ({ ...p, ageRange: e.target.value }))} placeholder="e.g., 30-50" className={inputClass} /></div>
            </div>
            <div className="mt-3"><label className={labelClass}>Pain Points (one per line)</label><textarea value={icpDraft.painPoints} onChange={(e) => setIcpDraft((p) => ({ ...p, painPoints: e.target.value }))} rows={3} className={inputClass} /></div>
            <div className="mt-3"><label className={labelClass}>Content Preferences (one per line)</label><textarea value={icpDraft.contentPreferences} onChange={(e) => setIcpDraft((p) => ({ ...p, contentPreferences: e.target.value }))} rows={2} className={inputClass} /></div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { if (!icpDraft.name.trim()) return; const icp: ICP = { id: Date.now().toString(), name: icpDraft.name, role: icpDraft.role, companySize: icpDraft.companySize, industry: icpDraft.industry, ageRange: icpDraft.ageRange, painPoints: icpDraft.painPoints.split("\n").map((s) => s.trim()).filter(Boolean), contentPreferences: icpDraft.contentPreferences.split("\n").map((s) => s.trim()).filter(Boolean) }; updateClient({ ...client, icps: [...client.icps, icp] }); setAddingItem(null); }} disabled={!icpDraft.name.trim()} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">Save ICP</button>
              <button onClick={() => setAddingItem(null)} className={`rounded-lg border px-4 py-2 text-xs font-medium ${dark ? "border-[#1e293b] text-slate-300" : "border-slate-200 text-slate-700"}`}>Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {client.icps.map((icp, i) => {
            const color = colors[i % colors.length];
            return (
              <div key={icp.id} className={`${card} overflow-hidden group`}>
                <div className={`px-6 py-4 ${color.bg} border-b ${color.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${dark ? "bg-white/10" : "bg-white/80"}`}>
                      <svg className={`h-5 w-5 ${color.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${color.text}`}>{icp.name}</h3>
                      <p className={`text-xs ${textMuted}`}>{icp.ageRange} years old</p>
                    </div>
                  </div>
                  <button onClick={() => removeIcp(icp.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-6 space-y-4">
                  <div><p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Role</p><p className={`mt-1 text-sm ${textPrimary}`}>{icp.role}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Company Size</p><p className={`mt-1 text-sm ${textPrimary}`}>{icp.companySize}</p></div>
                    <div><p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Industry</p><p className={`mt-1 text-sm ${textPrimary}`}>{icp.industry}</p></div>
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Pain Points</p>
                    <ul className="mt-2 space-y-1.5">
                      {icp.painPoints.map((pp, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                          <span className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{pp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Content Preferences</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {icp.contentPreferences.map((pref, j) => (
                        <span key={j} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"}`}>{pref}</span>
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

  /* ═══════════ BRAND VOICE ═══════════ */
  function BrandVoiceTab() {
    return (
      <div className="space-y-8">
        <div className={card + " p-6"}>
          <EditableBlock label="Brand Positioning" field="brandPositioning" value={client.brandPositioning} />
        </div>

        {client.toneAttributes.length > 0 && (
          <div>
            <h3 className={sectionTitle + " mb-4"}>Tone Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {client.toneAttributes.map((tone, i) => (
                <div key={i} className={card + " p-5"}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>{tone.positive}</span>
                    <span className={`text-xs ${textMuted}`}>not</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${dark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-700"}`}>{tone.negative}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${textSecondary}`}>{tone.description}</p>
                  <div className={`mt-3 rounded-lg p-3 ${dark ? "bg-[#0d1117]" : "bg-slate-50"}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${textMuted}`}>Example</p>
                    <p className={`mt-1 text-xs italic leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>&ldquo;{tone.example}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* On-Voice */}
          <div className={card + " p-6"}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className={`h-5 w-5 ${dark ? "text-emerald-400" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className={sectionTitle}>On-Voice Examples</h3>
              </div>
              <button onClick={() => { setAddingItem("onVoiceExamples"); setItemBuffer(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add</button>
            </div>
            {addingItem === "onVoiceExamples" && (
              <div className="mb-3 flex gap-2">
                <input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="New on-voice example..." className={`${inputClass} flex-1`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") addInlineItem("onVoiceExamples"); }} />
                <button onClick={() => addInlineItem("onVoiceExamples")} className="text-emerald-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
              </div>
            )}
            <ul className="space-y-3">
              {client.onVoiceExamples.map((ex, i) => (
                <li key={i} className={`group flex items-start gap-2 rounded-lg p-3 text-sm leading-relaxed ${dark ? "bg-emerald-500/5 text-emerald-300 border border-emerald-500/10" : "bg-emerald-50 text-emerald-800 border border-emerald-100"}`}>
                  <span className="flex-1">&ldquo;{ex}&rdquo;</span>
                  <button onClick={() => removeOnVoice(i)} className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-300"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Off-Voice */}
          <div className={card + " p-6"}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className={`h-5 w-5 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className={sectionTitle}>Off-Voice Examples</h3>
              </div>
              <button onClick={() => { setAddingItem("offVoiceExamples"); setItemBuffer(""); setItemBuffer2(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add</button>
            </div>
            {addingItem === "offVoiceExamples" && (
              <div className="mb-3 space-y-2">
                <input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="Off-voice text..." className={inputClass} autoFocus />
                <input type="text" value={itemBuffer2} onChange={(e) => setItemBuffer2(e.target.value)} placeholder="Reason why it's off-voice..." className={inputClass} onKeyDown={(e) => { if (e.key === "Enter") addInlineItem("offVoiceExamples"); }} />
                <div className="flex gap-2">
                  <button onClick={() => addInlineItem("offVoiceExamples")} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white">Add</button>
                  <button onClick={() => setAddingItem(null)} className={`text-xs ${textMuted}`}>Cancel</button>
                </div>
              </div>
            )}
            <ul className="space-y-3">
              {client.offVoiceExamples.map((ex, i) => (
                <li key={i} className={`group rounded-lg p-3 ${dark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50 border border-red-100"}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${dark ? "text-red-300" : "text-red-800"}`}>&ldquo;{ex.text}&rdquo;</p>
                      {ex.reason && <p className={`mt-1 text-xs ${dark ? "text-red-400/60" : "text-red-600/60"}`}>{ex.reason}</p>}
                    </div>
                    <button onClick={() => removeOffVoice(i)} className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-300"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ SERVICES ═══════════ */
  function ServicesTab() {
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={sectionTitle}>Services</h3>
            <button onClick={() => { setAddingItem("services"); setItemBuffer(""); setItemBuffer2(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add Service</button>
          </div>
          {addingItem === "services" && (
            <div className={`${card} p-4 mb-4`}>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Service Name</label><input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="e.g., SEO" className={inputClass} autoFocus /></div>
                <div><label className={labelClass}>Details</label><input type="text" value={itemBuffer2} onChange={(e) => setItemBuffer2(e.target.value)} placeholder="e.g., Technical SEO, content strategy" className={inputClass} /></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => addInlineItem("services")} disabled={!itemBuffer.trim()} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">Save</button>
                <button onClick={() => setAddingItem(null)} className={`text-xs ${textMuted}`}>Cancel</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {client.services.map((svc, i) => (
              <div key={i} className={card + " p-5 group"}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                      <svg className={`h-5 w-5 ${dark ? "text-blue-400" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    </div>
                    <div><h4 className={`text-sm font-semibold ${textPrimary}`}>{svc.name}</h4><p className={`mt-1 text-xs ${textSecondary}`}>{svc.details}</p></div>
                  </div>
                  <button onClick={() => removeService(i)} className={`opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card + " p-6"}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={sectionTitle}>Differentiators</h3>
            <button onClick={() => { setAddingItem("differentiators"); setItemBuffer(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add</button>
          </div>
          {addingItem === "differentiators" && (
            <div className="mb-3 flex gap-2">
              <input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="New differentiator..." className={`${inputClass} flex-1`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") addInlineItem("differentiators"); }} />
              <button onClick={() => addInlineItem("differentiators")} className="text-emerald-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
            </div>
          )}
          <ul className="space-y-3">
            {client.differentiators.map((diff, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <svg className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? "text-purple-400" : "text-purple-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className={`text-sm flex-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>{diff}</span>
                <button onClick={() => removeDifferentiator(i)} className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-300"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* ═══════════ WRITING RULES ═══════════ */
  function WritingRulesTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={card + " p-6"}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${dark ? "bg-emerald-500/10" : "bg-emerald-50"}`}><svg className={`h-5 w-5 ${dark ? "text-emerald-400" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-emerald-400" : "text-emerald-600"}`}>Writing Rules</h3>
            </div>
            <button onClick={() => { setAddingItem("writingRules"); setItemBuffer(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add</button>
          </div>
          {addingItem === "writingRules" && (
            <div className="mb-3 flex gap-2">
              <input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="New writing rule..." className={`${inputClass} flex-1`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") addInlineItem("writingRules"); }} />
              <button onClick={() => addInlineItem("writingRules")} className="text-emerald-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
            </div>
          )}
          <ul className="space-y-3">
            {client.writingRules.map((rule, i) => (
              <li key={i} className={`group flex items-start gap-3 rounded-lg p-3 ${dark ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-emerald-50/50 border border-emerald-100"}`}>
                <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${dark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>{i + 1}</span>
                <span className={`text-sm leading-relaxed flex-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>{rule}</span>
                <button onClick={() => removeWritingRule(i)} className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-300"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </li>
            ))}
          </ul>
        </div>

        <div className={card + " p-6"}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${dark ? "bg-red-500/10" : "bg-red-50"}`}><svg className={`h-5 w-5 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-red-400" : "text-red-600"}`}>Do Not Say</h3>
            </div>
            <button onClick={() => { setAddingItem("doNotSay"); setItemBuffer(""); }} className="text-xs font-medium text-blue-500 hover:text-blue-400">+ Add</button>
          </div>
          {addingItem === "doNotSay" && (
            <div className="mb-3 flex gap-2">
              <input type="text" value={itemBuffer} onChange={(e) => setItemBuffer(e.target.value)} placeholder="Phrase to avoid..." className={`${inputClass} flex-1`} autoFocus onKeyDown={(e) => { if (e.key === "Enter") addInlineItem("doNotSay"); }} />
              <button onClick={() => addInlineItem("doNotSay")} className="text-emerald-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
            </div>
          )}
          <ul className="space-y-3">
            {client.doNotSay.map((phrase, i) => (
              <li key={i} className={`group flex items-center gap-3 rounded-lg p-3 ${dark ? "bg-red-500/5 border border-red-500/10" : "bg-red-50/50 border border-red-100"}`}>
                <svg className={`h-4 w-4 shrink-0 ${dark ? "text-red-400" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                <span className={`text-sm flex-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>{phrase}</span>
                <button onClick={() => removeDoNotSay(i)} className="opacity-0 group-hover:opacity-100 shrink-0 text-red-400 hover:text-red-300"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  /* ═══════════ TEAM NOTES ═══════════ */
  function NotesTab() {
    return (
      <div className="space-y-6">
        {/* Add note form */}
        <div className={card + " p-6"}>
          <h3 className={sectionTitle + " mb-4"}>Add a Note</h3>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Your Name</label>
              <input type="text" value={noteAuthor} onChange={(e) => setNoteAuthor(e.target.value)} placeholder="e.g., Bin Cochran" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} placeholder="Add context, updates, or reminders about this client..." className={inputClass} />
            </div>
            <button onClick={addNote} disabled={!noteText.trim()} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              Post Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        <div>
          <h3 className={sectionTitle + " mb-4"}>Notes ({client.teamNotes.length})</h3>
          {client.teamNotes.length === 0 ? (
            <div className={card + " p-12 text-center"}>
              <p className={`text-sm ${textMuted}`}>No team notes yet. Add the first one above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {client.teamNotes.map((note) => (
                <div key={note.id} className={card + " p-5 group"}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                        <span className={`text-xs font-bold ${dark ? "text-slate-300" : "text-slate-600"}`}>
                          {note.author.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${textPrimary}`}>{note.author}</span>
                          <span className={`text-xs ${textMuted}`}>{new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <p className={`mt-1 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{note.text}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteNote(note.id)} className={`opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════ WIZARD MODAL ═══════════ */
  function WizardModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto" style={{ backgroundColor: dark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)" }}>
        <div className={`m-4 w-full max-w-3xl rounded-2xl border shadow-2xl ${dark ? "bg-[#0d1117] border-[#1e293b]" : "bg-white border-slate-200"}`}>
          {/* Header + Progress */}
          <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${textPrimary}`}>{editingClientId ? "Edit Client" : "Add New Client"}</h2>
              <button onClick={() => { setShowWizard(false); setEditingClientId(null); }} className={`rounded-lg p-1 transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-[#1a2234]" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {wizardSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i < wizardStep ? "bg-emerald-500 text-white" : i === wizardStep ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : dark ? "bg-[#1a2234] text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                    {i < wizardStep ? <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${i === wizardStep ? textPrimary : textMuted}`}>{step}</span>
                  {i < wizardSteps.length - 1 && <div className={`flex-1 h-px ${dark ? "bg-[#1e293b]" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {/* Step 1: Basic Info */}
            {wizardStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Client Name *</label><input type="text" value={wizardData.name} onChange={(e) => { updateWizard("name", e.target.value); updateWizard("initials", e.target.value.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2)); }} placeholder="e.g., Peachtree Dental" className={inputClass} /></div>
                  <div><label className={labelClass}>Website</label><input type="text" value={wizardData.website} onChange={(e) => updateWizard("website", e.target.value)} placeholder="https://" className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Industry</label>
                    <select value={wizardData.industry} onChange={(e) => updateWizard("industry", e.target.value)} className={inputClass}>
                      {industryOptions.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select value={wizardData.status} onChange={(e) => updateWizard("status", e.target.value)} className={inputClass}>
                      <option value="Active">Active</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Brand Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {gradientOptions.map((g) => (
                      <button key={g} onClick={() => updateWizard("color", g)} className={`h-8 w-8 rounded-lg bg-gradient-to-br ${g} ${wizardData.color === g ? "ring-2 ring-blue-500 ring-offset-2" : ""}`} style={{ ["--tw-ring-offset-color" as string]: dark ? "#0d1117" : "#fff" } as React.CSSProperties} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>POC Name</label><input type="text" value={wizardData.pocName} onChange={(e) => updateWizard("pocName", e.target.value)} placeholder="Full name" className={inputClass} /></div>
                  <div><label className={labelClass}>POC Role</label><input type="text" value={wizardData.pocRole} onChange={(e) => updateWizard("pocRole", e.target.value)} placeholder="e.g., Marketing Director" className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>POC Email</label><input type="email" value={wizardData.pocEmail} onChange={(e) => updateWizard("pocEmail", e.target.value)} placeholder="email@company.com" className={inputClass} /></div>
                  <div><label className={labelClass}>POC Phone</label><input type="text" value={wizardData.pocPhone} onChange={(e) => updateWizard("pocPhone", e.target.value)} placeholder="404-555-0000" className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Renewal Date</label><input type="date" value={wizardData.renewalDate} onChange={(e) => updateWizard("renewalDate", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Scope Document Name</label><input type="text" value={wizardData.scopeDocumentName} onChange={(e) => updateWizard("scopeDocumentName", e.target.value)} placeholder="Client_Scope.pdf" className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Notes</label><textarea value={wizardData.notes} onChange={(e) => updateWizard("notes", e.target.value)} rows={3} placeholder="Any relevant context..." className={inputClass} /></div>
              </div>
            )}

            {/* Step 2: Brand Voice */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div><label className={labelClass}>Brand Positioning Statement</label><textarea value={wizardData.brandPositioning} onChange={(e) => updateWizard("brandPositioning", e.target.value)} rows={3} placeholder="How does this brand position itself?" className={inputClass} /></div>
                <div><label className={labelClass}>On-Voice Examples (one per line)</label><textarea value={wizardData.onVoiceText} onChange={(e) => updateWizard("onVoiceText", e.target.value)} rows={4} placeholder="What should this brand sound like?" className={inputClass} /></div>
                <div><label className={labelClass}>Off-Voice Examples (format: text | reason, one per line)</label><textarea value={wizardData.offVoiceText} onChange={(e) => updateWizard("offVoiceText", e.target.value)} rows={4} placeholder="What should this brand NEVER sound like? | Why" className={inputClass} /></div>
              </div>
            )}

            {/* Step 3: Audience */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                {wizardData.icps.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Added ICPs ({wizardData.icps.length})</p>
                    {wizardData.icps.map((icp) => (
                      <div key={icp.id} className={`flex items-start justify-between rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                        <div>
                          <p className={`text-sm font-semibold ${textPrimary}`}>{icp.name}</p>
                          <p className={`text-xs ${textSecondary}`}>{icp.role} | {icp.companySize} | {icp.ageRange}</p>
                        </div>
                        <button onClick={() => setWizardData((p) => ({ ...p, icps: p.icps.filter((i) => i.id !== icp.id) }))} className={`rounded p-1 ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#111827]" : "border-slate-200 bg-white"}`}>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Add an ICP</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Name</label><input type="text" value={icpDraft.name} onChange={(e) => setIcpDraft((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Small Business Owner" className={inputClass} /></div>
                    <div><label className={labelClass}>Role</label><input type="text" value={icpDraft.role} onChange={(e) => setIcpDraft((p) => ({ ...p, role: e.target.value }))} placeholder="e.g., CEO" className={inputClass} /></div>
                    <div><label className={labelClass}>Company Size</label><input type="text" value={icpDraft.companySize} onChange={(e) => setIcpDraft((p) => ({ ...p, companySize: e.target.value }))} placeholder="e.g., 10-50" className={inputClass} /></div>
                    <div><label className={labelClass}>Industry</label><input type="text" value={icpDraft.industry} onChange={(e) => setIcpDraft((p) => ({ ...p, industry: e.target.value }))} placeholder="e.g., Healthcare" className={inputClass} /></div>
                    <div><label className={labelClass}>Age Range</label><input type="text" value={icpDraft.ageRange} onChange={(e) => setIcpDraft((p) => ({ ...p, ageRange: e.target.value }))} placeholder="e.g., 30-50" className={inputClass} /></div>
                  </div>
                  <div className="mt-3"><label className={labelClass}>Pain Points (one per line)</label><textarea value={icpDraft.painPoints} onChange={(e) => setIcpDraft((p) => ({ ...p, painPoints: e.target.value }))} rows={2} className={inputClass} /></div>
                  <div className="mt-3"><label className={labelClass}>Content Preferences (one per line)</label><textarea value={icpDraft.contentPreferences} onChange={(e) => setIcpDraft((p) => ({ ...p, contentPreferences: e.target.value }))} rows={2} className={inputClass} /></div>
                  <button onClick={addIcp} disabled={!icpDraft.name.trim()} className={`mt-3 rounded-lg border px-4 py-2 text-xs font-medium ${dark ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b] disabled:opacity-40" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40"}`}>+ Add ICP</button>
                </div>
              </div>
            )}

            {/* Step 4: Services & Rules */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div><label className={labelClass}>Services (format: Name: Details, one per line)</label><textarea value={wizardData.servicesText} onChange={(e) => updateWizard("servicesText", e.target.value)} rows={4} placeholder="SEO & Content: Technical SEO, content strategy&#10;Paid Media: Google Ads, Meta Ads" className={inputClass} /></div>
                <div><label className={labelClass}>Differentiators (one per line)</label><textarea value={wizardData.differentiatorsText} onChange={(e) => updateWizard("differentiatorsText", e.target.value)} rows={3} placeholder="What makes this client unique?" className={inputClass} /></div>
                <div><label className={labelClass}>Writing Rules (one per line)</label><textarea value={wizardData.writingRulesText} onChange={(e) => updateWizard("writingRulesText", e.target.value)} rows={3} placeholder="Content guidelines and rules" className={inputClass} /></div>
                <div><label className={labelClass}>Do Not Say (one per line)</label><textarea value={wizardData.doNotSayText} onChange={(e) => updateWizard("doNotSayText", e.target.value)} rows={3} placeholder="Phrases and words to avoid" className={inputClass} /></div>
              </div>
            )}

            {/* Step 5: Review */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                {[
                  { title: "Basic Info", step: 0, content: () => (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className={textSecondary}>Name: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.name || "--"}</span></p>
                      <p className={textSecondary}>Website: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.website || "--"}</span></p>
                      <p className={textSecondary}>Industry: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.industry}</span></p>
                      <p className={textSecondary}>Status: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.status}</span></p>
                      <p className={textSecondary}>POC: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pocName || "--"}</span></p>
                      <p className={textSecondary}>Email: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pocEmail || "--"}</span></p>
                      <p className={textSecondary}>Renewal: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.renewalDate || "--"}</span></p>
                    </div>
                  )},
                  { title: "Brand Voice", step: 1, content: () => (
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{wizardData.brandPositioning || "No positioning set."}</p>
                  )},
                  { title: `Audience (${wizardData.icps.length} ICPs)`, step: 2, content: () => (
                    wizardData.icps.length === 0 ? <p className={`text-sm ${textMuted}`}>No ICPs added.</p> :
                    <div className="space-y-1">{wizardData.icps.map((icp) => <p key={icp.id} className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{icp.name} -- {icp.role}</p>)}</div>
                  )},
                  { title: "Services & Rules", step: 3, content: () => {
                    const svcCount = wizardData.servicesText.split("\n").filter((s) => s.trim()).length;
                    const ruleCount = wizardData.writingRulesText.split("\n").filter((s) => s.trim()).length;
                    const dnsCount = wizardData.doNotSayText.split("\n").filter((s) => s.trim()).length;
                    return <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{svcCount} services, {ruleCount} writing rules, {dnsCount} do-not-say phrases</p>;
                  }},
                ].map((section) => (
                  <div key={section.title} className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-semibold ${textPrimary}`}>{section.title}</h4>
                      <button onClick={() => setWizardStep(section.step)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
                    </div>
                    {section.content()}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between border-t px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
            <button onClick={() => { if (wizardStep === 0) { setShowWizard(false); setEditingClientId(null); } else setWizardStep((s) => s - 1); }} className={`rounded-lg border px-4 py-2 text-sm font-medium ${dark ? "border-[#1e293b] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
              {wizardStep === 0 ? "Cancel" : "Back"}
            </button>
            {wizardStep < 4 ? (
              <button onClick={() => setWizardStep((s) => s + 1)} disabled={wizardStep === 0 && !wizardData.name.trim()} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            ) : (
              <button onClick={saveWizard} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">{editingClientId ? "Save Changes" : "Save Client"}</button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
