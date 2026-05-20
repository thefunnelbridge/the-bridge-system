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
import { Brain, Database, Flame, Users } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Bridge Insight™" title="Dashboard de análisis avanzado" description="Command center analítico con índices, matriz de urgencia, fugas, riesgos y oportunidades por industria." />
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <Card><ScoreRing score={scores.overallScore} /><p className="text-center font-semibold">{scores.maturityLevel}</p></Card>
        <Card><AreaScoreChart scores={scores.areaScores} /></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Índice fuga comercial" value={`${scores.commercialLeakIndex}%`} detail="Ventas + mensaje + experiencia." icon={Flame} />
        <StatCard label="Índice fuga operativa" value={`${scores.operationalLeakIndex}%`} detail="Operación + datos + mejora continua." icon={Database} />
        <StatCard label="AI Readiness" value={`${scores.aiReadinessIndex}%`} detail="Preparación real para IA aplicada." icon={Brain} />
        <StatCard label="Human Dependency" value={`${scores.humanDependencyIndex}%`} detail="Procesos que dependen de memoria personal." icon={Users} />
      </div>
      <ExcellenceScorePanel scores={scores} />
      <StrategicScorecardPanel scores={scores} />
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
            {matrix.map((item) => <div key={item.id} className="rounded-md bg-bone-2 p-4"><strong>{item.title}</strong><p className="mt-1 text-sm text-fog">{item.quadrant} · impacto {item.impact} · urgencia {item.urgency}</p></div>)}
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
