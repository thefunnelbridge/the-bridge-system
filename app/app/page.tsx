"use client";

import { AlertTriangle, Brain, Clock, Compass, Database, Flame, Inbox, Play, Route, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AreaScoreChart } from "@/components/area-score-chart";
import { BridgeCompanionPanel } from "@/components/bridge-companion-panel";
import { BridgePulsePanel } from "@/components/bridge-pulse-panel";
import { ContinuousImprovementLoop } from "@/components/continuous-improvement-loop";
import { ExcellenceScorePanel } from "@/components/excellence-score-panel";
import { LeakCard } from "@/components/leak-card";
import { LiveGoalsPanel } from "@/components/live-goals-panel";
import { ScoreRing } from "@/components/score-ring";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { SystemMap } from "@/components/system-map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { benchmarks } from "@/lib/benchmarks";
import { getIndustryRules } from "@/lib/industry-rules";
import { getInboxMetrics } from "@/lib/inbox";
import { getLiveGoals, getTodayFocus } from "@/lib/live-goals";
import { onboardingSteps } from "@/lib/onboarding";
import { calculateAdvancedScores, createImpactUrgencyMatrix, getExecutiveDiagnosis, getTopLeaks } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getInboxConversations, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { getPrimaryTrend } from "@/lib/trends";
import type { AdvancedScores, CompanyProfile, DataRoom, TrackerTask } from "@/lib/types";

