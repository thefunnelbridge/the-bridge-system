"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCompanyProfile, resetDemo } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

const nextFeatures = [
  "Supabase Auth",
  "Multiempresa",
  "Usuarios por equipo",
  "OpenAI / Bridge Brain™",
  "Integraciones reales",
  "Reportes PDF avanzados",
];

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => setCompany(getCompanyProfile()), []);

  function handleReset() {
    resetDemo();
    setCompany(getCompanyProfile());
    setNotice("Demo restaurada.");
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Configuración demo" title="Estado de la primera versión" description="La app opera sin backend obligatorio y queda preparada para conectar Supabase, OpenAI e integraciones reales." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Modo demo activado</p>
          <h2 className="mt-3 text-2xl font-semibold">{company?.name ?? "Empresa actual"}</h2>
          <p className="mt-3 text-sm leading-6 text-fog">Persistencia inicial con localStorage. Ideal para demo funcional y despliegue inmediato en Vercel.</p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="secondary" onClick={handleReset}><RotateCcw className="size-4" /> Resetear demo</Button>
            {notice ? <span className="text-sm text-fog">{notice}</span> : null}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Próximas funciones</p>
          <ul className="mt-4 space-y-3 text-sm text-fog">
            {nextFeatures.map((feature) => <li key={feature} className="border-b border-[color:var(--line)] pb-2 last:border-0">{feature}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
