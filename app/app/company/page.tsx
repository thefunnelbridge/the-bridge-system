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
  return field
    .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default function CompanyPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setProfile(getCompanyProfile()), []);
  if (!profile) return null;

  const rules = getIndustryRules(profile.industry);

  function update(field: keyof CompanyProfile, value: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: field === "channels" || field === "tools" || field === "team" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value,
    } as CompanyProfile);
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!profile) return;
    saveCompanyProfile(profile);
    setSaved(true);
  }

  function startRealCompanyMode() {
    const next: CompanyProfile = {
      ...profile,
      id: `custom-${Date.now()}`,
      name: "",
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
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.channels.join(", ")} onChange={(event) => update("channels", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Herramientas</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.tools.join(", ")} onChange={(event) => update("tools", event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Equipo</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.team.join(", ")} onChange={(event) => update("team", event.target.value)} />
            </label>
            <div className="flex items-center gap-3">
              <Button type="submit"><Save className="size-4" /> Guardar empresa</Button>
              {saved ? <span className="text-sm text-fog">Guardado en localStorage.</span> : null}
            </div>
          </form>
        </Card>
        <div className="space-y-5">
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
