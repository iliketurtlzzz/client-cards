"use client";

import { useState } from "react";
import { useTheme } from "./theme-context";
import { useClientHub } from "./layout";
import { Client, Contact, Leader, ICP, TeamNote, industryOptions, gradientOptions } from "./data";

type Tab = "overview" | "personas" | "brand" | "services" | "writing" | "notes";
const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "personas", label: "Personas" },
  { key: "brand", label: "Brand Voice" },
  { key: "services", label: "Services" },
  { key: "writing", label: "Writing Rules" },
  { key: "notes", label: "Team Notes" },
];

const wizardSteps = ["Basic Info", "Brand Voice", "Audience", "Services & Rules", "Review"];

function daysUntil(d: string) { const t = new Date(); t.setHours(0,0,0,0); const x = new Date(d); x.setHours(0,0,0,0); return Math.ceil((x.getTime()-t.getTime())/(864e5)); }

/* ── Wizard data ── */
interface WizardData {
  name: string; industry: string; website: string; status: "Active"|"Onboarding"|"Paused";
  color: string; initials: string;
  pocName: string; pocEmail: string; pocPhone: string; pocRole: string; pocLinkedin: string;
  renewalDate: string; scopeDocumentName: string; notes: string;
  brandPositioning: string; onVoiceText: string; offVoiceText: string;
  icps: ICP[];
  servicesText: string; differentiatorsText: string; writingRulesText: string; doNotSayText: string;
}

function emptyWizard(): WizardData {
  return { name:"", industry:"SaaS/Tech", website:"", status:"Onboarding", color:gradientOptions[0], initials:"",
    pocName:"", pocEmail:"", pocPhone:"", pocRole:"", pocLinkedin:"",
    renewalDate:"", scopeDocumentName:"", notes:"",
    brandPositioning:"", onVoiceText:"", offVoiceText:"", icps:[],
    servicesText:"", differentiatorsText:"", writingRulesText:"", doNotSayText:"" };
}

function clientToWizard(c: Client): WizardData {
  const primary = c.contacts.find((x) => x.isPrimary) || c.contacts[0];
  return { name:c.name, industry:c.industry, website:c.website, status:c.status, color:c.color, initials:c.initials,
    pocName:primary?.name||"", pocEmail:primary?.email||"", pocPhone:primary?.phone||"", pocRole:primary?.role||"", pocLinkedin:primary?.linkedin||"",
    renewalDate:c.renewalDate, scopeDocumentName:c.scopeDocumentName, notes:c.notes,
    brandPositioning:c.brandPositioning, onVoiceText:c.onVoiceExamples.join("\n"),
    offVoiceText:c.offVoiceExamples.map((e)=>`${e.text} | ${e.reason}`).join("\n"),
    icps:[...c.icps],
    servicesText:c.services.map((s)=>`${s.name}: ${s.details}`).join("\n"),
    differentiatorsText:c.differentiators.join("\n"), writingRulesText:c.writingRules.join("\n"), doNotSayText:c.doNotSay.join("\n") };
}

function wizardToClient(w: WizardData, existingId?: string, existing?: Client): Client {
  const initials = w.initials || w.name.split(/\s+/).map((x)=>x[0]).join("").toUpperCase().slice(0,2);
  const primaryContact: Contact = { id: existing?.contacts[0]?.id || Date.now().toString(), name:w.pocName, role:w.pocRole, email:w.pocEmail, phone:w.pocPhone, linkedin:w.pocLinkedin, twitter:"", isPrimary:true };
  const otherContacts = existing?.contacts.filter((c)=>!c.isPrimary) || [];
  return {
    id: existingId || Date.now().toString(), name:w.name, industry:w.industry, website:w.website, status:w.status, color:w.color, initials,
    contacts: [primaryContact, ...otherContacts], leaders: existing?.leaders || [],
    renewalDate:w.renewalDate, scopeDocumentName:w.scopeDocumentName, notes:w.notes,
    brandPositioning:w.brandPositioning, toneAttributes: existing?.toneAttributes || [],
    onVoiceExamples: w.onVoiceText.split("\n").map((s)=>s.trim()).filter(Boolean),
    offVoiceExamples: w.offVoiceText.split("\n").map((s)=>s.trim()).filter(Boolean).map((line)=>{ const [t,...r]=line.split("|"); return { text:t.trim(), reason:r.join("|").trim() }; }),
    icps:w.icps,
    services: w.servicesText.split("\n").map((s)=>s.trim()).filter(Boolean).map((l)=>{ const [n,...r]=l.split(":"); return { name:n.trim(), details:r.join(":").trim() }; }),
    differentiators: w.differentiatorsText.split("\n").map((s)=>s.trim()).filter(Boolean),
    writingRules: w.writingRulesText.split("\n").map((s)=>s.trim()).filter(Boolean),
    doNotSay: w.doNotSayText.split("\n").map((s)=>s.trim()).filter(Boolean),
    teamNotes: existing?.teamNotes || [],
  };
}

