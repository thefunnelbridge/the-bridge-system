"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCompanyProfile, saveCompanyProfile } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

const emptyProfile: CompanyProfile = {
  name: "",
  industry: "",
  size: "",
  monthlyRevenue: "",
  channels: [],
  tools: [],
  mainProblem: "",
  digitalMaturity: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>(emptyProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => setProfile(getCompanyProfile()), []);

  function update(field: keyof CompanyProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: field === "channels" || field === "tools" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value,
    }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    saveCompanyProfile(profile);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Perfil de empresa" title="Contexto operativo" description="Este perfil alimenta el diagnóstico, el informe ejecutivo y las futuras integraciones con Supabase." />
      <Card>
        <form onSubmit={submit} className="grid gap-5">
          {[
            ["name", "Nombre de empresa"],
            ["industry", "Industria"],
            ["size", "Tamaño de equipo"],
            ["monthlyRevenue", "Ventas mensuales"],
            ["digitalMaturity", "Nivel de madurez digital"],
          ].map(([field, label]) => (
            <label key={field} className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">{label}</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={String(profile[field as keyof CompanyProfile])} onChange={(event) => update(field as keyof CompanyProfile, event.target.value)} />
            </label>
          ))}
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Canales actuales</span>
            <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.channels.join(", ")} onChange={(event) => update("channels", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Herramientas actuales</span>
            <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={profile.tools.join(", ")} onChange={(event) => update("tools", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Principal problema</span>
            <textarea className="min-h-32 rounded-md border border-[color:var(--line)] bg-bone p-4 outline-none focus:border-copper" value={profile.mainProblem} onChange={(event) => update("mainProblem", event.target.value)} />
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit"><Save className="size-4" /> Guardar perfil</Button>
            {saved ? <span className="text-sm text-fog">Guardado en localStorage.</span> : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