export default function CommandCenterPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);

  useEffect(() => {
    const load = () => {
      const nextCompany = getCompanyProfile();
      setCompany(nextCompany);
      setDataRoom(getDataRoom());
      setScores(calculateAdvancedScores(getScanResponses()));
      setTasks(getTrackerTasks());
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
  const liveGoals = getLiveGoals(company, scores, tasks, dataRoom);
  const todayFocus = getTodayFocus(liveGoals);
  const primaryTrend = getPrimaryTrend(company);
  const inboxMetrics = getInboxMetrics(getInboxConversations());
  const firstSteps = onboardingSteps.slice(0, 4);

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden bg-[#10100f] text-bone">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(184,117,71,0.2),transparent_38%,rgba(255,59,31,0.12)_78%,transparent)]" />
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_420px] xl:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-copper">Start Here · Operational Intelligence</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[0.96]">Primero entiende el sistema. Después úsalo todos los días.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Si alguien entra sin contexto, esta ruta le enseña qué hace cada capa, qué debe completar, qué mirar y cómo convertir señales en tareas para el equipo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/app/intro" className="border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone"><Play className="size-4" /> Empezar introducción</Button>
              <Button href="/app/pulse" variant="secondary"><Compass className="size-4" /> Ver pulso del día</Button>
            </div>
          </div>
          <div className="grid gap-3">
            {firstSteps.map((step, index) => (
              <div key={step.id} className="rounded-md border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-4">
                <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Paso {index + 1} · {step.duration}</p>
                <p className="mt-2 font-semibold text-bone">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-[rgba(245,241,234,0.68)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          eyebrow="Command Center"
          title="Command Center"
          description="El centro operativo donde The Bridge System™ conecta datos internos, tendencias externas y ejecución diaria."
        />
        <div className="flex flex-wrap gap-2">
          <Button href="/app/data-room" variant="secondary"><Database className="size-4" /> Alimentar Data Room</Button>
          <Button href="/app/inbox" variant="secondary"><Inbox className="size-4" /> Ordenar Inbox</Button>
          <Button href="/app/trends" variant="secondary"><TrendingUp className="size-4" /> Ver Trends</Button>
          <Button href="/app/insight"><Brain className="size-4" /> Ver Insight</Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Operational Intelligence Layer</p>
            <h2 className="mt-2 text-3xl font-semibold">{company.name}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">
              La capa viva que convierte datos, tendencias y fricción interna en acciones diarias para el equipo. No se completa una vez: se alimenta todos los días.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DailyItem label="Qué está pasando hoy" value={todayFocus.title} />
            <DailyItem label="Qué está en riesgo" value={leaks[0]?.title ?? "Seguimiento sin sistema visible"} />
            <DailyItem label="Qué tendencia aplica" value={primaryTrend.title} />
            <DailyItem label="Qué debe hacer el equipo" value={liveGoals[0]?.companionRecommendation ?? "Registrar próxima acción en oportunidades abiertas."} />
            <DailyItem label="Qué oportunidad está dormida" value={isBrokerage ? "compradores sin próxima acción por corredor" : "oportunidades sin seguimiento visible"} />
            <DailyItem label="Quién necesita claridad" value={tasks.find((task) => task.status === "Bloqueado")?.owner ?? "responsable de área"} />
            <DailyItem label="Qué proceso estandarizar" value={isBrokerage ? "seguimiento post visita y post tasación" : "primera respuesta y seguimiento comercial"} />
            <DailyItem label="Antes de las 17:00" value="Cerrar una fuga concreta y dejar dueño visible." />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Fuga comercial" value={`${scores.commercialLeakIndex}%`} detail="Riesgo combinado en ventas, mensaje y experiencia." icon={Flame} />
        <StatCard label="AI Readiness" value={`${scores.aiReadinessIndex}%`} detail="Datos, workflows, criterios y revisión humana." icon={Brain} />
        <StatCard label="Dependencia humana" value={`${scores.humanDependencyIndex}%`} detail="Procesos que aún dependen de memoria personal." icon={Users} />
        <StatCard label="Urgencia implementación" value={`${scores.implementationUrgency}%`} detail="Presión para convertir diagnóstico en acciones." icon={Clock} />
      </div>

      <ExcellenceScorePanel scores={scores} />

      <BridgePulsePanel compact />

      <Card>
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Inbox™</p>
            <h2 className="mt-2 text-2xl font-semibold">WhatsApp no se reemplaza. Se convierte en sistema.</h2>
            <p className="mt-3 text-sm leading-6 text-fog">
              Bridge Inbox™ transforma mensajes dispersos en oportunidades accionables con responsable, estado, próxima acción, archivos asociados, scripts sugeridos y alertas de seguimiento.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <DailyItem label="Sin próxima acción" value={`${inboxMetrics.withoutNextAction} conversaciones`} />
            <DailyItem label="Sin responsable" value={`${inboxMetrics.unassigned} conversaciones`} />
            <DailyItem label="Archivos dispersos" value={`${inboxMetrics.scatteredFiles} casos`} />
            <DailyItem label="Mensajes sin respuesta" value={`${inboxMetrics.unansweredMessages} mensajes`} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Daily Operating System™</p>
            <h2 className="mt-2 text-2xl font-semibold">El día también tiene sistema</h2>
            <p className="mt-3 text-sm leading-6 text-fog">
              The Bridge System™ no funciona como herramienta suelta. Cada dato alimenta el sistema: Data Room mejora diagnóstico, Scan mejora score, Flow crea tareas, trabajadores entregan feedback, Academy mejora capacidades y Companion guía la siguiente acción.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <DailyItem label="Foco del día" value={todayFocus.title} />
            <DailyItem label="Meta principal" value={liveGoals[0]?.title ?? "Registrar próxima acción en oportunidades abiertas"} />
            <DailyItem label="Riesgo principal" value="Si no se asigna responsable, el seguimiento seguirá dependiendo de memoria humana." />
            <DailyItem label="Acción antes de las 17:00" value="Revisar oportunidades dormidas y asignar responsable." />
            <DailyItem label="Responsable" value={isBrokerage ? "líder de oficina / corredor asignado" : "líder comercial / responsable de área"} />
            <DailyItem label="Mensaje interno" value="Hoy no buscamos hacer más por hacer más. Buscamos cerrar una fuga concreta." />
          </div>
        </div>
      </Card>

      <LiveGoalsPanel compact />

      <BridgeCompanionPanel compact />

      <Card>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Arquitectura operacional</p>
            <h2 className="mt-2 text-2xl font-semibold">Cómo The Bridge System™ convierte señales en mejora continua</h2>
          </div>
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">Rules + Data + AI-ready</span>
        </div>
        <SystemMap />
      </Card>

      <ContinuousImprovementLoop company={company} tasks={tasks} />

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Por qué usar The Bridge System™ todos los días</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {["La empresa carga datos", "El sistema detecta fugas", "Paula Engine™ prioriza", "Bridge Companion™ guía", "Trabajadores ejecutan", "Bridge Culture™ comunica", "Academy entrena", "Pulse mide el día", "El sistema aprende", "La empresa mejora"].map((step, index) => (
            <div key={step} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{step}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-5xl text-sm leading-7 text-fog">
          The Bridge System™ no es un reporte. Es un sistema operativo de mejora continua. Mientras más se usa, más contexto acumula, más precisas son sus alertas y más concretas se vuelven sus recomendaciones.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Scan™ V3</p>
              <h2 className="mt-2 text-2xl font-semibold">Score por sistema operativo</h2>
            </div>
            <span className="rounded bg-bone-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-fog">{scores.maturityLevel}</span>
          </div>
          <AreaScoreChart scores={scores.areaScores} />
        </Card>
        <Card>
          <ScoreRing score={scores.overallScore} />
          <p className="text-center text-sm leading-6 text-fog">Nivel de madurez: <strong className="text-ink">{scores.maturityLevel}</strong></p>
          <p className="mt-4 rounded-md border border-[color:var(--line)] bg-bone-2 p-3 text-sm leading-6 text-fog">{company.industry}</p>
        </Card>
      </div>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Diagnóstico ejecutivo</p>
        <p className="mt-3 max-w-5xl text-base leading-8 text-fog">{getExecutiveDiagnosis(company, scores, dataRoom)}</p>
      </Card>

      <section className="grid gap-4 xl:grid-cols-5">
        {leaks.map((leak) => <LeakCard key={leak.id} leak={leak} />)}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Impacto vs urgencia</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {matrix.map((item) => (
              <div key={item.id} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-copper">{item.quadrant}</p>
                <p className="mt-3 text-sm text-fog">Impacto {item.impact} · Urgencia {item.urgency}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Benchmark Lens</p>
          <p className="mt-3 text-sm leading-6 text-fog">Basado en patrones públicos de transformación digital, lead response, CRM adoption y desafíos sectoriales.</p>
          <div className="mt-4 space-y-3">
            {benchmarks.slice(0, 4).map((benchmark) => (
              <div key={benchmark.title} className="border-t border-[color:var(--line)] pt-3">
                <p className="font-semibold text-ink">{benchmark.title}</p>
                <p className="mt-1 text-sm leading-6 text-fog">{benchmark.productImplication}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {isBrokerage ? (
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Brokerage Lens™</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-md bg-bone-2 p-4">
              <h3 className="font-semibold">Pipeline comprador</h3>
              <p className="mt-3 text-sm text-fog">Lead → Clasificado → Visita → Oferta → Cierre</p>
            </div>
            <div className="rounded-md bg-bone-2 p-4">
              <h3 className="font-semibold">Pipeline propietario</h3>
              <p className="mt-3 text-sm text-fog">Captación → Tasación → Publicación → Visitas → Oferta → Cierre</p>
            </div>
            <div className="rounded-md bg-bone-2 p-4">
              <h3 className="font-semibold">Score hábitos por corredor</h3>
              <p className="mt-3 text-sm text-fog">Respuesta · Seguimiento · Registro · Visitas · Ofertas</p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Riesgos activos" value={rules.riskSignals.length} detail={rules.riskSignals[0]} icon={AlertTriangle} />
        <StatCard label="Oportunidades" value={rules.opportunitySignals.length} detail={rules.opportunitySignals[0]} icon={Route} />
        <StatCard label="Tareas abiertas" value={tasks.filter((task) => task.status !== "Implementado").length} detail="Acciones de mejora en tracker." icon={Clock} />
      </div>
    </div>
  );
}

function DailyItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-4">
      <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}