/* ── LinkedIn icon ── */
function LinkedInIcon({ className }: { className?: string }) {
  return <svg className={className||"h-4 w-4"} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

function TwitterIcon({ className }: { className?: string }) {
  return <svg className={className||"h-4 w-4"} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

export default function ClientHub() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { theme } = useTheme();
  const hub = useClientHub();
  const { activeClient: client, updateClient, showWizard, setShowWizard, editingClientId, setEditingClientId, addClient, clients } = hub;
  const dark = theme === "dark";

  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>(emptyWizard());
  const [icpDraft, setIcpDraft] = useState({ name:"", role:"", companySize:"", industry:"", ageRange:"", painPoints:"", contentPreferences:"" });

  const [editing, setEditing] = useState<string|null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string,string>>({});
  const [addingItem, setAddingItem] = useState<string|null>(null);
  const [itemBuffer, setItemBuffer] = useState("");
  const [itemBuffer2, setItemBuffer2] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteText, setNoteText] = useState("");

  // Contact/Leader add state
  const [addingContact, setAddingContact] = useState(false);
  const [contactDraft, setContactDraft] = useState<Omit<Contact,"id"|"isPrimary">>({ name:"", role:"", email:"", phone:"", linkedin:"", twitter:"" });
  const [addingLeader, setAddingLeader] = useState(false);
  const [leaderDraft, setLeaderDraft] = useState<Omit<Leader,"id">>({ name:"", title:"", email:"", linkedin:"", notes:"" });

  const tp = dark ? "text-white" : "text-neutral-900";
  const ts = dark ? "text-neutral-400" : "text-neutral-500";
  const tm = dark ? "text-neutral-600" : "text-neutral-400";
  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-[13px] outline-none transition-all ${dark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder-neutral-600 focus:border-blue-500/50 focus:bg-white/[0.06]" : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-blue-500/50 focus:shadow-sm"}`;
  const labelClass = `mb-1.5 block text-[11px] font-medium uppercase tracking-wider ${dark ? "text-neutral-500" : "text-neutral-400"}`;
  const badge: Record<string,string> = {
    Active: dark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-100",
    Onboarding: dark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-100",
    Paused: dark ? "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20" : "bg-neutral-100 text-neutral-500 border border-neutral-200",
  };

  const days = daysUntil(client.renewalDate);
  const renewalAlert = days <= 30 && days > 0;
  const renewalOverdue = days <= 0;

  function startEdit(f: string, v: string) { setEditing(f); setEditBuffer({...editBuffer,[f]:v}); }
  function cancelEdit() { setEditing(null); }
  function saveField(f: string, v: string) { updateClient({...client,[f]:v}); setEditing(null); }

  function EditableField({ label, field, value }: { label:string; field:string; value:string }) {
    const isE = editing === field;
    return (
      <div className="flex items-center justify-between py-2">
        <span className={`text-[13px] ${ts}`}>{label}</span>
        {isE ? (
          <div className="flex items-center gap-1.5">
            <input type="text" value={editBuffer[field]||""} onChange={(e)=>setEditBuffer({...editBuffer,[field]:e.target.value})} className={`${inputClass} w-48 !py-1.5 !text-[13px]`} autoFocus onKeyDown={(e)=>{ if(e.key==="Enter") saveField(field,editBuffer[field]||""); if(e.key==="Escape") cancelEdit(); }} />
            <button onClick={()=>saveField(field,editBuffer[field]||"")} className="text-blue-500 hover:text-blue-400 p-1"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
          </div>
        ) : (
          <button onClick={()=>startEdit(field,value)} className="group flex items-center gap-1.5 text-right">
            <span className={`text-[13px] font-medium ${tp}`}>{value||"--"}</span>
            <svg className={`h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
          </button>
        )}
      </div>
    );
  }

  function openEditWizard() { setEditingClientId(client.id); setWizardData(clientToWizard(client)); setWizardStep(0); setShowWizard(true); }
  const updateWizard = (f:string, v:unknown) => setWizardData((p)=>({...p,[f]:v}));

  const addIcp = () => { if(!icpDraft.name.trim()) return; const icp:ICP = { id:Date.now().toString(), name:icpDraft.name, role:icpDraft.role, companySize:icpDraft.companySize, industry:icpDraft.industry, ageRange:icpDraft.ageRange, painPoints:icpDraft.painPoints.split("\n").map(s=>s.trim()).filter(Boolean), contentPreferences:icpDraft.contentPreferences.split("\n").map(s=>s.trim()).filter(Boolean) }; setWizardData((p)=>({...p,icps:[...p.icps,icp]})); setIcpDraft({name:"",role:"",companySize:"",industry:"",ageRange:"",painPoints:"",contentPreferences:""}); };

  const saveWizard = () => { const existing = editingClientId ? clients.find(c=>c.id===editingClientId) : null; const nc = wizardToClient(wizardData, editingClientId||undefined, existing||undefined); if(existing) updateClient(nc); else addClient(nc); setShowWizard(false); setEditingClientId(null); };

  function addNote() { if(!noteText.trim()) return; const n:TeamNote = { id:Date.now().toString(), author:noteAuthor||"Team Member", date:new Date().toISOString().split("T")[0], text:noteText }; updateClient({...client, teamNotes:[n,...client.teamNotes]}); setNoteText(""); }

  function addInlineItem(field:string) {
    if(!itemBuffer.trim()) return;
    if(field==="writingRules") updateClient({...client,writingRules:[...client.writingRules,itemBuffer.trim()]});
    else if(field==="doNotSay") updateClient({...client,doNotSay:[...client.doNotSay,itemBuffer.trim()]});
    else if(field==="differentiators") updateClient({...client,differentiators:[...client.differentiators,itemBuffer.trim()]});
    else if(field==="onVoiceExamples") updateClient({...client,onVoiceExamples:[...client.onVoiceExamples,itemBuffer.trim()]});
    else if(field==="offVoiceExamples") updateClient({...client,offVoiceExamples:[...client.offVoiceExamples,{text:itemBuffer.trim(),reason:itemBuffer2.trim()}]});
    else if(field==="services") updateClient({...client,services:[...client.services,{name:itemBuffer.trim(),details:itemBuffer2.trim()}]});
    setItemBuffer(""); setItemBuffer2(""); setAddingItem(null);
  }

  return (
    <>
      {showWizard && <WizardModal />}

      <div className="p-8 max-w-[1200px] mx-auto">
        {/* 30-day renewal alert */}
        {(renewalAlert || renewalOverdue) && (
          <div className={`mb-6 rounded-2xl px-5 py-4 flex items-center gap-4 ${renewalOverdue ? (dark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100") : (dark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-100")}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 alert-pulse ${renewalOverdue ? "bg-red-500/20" : "bg-amber-500/20"}`}>
              <svg className={`h-5 w-5 ${renewalOverdue ? "text-red-500" : "text-amber-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <div className="flex-1">
              <p className={`text-[13px] font-semibold ${renewalOverdue ? (dark?"text-red-400":"text-red-700") : (dark?"text-amber-400":"text-amber-700")}`}>
                {renewalOverdue ? "Contract renewal is overdue" : "Contract renewal in less than 30 days"}
              </p>
              <p className={`text-[12px] ${renewalOverdue ? (dark?"text-red-400/70":"text-red-600/70") : (dark?"text-amber-400/70":"text-amber-600/70")}`}>
                {renewalOverdue ? `${Math.abs(days)} days past renewal date. Client must notify if leaving.` : `${days} days remaining. Client must provide 30-day notice to cancel.`}
              </p>
            </div>
            <span className={`text-2xl font-bold tabular-nums ${renewalOverdue ? "text-red-500" : "text-amber-500"}`}>{Math.abs(days)}d</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${client.color} text-lg font-bold text-white shadow-lg`}>{client.initials}</div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`text-[28px] font-bold tracking-tight ${tp}`}>{client.name}</h1>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badge[client.status]}`}>{client.status}</span>
              </div>
              <p className={`text-[14px] ${ts}`}>{client.industry}</p>
            </div>
          </div>
          <button onClick={openEditWizard} className={`rounded-xl px-5 py-2.5 text-[13px] font-medium transition-all ${dark ? "bg-white/[0.08] text-white hover:bg-white/[0.12]" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}>Edit Client</button>
        </div>

        {/* Tabs */}
        <div className={`mb-8 flex gap-0.5 rounded-xl p-1 ${dark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)} className={`flex-1 rounded-[10px] px-4 py-2 text-[13px] font-medium transition-all ${activeTab===tab.key ? (dark ? "bg-white/[0.1] text-white shadow-sm" : "bg-white text-neutral-900 shadow-sm") : (dark ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-500 hover:text-neutral-700")}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab==="overview" && <OverviewTab />}
        {activeTab==="personas" && <PersonasTab />}
        {activeTab==="brand" && <BrandVoiceTab />}
        {activeTab==="services" && <ServicesTab />}
        {activeTab==="writing" && <WritingRulesTab />}
        {activeTab==="notes" && <NotesTab />}
      </div>
    </>
  );

  /* ═══ OVERVIEW ═══ */
  function OverviewTab() {
    const renewalDate = new Date(client.renewalDate);
    const totalDays = 365;
    const elapsed = totalDays - Math.max(days, 0);
    const pct = Math.min(Math.max(elapsed / totalDays, 0), 1) * 100;

    return (
      <div className="space-y-6">
        {/* Renewal + Info row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Renewal card - spans 3 */}
          <div className="apple-card p-6 lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Contract Renewal</h3>
              <span className={`text-[11px] font-medium ${tm}`}>{renewalDate.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>
            </div>
            <div className="flex items-end gap-6 mb-5">
              <div>
                <span className={`text-[48px] font-bold tracking-tight leading-none tabular-nums ${days<=0?"text-red-500":days<=30?"text-amber-500":days<=90?"text-amber-400":"text-emerald-500"}`}>{Math.abs(days)}</span>
                <p className={`text-[13px] font-medium mt-1 ${ts}`}>{days<=0 ? "days overdue" : "days remaining"}</p>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] ${tm}`}>Contract start</span>
                  <span className={`text-[10px] ${tm}`}>Renewal</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/[0.06]" : "bg-neutral-200"}`}>
                  <div className="renewal-track h-full transition-all" style={{width:`${pct}%`}} />
                </div>
                <div className="relative mt-1.5">
                  {/* 30-day marker */}
                  <div className="absolute right-0 flex flex-col items-end" style={{right:`${(30/totalDays)*100}%`}}>
                    <div className={`h-3 w-px ${dark ? "bg-amber-500/40" : "bg-amber-400"}`} />
                    <span className={`text-[9px] mt-0.5 ${dark ? "text-amber-500/60" : "text-amber-500"}`}>30d notice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client info - spans 2 */}
          <div className="apple-card p-6 lg:col-span-2">
            <h3 className={`text-[11px] font-medium uppercase tracking-widest mb-3 ${tm}`}>Client Info</h3>
            <div className={`divide-y ${dark ? "divide-white/[0.04]" : "divide-neutral-100"}`}>
              <EditableField label="Website" field="website" value={client.website} />
              <EditableField label="Industry" field="industry" value={client.industry} />
              <div className="flex items-center justify-between py-2">
                <span className={`text-[13px] ${ts}`}>Status</span>
                {editing==="status" ? (
                  <div className="flex gap-1.5">{(["Active","Onboarding","Paused"] as const).map((s)=>(
                    <button key={s} onClick={()=>{updateClient({...client,status:s});setEditing(null);}} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badge[s]}`}>{s}</button>
                  ))}</div>
                ) : (
                  <button onClick={()=>setEditing("status")} className="group flex items-center gap-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${badge[client.status]}`}>{client.status}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contacts + Leaders row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contacts */}
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Points of Contact</h3>
              <button onClick={()=>{setAddingContact(true); setContactDraft({name:"",role:"",email:"",phone:"",linkedin:"",twitter:""});}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"} hover:opacity-80`}>+ Add</button>
            </div>
            {addingContact && (
              <div className={`rounded-xl p-4 mb-4 ${dark?"bg-white/[0.03] border border-white/[0.06]":"bg-neutral-50 border border-neutral-100"}`}>
                <div className="grid grid-cols-2 gap-2.5">
                  <div><label className={labelClass}>Name</label><input value={contactDraft.name} onChange={e=>setContactDraft(p=>({...p,name:e.target.value}))} className={inputClass} placeholder="Full name" /></div>
                  <div><label className={labelClass}>Role</label><input value={contactDraft.role} onChange={e=>setContactDraft(p=>({...p,role:e.target.value}))} className={inputClass} placeholder="e.g., Marketing Director" /></div>
                  <div><label className={labelClass}>Email</label><input value={contactDraft.email} onChange={e=>setContactDraft(p=>({...p,email:e.target.value}))} className={inputClass} placeholder="email@company.com" /></div>
                  <div><label className={labelClass}>Phone</label><input value={contactDraft.phone} onChange={e=>setContactDraft(p=>({...p,phone:e.target.value}))} className={inputClass} placeholder="404-555-0000" /></div>
                  <div><label className={labelClass}>LinkedIn</label><input value={contactDraft.linkedin} onChange={e=>setContactDraft(p=>({...p,linkedin:e.target.value}))} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
                  <div><label className={labelClass}>Twitter / X</label><input value={contactDraft.twitter} onChange={e=>setContactDraft(p=>({...p,twitter:e.target.value}))} className={inputClass} placeholder="https://twitter.com/..." /></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>{ if(!contactDraft.name.trim()) return; updateClient({...client,contacts:[...client.contacts,{...contactDraft,id:Date.now().toString(),isPrimary:client.contacts.length===0}]}); setAddingContact(false); }} disabled={!contactDraft.name.trim()} className={`rounded-xl px-4 py-2 text-[12px] font-medium text-white transition-all disabled:opacity-40 ${dark?"bg-blue-500 hover:bg-blue-400":"bg-blue-500 hover:bg-blue-600"}`}>Save</button>
                  <button onClick={()=>setAddingContact(false)} className={`text-[12px] ${ts}`}>Cancel</button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {client.contacts.map((c) => (
                <div key={c.id} className={`group rounded-xl p-4 ${dark?"bg-white/[0.03]":"bg-neutral-50"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${dark?"bg-white/[0.06]":"bg-neutral-200"}`}>
                        <span className={`text-[12px] font-bold ${dark?"text-neutral-300":"text-neutral-600"}`}>{c.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-[13px] font-semibold ${tp}`}>{c.name}</p>
                          {c.isPrimary && <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${dark?"bg-blue-500/10 text-blue-400":"bg-blue-50 text-blue-500"}`}>Primary</span>}
                        </div>
                        <p className={`text-[12px] ${ts}`}>{c.role}</p>
                      </div>
                    </div>
                    <button onClick={()=>updateClient({...client,contacts:client.contacts.filter(x=>x.id!==c.id)})} className={`opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-1 ${dark?"text-neutral-500":"text-neutral-400"}`}><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                  <div className={`mt-3 flex items-center gap-4 text-[12px] ${ts}`}>
                    {c.email && <a href={`mailto:${c.email}`} className="hover:text-blue-500 transition-colors">{c.email}</a>}
                    {c.phone && <span>{c.phone}</span>}
                  </div>
                  {(c.linkedin || c.twitter) && (
                    <div className="mt-2 flex gap-2">
                      {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className={`social-icon ${dark?"text-neutral-500 hover:text-blue-400":"text-neutral-400 hover:text-blue-600"}`}><LinkedInIcon className="h-4 w-4" /></a>}
                      {c.twitter && <a href={c.twitter} target="_blank" rel="noopener noreferrer" className={`social-icon ${dark?"text-neutral-500 hover:text-neutral-300":"text-neutral-400 hover:text-neutral-600"}`}><TwitterIcon className="h-4 w-4" /></a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leaders */}
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Leadership / Decision Makers</h3>
              <button onClick={()=>{setAddingLeader(true); setLeaderDraft({name:"",title:"",email:"",linkedin:"",notes:""});}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"} hover:opacity-80`}>+ Add</button>
            </div>
            {addingLeader && (
              <div className={`rounded-xl p-4 mb-4 ${dark?"bg-white/[0.03] border border-white/[0.06]":"bg-neutral-50 border border-neutral-100"}`}>
                <div className="grid grid-cols-2 gap-2.5">
                  <div><label className={labelClass}>Name</label><input value={leaderDraft.name} onChange={e=>setLeaderDraft(p=>({...p,name:e.target.value}))} className={inputClass} placeholder="Full name" /></div>
                  <div><label className={labelClass}>Title</label><input value={leaderDraft.title} onChange={e=>setLeaderDraft(p=>({...p,title:e.target.value}))} className={inputClass} placeholder="e.g., CMO, VP Marketing, CEO" /></div>
                  <div><label className={labelClass}>Email</label><input value={leaderDraft.email} onChange={e=>setLeaderDraft(p=>({...p,email:e.target.value}))} className={inputClass} /></div>
                  <div><label className={labelClass}>LinkedIn</label><input value={leaderDraft.linkedin} onChange={e=>setLeaderDraft(p=>({...p,linkedin:e.target.value}))} className={inputClass} /></div>
                </div>
                <div className="mt-2.5"><label className={labelClass}>Notes (role in engagement)</label><input value={leaderDraft.notes} onChange={e=>setLeaderDraft(p=>({...p,notes:e.target.value}))} className={inputClass} placeholder="e.g., Final sign-off on budget and scope" /></div>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>{ if(!leaderDraft.name.trim()) return; updateClient({...client,leaders:[...client.leaders,{...leaderDraft,id:Date.now().toString()}]}); setAddingLeader(false); }} disabled={!leaderDraft.name.trim()} className={`rounded-xl px-4 py-2 text-[12px] font-medium text-white transition-all disabled:opacity-40 ${dark?"bg-blue-500":"bg-blue-500 hover:bg-blue-600"}`}>Save</button>
                  <button onClick={()=>setAddingLeader(false)} className={`text-[12px] ${ts}`}>Cancel</button>
                </div>
              </div>
            )}
            {client.leaders.length === 0 && !addingLeader ? (
              <div className={`rounded-xl p-8 text-center ${dark?"bg-white/[0.02]":"bg-neutral-50"}`}>
                <p className={`text-[13px] ${tm}`}>No leaders added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {client.leaders.map((l) => (
                  <div key={l.id} className={`group rounded-xl p-4 ${dark?"bg-white/[0.03]":"bg-neutral-50"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${dark?"bg-purple-500/10":"bg-purple-50"}`}>
                          <svg className={`h-5 w-5 ${dark?"text-purple-400":"text-purple-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        </div>
                        <div>
                          <p className={`text-[13px] font-semibold ${tp}`}>{l.name}</p>
                          <p className={`text-[12px] font-medium ${dark?"text-purple-400":"text-purple-600"}`}>{l.title}</p>
                        </div>
                      </div>
                      <button onClick={()=>updateClient({...client,leaders:client.leaders.filter(x=>x.id!==l.id)})} className={`opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-1 ${dark?"text-neutral-500":"text-neutral-400"}`}><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                    {l.notes && <p className={`mt-2 text-[12px] ${ts}`}>{l.notes}</p>}
                    <div className="mt-2 flex items-center gap-3">
                      {l.email && <a href={`mailto:${l.email}`} className={`text-[12px] hover:text-blue-500 transition-colors ${ts}`}>{l.email}</a>}
                      {l.linkedin && <a href={l.linkedin} target="_blank" rel="noopener noreferrer" className={`social-icon ${dark?"text-neutral-500 hover:text-blue-400":"text-neutral-400 hover:text-blue-600"}`}><LinkedInIcon className="h-3.5 w-3.5" /></a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scope + Notes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="apple-card p-6">
            <h3 className={`text-[11px] font-medium uppercase tracking-widest mb-4 ${tm}`}>Scope & Deliverables</h3>
            <div className={`rounded-xl border-2 border-dashed p-6 text-center ${dark?"border-white/[0.06]":"border-neutral-200"}`}>
              <svg className={`mx-auto h-8 w-8 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              <p className={`mt-2 text-[13px] font-medium ${tp}`}>{client.scopeDocumentName||"No document"}</p>
              <button className={`mt-3 rounded-xl px-5 py-2.5 text-[13px] font-medium transition-all ${dark?"bg-white/[0.08] text-white hover:bg-white/[0.12]":"bg-neutral-900 text-white hover:bg-neutral-800"}`}>Download Scope</button>
            </div>
          </div>
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Notes</h3>
              {editing==="notes" ? (
                <div className="flex gap-2"><button onClick={()=>{saveField("notes",editBuffer.notes||"");}} className={`text-[12px] font-medium text-emerald-500`}>Save</button><button onClick={cancelEdit} className={`text-[12px] ${tm}`}>Cancel</button></div>
              ) : (
                <button onClick={()=>startEdit("notes",client.notes)} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>Edit</button>
              )}
            </div>
            {editing==="notes" ? (
              <textarea value={editBuffer.notes||""} onChange={e=>setEditBuffer({...editBuffer,notes:e.target.value})} rows={5} className={inputClass} autoFocus />
            ) : (
              <p className={`text-[13px] leading-relaxed ${dark?"text-neutral-300":"text-neutral-600"}`}>{client.notes||"No notes yet."}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ PERSONAS ═══ */
  function PersonasTab() {
    const colors = [
      { bg:dark?"bg-blue-500/8":"bg-blue-50", text:dark?"text-blue-400":"text-blue-600", border:dark?"border-blue-500/15":"border-blue-100" },
      { bg:dark?"bg-purple-500/8":"bg-purple-50", text:dark?"text-purple-400":"text-purple-600", border:dark?"border-purple-500/15":"border-purple-100" },
      { bg:dark?"bg-emerald-500/8":"bg-emerald-50", text:dark?"text-emerald-400":"text-emerald-600", border:dark?"border-emerald-500/15":"border-emerald-100" },
      { bg:dark?"bg-amber-500/8":"bg-amber-50", text:dark?"text-amber-400":"text-amber-600", border:dark?"border-amber-500/15":"border-amber-100" },
      { bg:dark?"bg-rose-500/8":"bg-rose-50", text:dark?"text-rose-400":"text-rose-600", border:dark?"border-rose-500/15":"border-rose-100" },
    ];
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className={`text-[13px] ${ts}`}>{client.icps.length} personas</p>
          <button onClick={()=>{setAddingItem("icp"); setIcpDraft({name:"",role:"",companySize:"",industry:"",ageRange:"",painPoints:"",contentPreferences:""});}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add ICP</button>
        </div>
        {addingItem==="icp" && (
          <div className="apple-card p-5 mb-6">
            <p className={`text-[13px] font-medium mb-3 ${tp}`}>New ICP</p>
            <div className="grid grid-cols-2 gap-2.5">
              <div><label className={labelClass}>Name *</label><input value={icpDraft.name} onChange={e=>setIcpDraft(p=>({...p,name:e.target.value}))} className={inputClass} /></div>
              <div><label className={labelClass}>Role</label><input value={icpDraft.role} onChange={e=>setIcpDraft(p=>({...p,role:e.target.value}))} className={inputClass} /></div>
              <div><label className={labelClass}>Company Size</label><input value={icpDraft.companySize} onChange={e=>setIcpDraft(p=>({...p,companySize:e.target.value}))} className={inputClass} /></div>
              <div><label className={labelClass}>Industry</label><input value={icpDraft.industry} onChange={e=>setIcpDraft(p=>({...p,industry:e.target.value}))} className={inputClass} /></div>
              <div><label className={labelClass}>Age Range</label><input value={icpDraft.ageRange} onChange={e=>setIcpDraft(p=>({...p,ageRange:e.target.value}))} className={inputClass} /></div>
            </div>
            <div className="mt-2.5"><label className={labelClass}>Pain Points (one per line)</label><textarea value={icpDraft.painPoints} onChange={e=>setIcpDraft(p=>({...p,painPoints:e.target.value}))} rows={3} className={inputClass} /></div>
            <div className="mt-2.5"><label className={labelClass}>Content Preferences (one per line)</label><textarea value={icpDraft.contentPreferences} onChange={e=>setIcpDraft(p=>({...p,contentPreferences:e.target.value}))} rows={2} className={inputClass} /></div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>{if(!icpDraft.name.trim()) return; const icp:ICP={id:Date.now().toString(),name:icpDraft.name,role:icpDraft.role,companySize:icpDraft.companySize,industry:icpDraft.industry,ageRange:icpDraft.ageRange,painPoints:icpDraft.painPoints.split("\n").map(s=>s.trim()).filter(Boolean),contentPreferences:icpDraft.contentPreferences.split("\n").map(s=>s.trim()).filter(Boolean)}; updateClient({...client,icps:[...client.icps,icp]}); setAddingItem(null);}} disabled={!icpDraft.name.trim()} className={`rounded-xl px-4 py-2 text-[12px] font-medium text-white disabled:opacity-40 ${dark?"bg-blue-500":"bg-blue-500 hover:bg-blue-600"}`}>Save</button>
              <button onClick={()=>setAddingItem(null)} className={`text-[12px] ${ts}`}>Cancel</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {client.icps.map((icp,i) => { const c=colors[i%colors.length]; return (
            <div key={icp.id} className="apple-card overflow-hidden group">
              <div className={`px-5 py-4 ${c.bg} border-b ${c.border} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${dark?"bg-white/10":"bg-white/80"}`}>
                    <svg className={`h-4 w-4 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  </div>
                  <div><h3 className={`text-[13px] font-bold ${c.text}`}>{icp.name}</h3><p className={`text-[11px] ${tm}`}>{icp.ageRange}</p></div>
                </div>
                <button onClick={()=>updateClient({...client,icps:client.icps.filter(x=>x.id!==icp.id)})} className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"><svg className={`h-4 w-4 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-5 space-y-4">
                <div><p className={`text-[10px] font-medium uppercase tracking-widest ${tm}`}>Role</p><p className={`mt-1 text-[13px] ${tp}`}>{icp.role}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className={`text-[10px] font-medium uppercase tracking-widest ${tm}`}>Size</p><p className={`mt-1 text-[13px] ${tp}`}>{icp.companySize}</p></div>
                  <div><p className={`text-[10px] font-medium uppercase tracking-widest ${tm}`}>Industry</p><p className={`mt-1 text-[13px] ${tp}`}>{icp.industry}</p></div>
                </div>
                <div><p className={`text-[10px] font-medium uppercase tracking-widest ${tm}`}>Pain Points</p>
                  <ul className="mt-2 space-y-1.5">{icp.painPoints.map((pp,j)=>(<li key={j} className="flex items-start gap-2"><span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${dark?"bg-red-400":"bg-red-500"}`}/><span className={`text-[12px] leading-relaxed ${dark?"text-neutral-300":"text-neutral-600"}`}>{pp}</span></li>))}</ul>
                </div>
                <div><p className={`text-[10px] font-medium uppercase tracking-widest ${tm}`}>Content</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{icp.contentPreferences.map((p,j)=>(<span key={j} className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${dark?"bg-white/[0.04] text-neutral-300":"bg-neutral-100 text-neutral-600"}`}>{p}</span>))}</div>
                </div>
              </div>
            </div>
          ); })}
        </div>
      </div>
    );
  }

  /* ═══ BRAND VOICE ═══ */
  function BrandVoiceTab() {
    return (
      <div className="space-y-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Brand Positioning</h3>
            {editing==="brandPositioning" ? <div className="flex gap-2"><button onClick={()=>saveField("brandPositioning",editBuffer.brandPositioning||"")} className="text-[12px] font-medium text-emerald-500">Save</button><button onClick={cancelEdit} className={`text-[12px] ${tm}`}>Cancel</button></div> : <button onClick={()=>startEdit("brandPositioning",client.brandPositioning)} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>Edit</button>}
          </div>
          {editing==="brandPositioning" ? <textarea value={editBuffer.brandPositioning||""} onChange={e=>setEditBuffer({...editBuffer,brandPositioning:e.target.value})} rows={4} className={inputClass} autoFocus /> : <p className={`text-[14px] leading-relaxed ${dark?"text-neutral-300":"text-neutral-600"}`}>{client.brandPositioning||"Not defined."}</p>}
        </div>
        {client.toneAttributes.length>0 && (
          <div>
            <h3 className={`text-[11px] font-medium uppercase tracking-widest mb-4 ${tm}`}>Tone Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {client.toneAttributes.map((t,i)=>(
                <div key={i} className="apple-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${dark?"bg-emerald-500/10 text-emerald-400":"bg-emerald-50 text-emerald-600"}`}>{t.positive}</span>
                    <span className={`text-[11px] ${tm}`}>not</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${dark?"bg-red-500/10 text-red-400":"bg-red-50 text-red-600"}`}>{t.negative}</span>
                  </div>
                  <p className={`text-[12px] leading-relaxed ${ts}`}>{t.description}</p>
                  <div className={`mt-3 rounded-xl p-3 ${dark?"bg-white/[0.03]":"bg-neutral-50"}`}>
                    <p className={`text-[12px] italic ${dark?"text-neutral-300":"text-neutral-600"}`}>&ldquo;{t.example}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>On-Voice</h3>
              <button onClick={()=>{setAddingItem("onVoiceExamples");setItemBuffer("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
            </div>
            {addingItem==="onVoiceExamples" && <div className="mb-3 flex gap-2"><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={`${inputClass} flex-1`} autoFocus onKeyDown={e=>{if(e.key==="Enter") addInlineItem("onVoiceExamples");}} placeholder="Example..." /><button onClick={()=>addInlineItem("onVoiceExamples")} className="text-blue-500 p-1"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></button></div>}
            <ul className="space-y-2">{client.onVoiceExamples.map((ex,i)=>(<li key={i} className={`group flex items-start gap-2 rounded-xl p-3 text-[13px] leading-relaxed ${dark?"bg-emerald-500/5 text-emerald-300":"bg-emerald-50 text-emerald-800"}`}><span className="flex-1">&ldquo;{ex}&rdquo;</span><button onClick={()=>updateClient({...client,onVoiceExamples:client.onVoiceExamples.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 shrink-0"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></li>))}</ul>
          </div>
          <div className="apple-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Off-Voice</h3>
              <button onClick={()=>{setAddingItem("offVoiceExamples");setItemBuffer("");setItemBuffer2("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
            </div>
            {addingItem==="offVoiceExamples" && <div className="mb-3 space-y-2"><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={inputClass} autoFocus placeholder="Off-voice text..." /><input value={itemBuffer2} onChange={e=>setItemBuffer2(e.target.value)} className={inputClass} placeholder="Reason..." onKeyDown={e=>{if(e.key==="Enter") addInlineItem("offVoiceExamples");}} /><div className="flex gap-2"><button onClick={()=>addInlineItem("offVoiceExamples")} className={`rounded-xl px-3 py-1.5 text-[12px] font-medium text-white ${dark?"bg-blue-500":"bg-blue-500"}`}>Add</button><button onClick={()=>setAddingItem(null)} className={`text-[12px] ${tm}`}>Cancel</button></div></div>}
            <ul className="space-y-2">{client.offVoiceExamples.map((ex,i)=>(<li key={i} className={`group rounded-xl p-3 ${dark?"bg-red-500/5":"bg-red-50"}`}><div className="flex items-start gap-2"><div className="flex-1"><p className={`text-[13px] ${dark?"text-red-300":"text-red-800"}`}>&ldquo;{ex.text}&rdquo;</p>{ex.reason&&<p className={`mt-1 text-[11px] ${dark?"text-red-400/50":"text-red-500/60"}`}>{ex.reason}</p>}</div><button onClick={()=>updateClient({...client,offVoiceExamples:client.offVoiceExamples.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 shrink-0"><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div></li>))}</ul>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ SERVICES ═══ */
  function ServicesTab() {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Services</h3>
            <button onClick={()=>{setAddingItem("services");setItemBuffer("");setItemBuffer2("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
          </div>
          {addingItem==="services" && <div className="apple-card p-4 mb-4"><div className="grid grid-cols-2 gap-2.5"><div><label className={labelClass}>Name</label><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={inputClass} autoFocus /></div><div><label className={labelClass}>Details</label><input value={itemBuffer2} onChange={e=>setItemBuffer2(e.target.value)} className={inputClass} /></div></div><div className="mt-3 flex gap-2"><button onClick={()=>addInlineItem("services")} disabled={!itemBuffer.trim()} className={`rounded-xl px-4 py-2 text-[12px] font-medium text-white disabled:opacity-40 ${dark?"bg-blue-500":"bg-blue-500"}`}>Save</button><button onClick={()=>setAddingItem(null)} className={`text-[12px] ${ts}`}>Cancel</button></div></div>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {client.services.map((s,i)=>(
              <div key={i} className="apple-card p-5 group">
                <div className="flex items-start justify-between">
                  <div><h4 className={`text-[13px] font-semibold ${tp}`}>{s.name}</h4><p className={`mt-1 text-[12px] ${ts}`}>{s.details}</p></div>
                  <button onClick={()=>updateClient({...client,services:client.services.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 transition-opacity"><svg className={`h-3.5 w-3.5 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-[11px] font-medium uppercase tracking-widest ${tm}`}>Differentiators</h3>
            <button onClick={()=>{setAddingItem("differentiators");setItemBuffer("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
          </div>
          {addingItem==="differentiators" && <div className="mb-3 flex gap-2"><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={`${inputClass} flex-1`} autoFocus onKeyDown={e=>{if(e.key==="Enter") addInlineItem("differentiators");}} /><button onClick={()=>addInlineItem("differentiators")} className="text-blue-500 p-1"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></button></div>}
          <ul className="space-y-2">{client.differentiators.map((d,i)=>(<li key={i} className="group flex items-start gap-3 py-1.5"><svg className={`mt-0.5 h-4 w-4 shrink-0 ${dark?"text-purple-400":"text-purple-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span className={`text-[13px] flex-1 ${dark?"text-neutral-300":"text-neutral-600"}`}>{d}</span><button onClick={()=>updateClient({...client,differentiators:client.differentiators.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 shrink-0"><svg className={`h-3 w-3 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></li>))}</ul>
        </div>
      </div>
    );
  }

  /* ═══ WRITING RULES ═══ */
  function WritingRulesTab() {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-[12px] font-semibold uppercase tracking-wider ${dark?"text-emerald-400":"text-emerald-600"}`}>Writing Rules</h3>
            <button onClick={()=>{setAddingItem("writingRules");setItemBuffer("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
          </div>
          {addingItem==="writingRules" && <div className="mb-3 flex gap-2"><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={`${inputClass} flex-1`} autoFocus onKeyDown={e=>{if(e.key==="Enter") addInlineItem("writingRules");}} /><button onClick={()=>addInlineItem("writingRules")} className="text-blue-500 p-1"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></button></div>}
          <ul className="space-y-2">{client.writingRules.map((r,i)=>(<li key={i} className={`group flex items-start gap-3 rounded-xl p-3 ${dark?"bg-emerald-500/5":"bg-emerald-50/60"}`}><span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0 ${dark?"bg-emerald-500/15 text-emerald-400":"bg-emerald-100 text-emerald-600"}`}>{i+1}</span><span className={`text-[13px] leading-relaxed flex-1 ${dark?"text-neutral-300":"text-neutral-600"}`}>{r}</span><button onClick={()=>updateClient({...client,writingRules:client.writingRules.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 shrink-0"><svg className={`h-3 w-3 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></li>))}</ul>
        </div>
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-[12px] font-semibold uppercase tracking-wider ${dark?"text-red-400":"text-red-600"}`}>Do Not Say</h3>
            <button onClick={()=>{setAddingItem("doNotSay");setItemBuffer("");}} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>+ Add</button>
          </div>
          {addingItem==="doNotSay" && <div className="mb-3 flex gap-2"><input value={itemBuffer} onChange={e=>setItemBuffer(e.target.value)} className={`${inputClass} flex-1`} autoFocus onKeyDown={e=>{if(e.key==="Enter") addInlineItem("doNotSay");}} /><button onClick={()=>addInlineItem("doNotSay")} className="text-blue-500 p-1"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></button></div>}
          <ul className="space-y-2">{client.doNotSay.map((p,i)=>(<li key={i} className={`group flex items-center gap-3 rounded-xl p-3 ${dark?"bg-red-500/5":"bg-red-50/60"}`}><svg className={`h-3.5 w-3.5 shrink-0 ${dark?"text-red-400":"text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span className={`text-[13px] flex-1 ${dark?"text-neutral-300":"text-neutral-600"}`}>{p}</span><button onClick={()=>updateClient({...client,doNotSay:client.doNotSay.filter((_,j)=>j!==i)})} className="opacity-0 group-hover:opacity-60 shrink-0"><svg className={`h-3 w-3 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></li>))}</ul>
        </div>
      </div>
    );
  }

  /* ═══ NOTES ═══ */
  function NotesTab() {
    return (
      <div className="space-y-6">
        <div className="apple-card p-6">
          <h3 className={`text-[11px] font-medium uppercase tracking-widest mb-4 ${tm}`}>Add a Note</h3>
          <div className="space-y-3">
            <div><label className={labelClass}>Your Name</label><input value={noteAuthor} onChange={e=>setNoteAuthor(e.target.value)} placeholder="e.g., Bin Cochran" className={inputClass} /></div>
            <div><label className={labelClass}>Note</label><textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={3} placeholder="Updates, reminders, context..." className={inputClass} /></div>
            <button onClick={addNote} disabled={!noteText.trim()} className={`rounded-xl px-5 py-2.5 text-[13px] font-medium transition-all disabled:opacity-40 ${dark?"bg-white/[0.08] text-white hover:bg-white/[0.12]":"bg-neutral-900 text-white hover:bg-neutral-800"}`}>Post Note</button>
          </div>
        </div>
        <div>
          <h3 className={`text-[11px] font-medium uppercase tracking-widest mb-4 ${tm}`}>Notes ({client.teamNotes.length})</h3>
          {client.teamNotes.length===0 ? <div className="apple-card p-12 text-center"><p className={`text-[13px] ${tm}`}>No notes yet.</p></div> : (
            <div className="space-y-3">{client.teamNotes.map(n=>(
              <div key={n.id} className="apple-card p-5 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${dark?"bg-white/[0.06]":"bg-neutral-100"}`}><span className={`text-[11px] font-bold ${dark?"text-neutral-400":"text-neutral-500"}`}>{n.author.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}</span></div>
                    <div>
                      <div className="flex items-center gap-2"><span className={`text-[13px] font-semibold ${tp}`}>{n.author}</span><span className={`text-[11px] ${tm}`}>{new Date(n.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span></div>
                      <p className={`mt-1 text-[13px] leading-relaxed ${dark?"text-neutral-300":"text-neutral-600"}`}>{n.text}</p>
                    </div>
                  </div>
                  <button onClick={()=>updateClient({...client,teamNotes:client.teamNotes.filter(x=>x.id!==n.id)})} className="opacity-0 group-hover:opacity-60 transition-opacity p-1"><svg className={`h-3.5 w-3.5 ${tm}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    );
  }

  /* ═══ WIZARD ═══ */
  function ReviewSection({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
    return (
      <div className={`rounded-xl p-4 ${dark?"bg-white/[0.03]":"bg-neutral-50"}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className={`text-[13px] font-semibold ${tp}`}>{title}</h4>
          <button onClick={()=>setWizardStep(step)} className={`text-[12px] font-medium ${dark?"text-blue-400":"text-blue-500"}`}>Edit</button>
        </div>
        {children}
      </div>
    );
  }

  function WizardModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto backdrop-blur-sm" style={{backgroundColor:dark?"rgba(0,0,0,0.7)":"rgba(0,0,0,0.3)"}}>
        <div className={`m-6 w-full max-w-2xl rounded-2xl border shadow-2xl ${dark?"bg-[#1c1c1e] border-white/[0.06]":"bg-white border-neutral-200"}`}>
          <div className={`px-6 py-4 ${dark?"border-b border-white/[0.06]":"border-b border-neutral-100"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-[17px] font-bold ${tp}`}>{editingClientId?"Edit Client":"New Client"}</h2>
              <button onClick={()=>{setShowWizard(false);setEditingClientId(null);}} className={`rounded-full p-1.5 transition-all ${dark?"text-neutral-500 hover:bg-white/[0.06]":"text-neutral-400 hover:bg-neutral-100"}`}><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex items-center gap-2">{wizardSteps.map((s,i)=>(<div key={s} className="flex items-center gap-2 flex-1"><div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i<wizardStep?"bg-emerald-500 text-white":i===wizardStep?"bg-blue-500 text-white":dark?"bg-white/[0.06] text-neutral-600":"bg-neutral-100 text-neutral-400"}`}>{i<wizardStep?<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>:i+1}</div><span className={`hidden sm:block text-[11px] font-medium ${i===wizardStep?tp:tm}`}>{s}</span>{i<wizardSteps.length-1&&<div className={`flex-1 h-px ${dark?"bg-white/[0.06]":"bg-neutral-200"}`}/>}</div>))}</div>
          </div>
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {wizardStep===0 && <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Name *</label><input value={wizardData.name} onChange={e=>{updateWizard("name",e.target.value);updateWizard("initials",e.target.value.split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,2));}} className={inputClass} /></div><div><label className={labelClass}>Website</label><input value={wizardData.website} onChange={e=>updateWizard("website",e.target.value)} className={inputClass} placeholder="https://" /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Industry</label><select value={wizardData.industry} onChange={e=>updateWizard("industry",e.target.value)} className={inputClass}>{industryOptions.map(i=><option key={i} value={i}>{i}</option>)}</select></div><div><label className={labelClass}>Status</label><select value={wizardData.status} onChange={e=>updateWizard("status",e.target.value)} className={inputClass}><option value="Active">Active</option><option value="Onboarding">Onboarding</option><option value="Paused">Paused</option></select></div></div>
              <div><label className={labelClass}>Color</label><div className="flex gap-2">{gradientOptions.map(g=>(<button key={g} onClick={()=>updateWizard("color",g)} className={`h-7 w-7 rounded-lg bg-gradient-to-br ${g} ${wizardData.color===g?"ring-2 ring-blue-500 ring-offset-2":""}`} style={{["--tw-ring-offset-color" as string]:dark?"#1c1c1e":"#fff"} as React.CSSProperties} />))}</div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Primary POC Name</label><input value={wizardData.pocName} onChange={e=>updateWizard("pocName",e.target.value)} className={inputClass} /></div><div><label className={labelClass}>POC Role</label><input value={wizardData.pocRole} onChange={e=>updateWizard("pocRole",e.target.value)} className={inputClass} /></div></div>
              <div className="grid grid-cols-3 gap-3"><div><label className={labelClass}>Email</label><input value={wizardData.pocEmail} onChange={e=>updateWizard("pocEmail",e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Phone</label><input value={wizardData.pocPhone} onChange={e=>updateWizard("pocPhone",e.target.value)} className={inputClass} /></div><div><label className={labelClass}>LinkedIn</label><input value={wizardData.pocLinkedin} onChange={e=>updateWizard("pocLinkedin",e.target.value)} className={inputClass} /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Renewal Date</label><input type="date" value={wizardData.renewalDate} onChange={e=>updateWizard("renewalDate",e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Scope Doc</label><input value={wizardData.scopeDocumentName} onChange={e=>updateWizard("scopeDocumentName",e.target.value)} className={inputClass} /></div></div>
              <div><label className={labelClass}>Notes</label><textarea value={wizardData.notes} onChange={e=>updateWizard("notes",e.target.value)} rows={3} className={inputClass} /></div>
            </div>}
            {wizardStep===1 && <div className="space-y-3">
              <div><label className={labelClass}>Brand Positioning</label><textarea value={wizardData.brandPositioning} onChange={e=>updateWizard("brandPositioning",e.target.value)} rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>On-Voice Examples (one per line)</label><textarea value={wizardData.onVoiceText} onChange={e=>updateWizard("onVoiceText",e.target.value)} rows={4} className={inputClass} /></div>
              <div><label className={labelClass}>Off-Voice Examples (text | reason, one per line)</label><textarea value={wizardData.offVoiceText} onChange={e=>updateWizard("offVoiceText",e.target.value)} rows={4} className={inputClass} /></div>
            </div>}
            {wizardStep===2 && <div className="space-y-3">
              {wizardData.icps.length>0 && <div className="space-y-2 mb-3">{wizardData.icps.map(icp=>(<div key={icp.id} className={`flex items-center justify-between rounded-xl p-3 ${dark?"bg-white/[0.03]":"bg-neutral-50"}`}><div><p className={`text-[13px] font-semibold ${tp}`}>{icp.name}</p><p className={`text-[11px] ${ts}`}>{icp.role}</p></div><button onClick={()=>setWizardData(p=>({...p,icps:p.icps.filter(i=>i.id!==icp.id)}))} className={`p-1 ${tm}`}><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button></div>))}</div>}
              <div className={`rounded-xl p-4 ${dark?"bg-white/[0.03] border border-white/[0.06]":"bg-neutral-50 border border-neutral-100"}`}>
                <p className={`text-[13px] font-medium mb-3 ${tp}`}>Add ICP</p>
                <div className="grid grid-cols-2 gap-2.5"><div><label className={labelClass}>Name</label><input value={icpDraft.name} onChange={e=>setIcpDraft(p=>({...p,name:e.target.value}))} className={inputClass} /></div><div><label className={labelClass}>Role</label><input value={icpDraft.role} onChange={e=>setIcpDraft(p=>({...p,role:e.target.value}))} className={inputClass} /></div><div><label className={labelClass}>Size</label><input value={icpDraft.companySize} onChange={e=>setIcpDraft(p=>({...p,companySize:e.target.value}))} className={inputClass} /></div><div><label className={labelClass}>Industry</label><input value={icpDraft.industry} onChange={e=>setIcpDraft(p=>({...p,industry:e.target.value}))} className={inputClass} /></div><div><label className={labelClass}>Age</label><input value={icpDraft.ageRange} onChange={e=>setIcpDraft(p=>({...p,ageRange:e.target.value}))} className={inputClass} /></div></div>
                <div className="mt-2.5"><label className={labelClass}>Pain Points (one/line)</label><textarea value={icpDraft.painPoints} onChange={e=>setIcpDraft(p=>({...p,painPoints:e.target.value}))} rows={2} className={inputClass} /></div>
                <div className="mt-2.5"><label className={labelClass}>Content Prefs (one/line)</label><textarea value={icpDraft.contentPreferences} onChange={e=>setIcpDraft(p=>({...p,contentPreferences:e.target.value}))} rows={2} className={inputClass} /></div>
                <button onClick={addIcp} disabled={!icpDraft.name.trim()} className={`mt-3 rounded-xl px-4 py-2 text-[12px] font-medium disabled:opacity-40 ${dark?"bg-white/[0.06] text-neutral-300":"bg-neutral-100 text-neutral-700"}`}>+ Add ICP</button>
              </div>
            </div>}
            {wizardStep===3 && <div className="space-y-3">
              <div><label className={labelClass}>Services (Name: Details, one/line)</label><textarea value={wizardData.servicesText} onChange={e=>updateWizard("servicesText",e.target.value)} rows={4} className={inputClass} /></div>
              <div><label className={labelClass}>Differentiators (one/line)</label><textarea value={wizardData.differentiatorsText} onChange={e=>updateWizard("differentiatorsText",e.target.value)} rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>Writing Rules (one/line)</label><textarea value={wizardData.writingRulesText} onChange={e=>updateWizard("writingRulesText",e.target.value)} rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>Do Not Say (one/line)</label><textarea value={wizardData.doNotSayText} onChange={e=>updateWizard("doNotSayText",e.target.value)} rows={3} className={inputClass} /></div>
            </div>}
            {wizardStep===4 && (
              <div className="space-y-3">
                <ReviewSection title="Basic Info" step={0}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
                    <p className={ts}>Name: <span className={tp}>{wizardData.name||"--"}</span></p>
                    <p className={ts}>Website: <span className={tp}>{wizardData.website||"--"}</span></p>
                    <p className={ts}>Industry: <span className={tp}>{wizardData.industry}</span></p>
                    <p className={ts}>POC: <span className={tp}>{wizardData.pocName||"--"}</span></p>
                    <p className={ts}>Renewal: <span className={tp}>{wizardData.renewalDate||"--"}</span></p>
                  </div>
                </ReviewSection>
                <ReviewSection title="Brand Voice" step={1}>
                  <p className={`text-[13px] ${dark?"text-neutral-300":"text-neutral-700"}`}>{wizardData.brandPositioning||"Not set."}</p>
                </ReviewSection>
                <ReviewSection title={`Audience (${wizardData.icps.length})`} step={2}>
                  {wizardData.icps.length===0 ? <p className={`text-[13px] ${tm}`}>None</p> : <div className="space-y-1">{wizardData.icps.map(icp=><p key={icp.id} className={`text-[13px] ${tp}`}>{icp.name}</p>)}</div>}
                </ReviewSection>
                <ReviewSection title="Services & Rules" step={3}>
                  <p className={`text-[13px] ${tp}`}>{wizardData.servicesText.split("\n").filter(l=>l.trim()).length} services, {wizardData.writingRulesText.split("\n").filter(l=>l.trim()).length} rules</p>
                </ReviewSection>
              </div>
            )}
          </div>
          <div className={`flex items-center justify-between px-6 py-4 ${dark?"border-t border-white/[0.06]":"border-t border-neutral-100"}`}>
            <button onClick={()=>{if(wizardStep===0){setShowWizard(false);setEditingClientId(null);} else setWizardStep(s=>s-1);}} className={`rounded-xl px-4 py-2 text-[13px] font-medium ${dark?"text-neutral-400 hover:bg-white/[0.06]":"text-neutral-600 hover:bg-neutral-100"}`}>{wizardStep===0?"Cancel":"Back"}</button>
            {wizardStep<4 ? <button onClick={()=>setWizardStep(s=>s+1)} disabled={wizardStep===0&&!wizardData.name.trim()} className={`rounded-xl px-5 py-2 text-[13px] font-medium text-white transition-all disabled:opacity-40 ${dark?"bg-blue-500 hover:bg-blue-400":"bg-blue-500 hover:bg-blue-600"}`}>Next</button>
            : <button onClick={saveWizard} className={`rounded-xl px-5 py-2 text-[13px] font-medium text-white ${dark?"bg-blue-500 hover:bg-blue-400":"bg-blue-500 hover:bg-blue-600"}`}>{editingClientId?"Save":"Create Client"}</button>}
          </div>
        </div>
      </div>
    );
  }
}
