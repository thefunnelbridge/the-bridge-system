"use client";

import { useEffect, useState } from "react";
import { AreaScoreChart } from "@/components/area-score-chart";
import { ExcellenceScorePanel } from "@/components/excellence-score-panel";
import { LeakCard } from "@/components/leak-card";
import { ScoreRing } from "@/components/score-ring";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StrategicScorecardPanel } from "@/components/strategic-scorecard-panel";
import { Card } from "@/components/ui/card";
import { getIndustryRules } from "@/lib/industry-rules";
import { getInboxMetrics } from "@/lib/inbox";
import { calculateAdvancedScores, createImpactUrgencyMatrix, getExecutiveDiagnosis, getTopLeaks } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getInboxConversations, getScanResponses } from "@/lib/storage";
import type { AdvancedScores, CompanyProfile, DataRoom } from "@/lib/types";
import { Activity, ArrowRight, Brain, Database, Flame, ShieldAlert, Signal, Target, Users } from "lucide-react";

export default function InsightPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);

  useEffect(() => {
    const load = () => {
      setCompany(getCompanyProfile());
      setDataRoom(getDataRoom());
      setScores(calculateAdvancedScores(getScanResponses()));
    };
    load();
    window.addEventListener("bridge-system:storage", load);
    return () => window.removeEventListener("bridge-system:storage", load);
  }, []);

  if (!company || !scores || !dataRoom) return null;
  const leaks = getTopLeaks(scores.areaScores, 5);
  const matrix = createImpactUrgencyMatrix(leaks);
  const rules = getIndustryRules(company.industry);
  const isBrokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const inboxMetrics = getInboxMetrics(getInboxConversations());
  const primaryLeak = leaks[0];
  const executiveBlocks = [
    ["Mayor fuga", primaryLeak?.title ?? "Seguimiento sin sistema", primaryLeak?.areaName ?? "Ventas"],
    ["Riesgo invisible", primaryLeak?.riskOfInaction ?? "La operación seguirá dependiendo de memoria humana.", "No actuar"],
    ["Oportunidad", rules.opportunitySignals[0] ?? "Convertir señales dispersas en acciones visibles.", "Próxima semana"],
  ];
  const signalFlow = [
    { icon: Signal, title: "Señal", text: "El sistema cruza datos internos, conversaciones y benchmarks." },
    { icon: ShieldAlert, title: "Riesgo", text: "Prioriza lo que puede frenar ventas, servicio o adopción." },
    { icon: Target, title: "Acción", text: "Traduce diagnóstico en tareas, responsables y KPI." },
    { icon: Activity, title: "Aprendizaje", text: "Cada uso alimenta mejores recomendaciones." },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#10100f] p-6 text-bone shadow-[0_24px_80px_rgba(10,10,10,0.16)] lg:p-8">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(184,117,71,0.24),transparent_34%,rgba(255,59,31,0.12)_72%,transparent)]" />
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-7 xl:grid-cols-[1fr_360px] xl:items-center">
          <div>
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-copper">Bridge Insight™ · Executive Signal Room</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-6xl">Aquí los datos dejan de ser números y se convierten en criterio.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Insight interpreta el Data Room, Bridge Scan™, Inbox y señales de industria para mostrar qué importa, qué está en riesgo y qué debería priorizar dirección.
            </p>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5">
            <ScoreRing score={scores.overallScore} />
            <p className="text-center font-semibold text-bone">{scores.maturityLevel}</p>
            <p className="mt-3 text-center text-sm leading-6 text-[rgba(245,241,234,0.68)]">{company.name}</p>
          </div>
        </div>
      </div>

      <SectionHeader eyebrow="Bridge Insight™" title="Dashboard de análisis avanzado" description="Command center analítico con índices, matriz de urgencia, fugas, riesgos y oportunidades por industria." />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Mapa de madurez</p>
              <h2 className="mt-2 text-2xl font-semibold">Score por área operativa</h2>
            </div>
            <span className="rounded-md bg-bone-2 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-copper">Scan + Data Room + Inbox</span>
          </div>
          <AreaScoreChart scores={scores.areaScores} />
        </Card>
        <div className="space-y-4">
          {executiveBlocks.map(([label, value, meta]) => (
            <Card key={label} className="transition hover:-translate-y-1 hover:border-copper">
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{value}</h3>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-fog">{meta}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Índice fuga comercial" value={`${scores.commercialLeakIndex}%`} detail="Ventas + mensaje + experiencia." icon={Flame} />
        <StatCard label="Índice fuga operativa" value={`${scores.operationalLeakIndex}%`} detail="Operación + datos + mejora continua." icon={Database} />
        <StatCard label="AI Readiness" value={`${scores.aiReadinessIndex}%`} detail="Preparación real para IA aplicada." icon={Brain} />
        <StatCard label="Human Dependency" value={`${scores.humanDependencyIndex}%`} detail="Procesos que dependen de memoria personal." icon={Users} />
      </div>
      <ExcellenceScorePanel scores={scores} />
      <StrategicScorecardPanel scores={scores} />
      <Card className="bg-bone-2">
        <div className="grid gap-4 md:grid-cols-4">
          {signalFlow.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <Icon className="size-5 text-copper" />
                <p className="mt-3 font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-fog">{item.text}</p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Inbox™ · WhatsApp como memoria operativa</p>
        <p className="mt-3 text-base leading-8 text-fog">
          El sistema detecta que WhatsApp funciona como canal de ventas, atención, archivo, agenda y coordinación interna al mismo tiempo. Esto puede generar pérdida de trazabilidad, respuestas inconsistentes, archivos dispersos y oportunidades sin próxima acción.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <InboxMetric label="Sin próxima acción" value={inboxMetrics.withoutNextAction} />
          <InboxMetric label="Mensajes sin respuesta" value={inboxMetrics.unansweredMessages} />
          <InboxMetric label="Archivos no asociados" value={inboxMetrics.scatteredFiles} />
          <InboxMetric label="Leads dormidos" value={inboxMetrics.dormantOpportunities} />
          <InboxMetric label="Responsables pendientes" value={inboxMetrics.unassigned} />
          <InboxMetric label="Scripts inconsistentes" value={scores.communicationLeakIndex} suffix="%" />
        </div>
      </Card>
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Diagnóstico ejecutivo</p>
        <p className="mt-3 text-base leading-8 text-fog">{getExecutiveDiagnosis(company, scores, dataRoom)}</p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-5">{leaks.map((leak) => <LeakCard key={leak.id} leak={leak} />)}</div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Matriz impacto / urgencia</p>
          <div className="mt-4 space-y-3">
            {matrix.map((item) => (
              <div key={item.id} className="group rounded-md bg-bone-2 p-4 transition hover:-translate-y-0.5 hover:bg-bone">
                <div className="flex items-start justify-between gap-3">
                  <strong>{item.title}</strong>
                  <ArrowRight className="size-4 text-copper opacity-0 transition group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-sm text-fog">{item.quadrant} · impacto {item.impact} · urgencia {item.urgency}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Próximas acciones</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md bg-bone-2 p-4"><strong>Próximas 72 horas</strong><p className="mt-1 text-sm text-fog">{rules.recommendedAutomations[0]}</p></div>
            <div className="rounded-md bg-bone-2 p-4"><strong>Próximos 30 días</strong><p className="mt-1 text-sm text-fog">Instalar revisión semanal, tablero de fugas y entrenamiento por rol.</p></div>
            <div className="rounded-md bg-bone-2 p-4"><strong>Riesgo de no actuar</strong><p className="mt-1 text-sm text-fog">{rules.riskSignals[0]}</p></div>
          </div>
        </Card>
      </div>
      {isBrokerage ? (
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Brokerage Lens™</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-5">
            {["Lead comprador sin clasificación", "Propietario sin seguimiento post tasación", "Visita sin seguimiento posterior", "Propiedad sin movimiento", "Corredor sin próxima acción"].map((item) => (
              <div key={item} className="rounded-md border border-[color:var(--line)] bg-bone p-4 text-sm font-semibold">{item}</div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function InboxMetric({ label, value, suffix = "" }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-4">
      <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.1em] text-copper">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}{suffix}</p>
    </div>
  );
}
