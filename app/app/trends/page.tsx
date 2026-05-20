"use client";

import { Activity, ArrowRight, Signal, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getCompanyProfile } from "@/lib/storage";
import { getTrendsForCompany } from "@/lib/trends";
import type { CompanyProfile } from "@/lib/types";

export default function TrendsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => setCompany(getCompanyProfile()), []);

  if (!company) return null;
  const trends = getTrendsForCompany(company);
  const highImpact = trends.filter((trend) => trend.impact === "Alto").length;
  const highUrgency = trends.filter((trend) => trend.urgency === "Alta" || trend.urgency === "Media/Alta").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Bridge Trends™"
        title="Señales externas aplicadas a la operación"
        description="La capa que alimenta The Bridge System™ con tendencias de industria, señales de mercado, nuevas herramientas, benchmarks y cambios de comportamiento."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Tendencias activas" value={trends.length} detail={company.industry} icon={Signal} />
        <StatCard label="Alto impacto" value={highImpact} detail="Señales con potencial de mover ventas, atención u operación." icon={Zap} />
        <StatCard label="Urgencia" value={highUrgency} detail="Tendencias que conviene traducir pronto a acción." icon={Activity} />
      </div>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Cómo se usa</p>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-fog">
          Bridge Trends™ no funciona como noticias sueltas. Cada señal externa se traduce en significado operativo, acción recomendada, canal, herramienta y KPI para que el equipo sepa qué hacer con esa información.
        </p>
      </Card>

      <div className="grid gap-5">
        {trends.map((trend) => (
          <Card key={trend.id}>
            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-copper">{trend.urgency}</span>
                  <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-fog">Impacto {trend.impact}</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-ink">{trend.title}</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <InfoBlock label="Señal externa" value={trend.externalSignal} />
                  <InfoBlock label="Qué significa" value={trend.meaning} />
                </div>
                <div className="mt-4 rounded-md border border-[color:var(--line)] bg-bone p-4">
                  <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Acción recomendada</p>
                  <p className="mt-2 text-sm leading-6 text-fog">{trend.recommendedAction}</p>
                </div>
              </div>
              <div className="rounded-md bg-bone-2 p-5">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Traducción operacional</p>
                <div className="mt-4 space-y-4 text-sm leading-6 text-fog">
                  <p><strong className="text-ink">Canal:</strong> {trend.suggestedChannel}</p>
                  <p><strong className="text-ink">Herramienta:</strong> {trend.suggestedTool}</p>
                  <p><strong className="text-ink">KPI:</strong> {trend.kpi}</p>
                </div>
                <div className="mt-5 flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink">
                  Enviar a Bridge Flow™ <ArrowRight className="size-4 text-copper" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bone-2 p-4">
      <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}
