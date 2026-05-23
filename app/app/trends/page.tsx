"use client";

import { Activity, ArrowRight, BarChart3, Library, Signal, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCompanyProfile } from "@/lib/storage";
import { trendSources } from "@/lib/trend-sources";
import { bridgeTrends, getTrendsForCompany } from "@/lib/trends";
import type { CompanyProfile, DemoIndustry } from "@/lib/types";

const trendIndustries: (DemoIndustry | "Todas")[] = [
  "Todas",
  "Automotora",
  "Clínica / salud / estética / dental",
  "Corredores de propiedades / Brokerage inmobiliario",
  "Construcción / Inmobiliaria",
  "Legal",
  "Educación",
  "Gimnasio / wellness",
  "Salón de belleza / estética grande",
  "Retail / e-commerce",
  "Pyme local",
  "Negocio unipersonal / solopreneur",
];

export default function TrendsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<DemoIndustry | "Todas">("Todas");

  useEffect(() => {
    const nextCompany = getCompanyProfile();
    setCompany(nextCompany);
    setSelectedIndustry(nextCompany.industry);
  }, []);

  if (!company) return null;
  const currentTrends = getTrendsForCompany(company);
  const trends =
    selectedIndustry === "Todas"
      ? [...bridgeTrends, ...currentTrends.filter((trend) => trend.id === "ai-ready-context")]
      : bridgeTrends.filter((trend) => trend.industries.includes(selectedIndustry));
  const highImpact = trends.filter((trend) => trend.impact === "Alto").length;
  const highUrgency = trends.filter((trend) => trend.urgency === "Alta" || trend.urgency === "Media/Alta").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Bridge Trends™"
        title="Señales externas aplicadas a la operación"
        description="La capa que alimenta The Bridge System™ con tendencias de industria, señales de mercado, nuevas herramientas, benchmarks y cambios de comportamiento."
      />

      <Card className="bridge-dark-wave text-bone">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="grid gap-5 xl:grid-cols-[1fr_380px] xl:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Market Intelligence Room</p>
            <p className="mt-3 font-display text-5xl font-semibold leading-none text-bone lg:text-7xl">Bridge Trends™</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] text-[rgba(245,241,234,0.94)] lg:text-6xl">Las tendencias no sirven si no se traducen en acción.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Bridge Trends™ toma señales externas y las convierte en acciones internas: canal, herramienta, KPI, urgencia, impacto y siguiente tarea.
            </p>
          </div>
          <div className="bridge-glass rounded-lg border p-5 backdrop-blur">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Industria activa</p>
            <p className="mt-3 text-2xl font-semibold">{selectedIndustry}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full w-3/4 rounded-full bg-ember" />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {trendIndustries.map((industry) => (
          <button
            key={industry}
            onClick={() => setSelectedIndustry(industry)}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              selectedIndustry === industry ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

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

      <Card className="bridge-dark-wave text-bone">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-[rgba(255,59,31,0.12)] text-ember">
                <Library className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Trend Source Library™</p>
                <h2 className="mt-1 text-2xl font-semibold">Biblioteca pública de señales</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Esta capa no copia metodologías ni afirma alianzas. Usa fuentes públicas como referencia contextual para convertir tendencias en decisiones operativas.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {trendSources.map((source) => (
              <a
                key={source.id}
                href={source.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-4 transition hover:-translate-y-0.5 hover:border-copper"
              >
                <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{source.category}</p>
                <h3 className="mt-2 font-semibold text-bone">{source.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[rgba(245,241,234,0.68)]">{source.signal}</p>
                <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-[rgba(245,241,234,0.58)]">{source.refreshCadence}</p>
              </a>
            ))}
          </div>
        </div>
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
                <MiniChart impact={trend.impact === "Alto" ? 92 : trend.impact === "Medio/Alto" ? 74 : 58} urgency={trend.urgency === "Alta" ? 90 : trend.urgency === "Media/Alta" ? 72 : 52} />
                <Button href="/app/flow" variant="secondary" className="mt-5 w-full justify-center">
                  Convertir en acción <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MiniChart({ impact, urgency }: { impact: number; urgency: number }) {
  return (
    <div className="mt-5 rounded-md border border-[color:var(--line)] bg-bone p-4">
      <div className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">
        <BarChart3 className="size-4" /> Señal operacional
      </div>
      <div className="mt-4 space-y-3">
        <Bar label="Impacto" value={impact} />
        <Bar label="Urgencia" value={urgency} />
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-xs text-fog"><span>{label}</span><strong>{value}%</strong></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-bone-2">
        <div className="h-full rounded-full bg-ember" style={{ width: `${value}%` }} />
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
