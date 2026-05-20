"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIndustryRules } from "@/lib/industry-rules";
import { getCompanyProfile, saveCompanyProfile } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

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

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Empresa" title="Perfil operativo profundo" description="Contexto, industria, canales, equipo y señales que alimentan The Bridge System™." />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <form onSubmit={submit} className="grid gap-5">
            {[
              ["name", "Nombre de empresa"],
              ["industry", "Industria"],
              ["city", "Ciudad"],
              ["size", "Tamaño"],
              ["monthlyRevenue", "Ventas mensuales"],
              ["model", "Modelo operativo"],
              ["digitalMaturity", "Madurez digital"],
            ].map(([field, label]) => (
              <label key={field} className="grid gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">{label}</span>
                <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={String(profile[field as keyof CompanyProfile] ?? "")} onChange={(event) => update(field as keyof CompanyProfile, event.target.value)} />
              </label>
            ))}
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
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Lenguaje ejecutivo</p>
            <p className="mt-3 text-sm leading-7 text-fog">{rules.executiveLanguage}</p>
          </Card>
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Métricas demo</p>
            <div className="mt-4 space-y-2 text-sm text-fog">
              {Object.entries(profile.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3 border-b border-[color:var(--line)] pb-2">
                  <span>{key}</span><strong className="text-ink">{String(value)}</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
