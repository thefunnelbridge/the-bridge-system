"use client";

import { Building2, ClipboardCheck, Database, PlayCircle, Save, Sparkles, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIndustryRules } from "@/lib/industry-rules";
import { getCompanyProfile, saveCompanyProfile } from "@/lib/storage";
import type { CompanyProfile, DemoIndustry } from "@/lib/types";

const industryOptions: DemoIndustry[] = [
  "Construcción / Inmobiliaria",
  "Corredores de propiedades / Brokerage inmobiliario",
  "Clínica / salud / estética / dental",
  "Automotora",
  "Legal",
  "Pyme local",
  "Educación",
  "Retail / e-commerce",
  "Gimnasio / wellness",
];

function fieldToLabel(field: string) {
  const knownLabels: Record<string, string> = {
    activeAgents: "Agentes activos",
    offices: "Oficinas",
    buyerLeads: "Leads compradores",
    ownerLeads: "Leads propietarios",
    capturedProperties: "Propiedades captadas",
    scheduledVisits: "Visitas agendadas",
    offersIssued: "Ofertas emitidas",
    responseTime: "Tiempo de respuesta",
    unfollowedAfter72h: "Sin seguimiento después de 72 h",
    unclassifiedBuyers: "Compradores sin clasificar",
    ownersNoPostValuationFollowUp: "Propietarios sin seguimiento post tasación",
    propertiesWithoutCommercialPlan: "Propiedades sin plan comercial",
    buyerLeadToVisit: "Lead comprador a visita",
    visitToOffer: "Visita a oferta",
    offerToClose: "Oferta a cierre",
    monthlyLeads: "Leads mensuales",
    monthlyInquiries: "Consultas mensuales",
    unfollowedLeads: "Leads sin seguimiento",
    unfollowedInquiries: "Consultas sin seguimiento",
    closeRate: "Tasa de cierre",
    testDriveRate: "Tasa de test drive",
    inquiryToBooking: "Consulta a agenda",
    noShow: "No-show",
  };
  if (knownLabels[field]) return knownLabels[field];
  return field
    .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-záéíóúñ])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default function CompanyPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [channelsText, setChannelsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [teamText, setTeamText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedProfile = getCompanyProfile();
    setProfile(storedProfile);
    setChannelsText(storedProfile.channels.join(", "));
    setToolsText(storedProfile.tools.join(", "));
    setTeamText(storedProfile.team.join(", "));
  }, []);
  if (!profile) return null;

  const rules = getIndustryRules(profile.industry);

  function update(field: keyof CompanyProfile, value: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: value,
    } as CompanyProfile);
    setSaved(false);
  }

  function updateMetric(field: string, value: string) {
    setProfile({
      ...profile,
      metrics: {
        ...profile.metrics,
        [field]: value,
      },
    });
    setSaved(false);
  }

  function textToList(value: string) {
    return value
      .split(/[,;\n]/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!profile) return;
    const nextProfile = {
      ...profile,
      channels: textToList(channelsText),
      tools: textToList(toolsText),
      team: textToList(teamText),
    };
    saveCompanyProfile(nextProfile);
    setProfile(nextProfile);
    setSaved(true);
  }

  function startRealCompanyMode() {
    if (!profile) return;
    const currentIndustry: DemoIndustry = profile.industry || "Pyme local";
    const next: CompanyProfile = {
      id: `custom-${Date.now()}`,
      name: "",
      industry: currentIndustry,
      city: "",
      size: "",
      monthlyRevenue: "",
      model: "",
      channels: [],
      tools: [],
      team: [],
      mainProblem: "",
      digitalMaturity: "Por diagnosticar",
      metrics: {
        monthlyLeads: "",
        responseTime: "",
        unfollowedLeads: "",
        closeRate: "",
      },
    };
    setProfile(next);
    setChannelsText("");
    setToolsText("");
    setTeamText("");
    saveCompanyProfile(next);
    setSaved(false);
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-ink p-6 text-bone shadow-[0_24px_90px_rgba(10,10,10,0.18)] lg:p-8">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-copper">Instalar contexto operativo</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-7xl">Aquí deja de ser demo y empieza a entender tu empresa.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(245,241,234,0.78)]">
              Este perfil alimenta Data Room, Bridge Scan™, Bridge Insight™, Bridge Flow™, Pulse, Workers y el Executive Report. No es un formulario decorativo: es la primera capa de inteligencia operativa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={startRealCompanyMode}><Wand2 className="size-4" /> Cargar mi empresa real</Button>
              <Button href="/app/data-room" className="border-[rgba(245,241,234,0.22)] bg-transparent text-bone hover:border-ember hover:bg-ember hover:text-bone"><Database className="size-4" /> Alimentar Data Room</Button>
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.16)] bg-[rgba(245,241,234,0.08)] p-5">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Empieza por aquí</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[rgba(245,241,234,0.78)]">
              <SetupStep icon={Building2} title="1. Identidad" text="Nombre, industria, ciudad, tamaño y modelo operativo." />
              <SetupStep icon={ClipboardCheck} title="2. Fricción" text="Problema principal, canales, herramientas y equipo." />
              <SetupStep icon={Sparkles} title="3. Sistema" text="El sistema traduce contexto en acciones, metas y alertas." />
            </div>
          </div>
        </div>
      </div>

      <SectionHeader eyebrow="Empresa" title="Perfil operativo profundo" description="Contexto, industria, canales, equipo y señales que alimentan The Bridge System™." />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <form onSubmit={submit} className="grid gap-5">
            {[
              ["name", "Nombre de empresa"],
              ["city", "Ciudad"],
              ["size", "Tamaño"],
              ["monthlyRevenue", "Ventas mensuales"],
              ["model", "Modelo operativo"],
            ].map(([field, label]) => (
              <label key={field} className="grid gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">{label}</span>
                <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={String(profile[field as keyof CompanyProfile] ?? "")} onChange={(event) => update(field as keyof CompanyProfile, event.target.value)} />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Industria</span>
              <select
                className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper"
                value={profile.industry}
                onChange={(event) => update("industry", event.target.value)}
              >
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Madurez digital</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.digitalMaturity} onChange={(event) => update("digitalMaturity", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Problema principal</span>
              <textarea className="min-h-32 rounded-md border border-[color:var(--line)] bg-bone p-4 outline-none focus:border-copper" value={profile.mainProblem} onChange={(event) => update("mainProblem", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Canales</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" placeholder="web, Instagram, WhatsApp, referidos" value={channelsText} onChange={(event) => { setChannelsText(event.target.value); setSaved(false); }} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Herramientas</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" placeholder="CRM, WhatsApp Business, Google Sheets" value={toolsText} onChange={(event) => { setToolsText(event.target.value); setSaved(false); }} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Equipo</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" placeholder="dirección, ventas, atención, operaciones" value={teamText} onChange={(event) => { setTeamText(event.target.value); setSaved(false); }} />
            </label>
            <div className="rounded-lg border border-[color:var(--line)] bg-bone-2 p-4">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Métricas base</p>
              <p className="mt-2 text-sm leading-6 text-fog">Estos datos también alimentan el diagnóstico. Puedes cambiarlos ahora y ver el resumen vivo al lado.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(profile.metrics).slice(0, 8).map(([key, value]) => (
                  <label key={key} className="grid gap-2">
                    <span className="text-xs font-semibold text-fog">{fieldToLabel(key)}</span>
                    <input
                      className="h-11 rounded-md border border-[color:var(--line)] bg-bone px-3 outline-none focus:border-copper"
                      value={String(value)}
                      onChange={(event) => updateMetric(key, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit"><Save className="size-4" /> Guardar empresa</Button>
              {saved ? <span className="text-sm text-fog">Guardado en localStorage.</span> : null}
            </div>
          </form>
        </Card>
        <div className="space-y-5">
          <Card className="bg-ink text-bone">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Resumen vivo</p>
            <h2 className="mt-2 text-2xl font-semibold">{profile.name || "Empresa sin nombre"}</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[rgba(245,241,234,0.76)]">
              <p><strong className="text-bone">Industria:</strong> {profile.industry}</p>
              <p><strong className="text-bone">Canales:</strong> {channelsText || "Sin canales definidos"}</p>
              <p><strong className="text-bone">Herramientas:</strong> {toolsText || "Sin herramientas definidas"}</p>
              <p><strong className="text-bone">Equipo:</strong> {teamText || "Sin equipo definido"}</p>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full w-3/4 bg-ember" />
            </div>
            <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-copper">Actualiza en vivo mientras escribes</p>
          </Card>
          <Card className="border-copper/40 bg-bone-2">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Modo usable</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Sí puedes usarlo con tu empresa.</h2>
            <p className="mt-3 text-sm leading-7 text-fog">
              Cambia los datos de esta pantalla, guarda, completa Data Room y ejecuta Bridge Scan™. Desde ahí el sistema recalcula scores, fugas, tareas, metas, Pulse y reporte usando tu propio contexto local.
            </p>
            <div className="mt-4 grid gap-2">
              <Button href="/app/intro" variant="secondary"><PlayCircle className="size-4" /> Ver introducción guiada</Button>
              <Button href="/app/scan" variant="secondary">Ejecutar Bridge Scan™</Button>
            </div>
          </Card>
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Lenguaje ejecutivo</p>
            <p className="mt-3 text-sm leading-7 text-fog">{rules.executiveLanguage}</p>
          </Card>
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Métricas demo</p>
            <div className="mt-4 space-y-2 text-sm text-fog">
              {Object.entries(profile.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 border-b border-[color:var(--line)] pb-2">
                  <span>{fieldToLabel(key)}</span><strong className="text-ink">{String(value)}</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SetupStep({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.12)] text-ember">
        <Icon className="size-4" />
      </span>
      <p><strong className="text-bone">{title}</strong><br />{text}</p>
    </div>
  );
}
