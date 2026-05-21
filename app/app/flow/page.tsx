"use client";

import { ArrowRight, Bot, CalendarClock, CheckCircle2, Flame, GitBranch, TimerReset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FlowTimeline } from "@/components/flow-timeline";
import { RecommendationCard } from "@/components/recommendation-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInboxFlowRecommendation } from "@/lib/inbox";
import { generateRecommendations, getSuggestedFlow } from "@/lib/recommendations";
import { calculateAreaScores, getTopLeaks } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses, getTrackerTasks, saveTrackerTasks } from "@/lib/storage";
import type { Recommendation, TrackerTask } from "@/lib/types";

export default function FlowPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notice, setNotice] = useState("");
  const inboxFlow = getInboxFlowRecommendation();

  useEffect(() => {
    const company = getCompanyProfile();
    const scores = calculateAreaScores(getScanResponses());
    setRecommendations(generateRecommendations(getTopLeaks(scores), company));
  }, []);

  function addToTracker(recommendation: Recommendation) {
    const tasks = getTrackerTasks();
    const newTask: TrackerTask = {
      id: `rec-task-${recommendation.id}`,
      title: recommendation.action72Hours,
      description: recommendation.whyItMatters,
      area: recommendation.area,
      origin: "Bridge Flow™",
      priority: recommendation.priority,
      owner: recommendation.owner,
      status: "Pendiente",
      suggestedDate: "72 horas",
      kpi: recommendation.kpi,
      expectedImpact: recommendation.impact,
      difficulty: recommendation.difficulty,
      createdAt: new Date().toISOString(),
    };
    const next = tasks.some((task) => task.id === newTask.id) ? tasks : [...tasks, newTask];
    saveTrackerTasks(next);
    setNotice("Recomendación agregada al tracker.");
  }

  function addInboxToTracker() {
    const tasks = getTrackerTasks();
    const newTask: TrackerTask = {
      id: "bridge-inbox-order-whatsapp",
      title: inboxFlow.action72Hours,
      description: "Bridge Inbox™ transforma conversaciones dispersas en oportunidades con responsable, estado, archivo y próxima acción.",
      area: "Bridge Inbox™",
      origin: "Bridge Flow™",
      priority: "Alta",
      owner: "Coordinación comercial",
      status: "Pendiente",
      suggestedDate: "72 horas",
      kpi: inboxFlow.kpi,
      expectedImpact: "Menos clientes perdidos dentro del chat y más trazabilidad de seguimiento.",
      difficulty: "Media",
      createdAt: new Date().toISOString(),
    };
    const next = tasks.some((task) => task.id === newTask.id) ? tasks : [...tasks, newTask];
    saveTrackerTasks(next);
    setNotice("Acción de Bridge Inbox™ agregada al tracker.");
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-ink p-6 text-bone shadow-[0_24px_90px_rgba(10,10,10,0.18)] lg:p-8">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-copper">Bridge Flow™ · Action Architecture</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-7xl">De insight a ejecución, sin que la mejora dependa de memoria humana.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(245,241,234,0.78)]">
              Esta capa toma fugas, tendencias, conversaciones y señales del Scan para convertirlas en acciones con responsable, KPI, dificultad, script y próximo paso.
            </p>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.16)] bg-[rgba(245,241,234,0.08)] p-5">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Si no sabes por dónde partir</p>
            <p className="mt-3 text-2xl font-semibold">Parte por la acción de 72 horas.</p>
            <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.72)]">
              Es el puente entre “diagnosticamos algo” y “alguien hizo algo medible antes de que la semana se enfriara”.
            </p>
          </div>
        </div>
      </div>

      <SectionHeader eyebrow="Bridge Flow™" title="Ruta sugerida de implementación" description="Un flujo claro para pasar de diagnóstico a corrección, automatización, entrenamiento y medición." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CommandTile icon={Flame} title="Ahora" text="Cerrar una fuga visible antes de que se convierta en otra reunión." />
        <CommandTile icon={TimerReset} title="72 horas" text="Asignar responsable, próxima acción y KPI verificable." />
        <CommandTile icon={CalendarClock} title="7 días" text="Estandarizar el comportamiento mínimo del equipo." />
        <CommandTile icon={Bot} title="30 días" text="Automatizar solo lo que ya está claro y documentado." />
      </div>
      <FlowTimeline steps={getSuggestedFlow()} />
      <Card className="bg-bone-2">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Paula Engine™</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">La ruta prioriza libertad operativa: procesos que dejan de depender de la memoria humana, equipos que vuelven a pensar y mejora continua medible.</p>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Traducción simple</p>
            <p className="mt-2 text-sm leading-6 text-fog">No es “hacer más tareas”. Es instalar un sistema para que la próxima acción correcta aparezca a tiempo.</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Inbox™</p>
            <h2 className="mt-2 text-2xl font-semibold">{inboxFlow.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">WhatsApp no es el problema. El problema es usarlo sin estructura. Cada conversación debe tener responsable, estado y próxima acción.</p>
          </div>
          <Button variant="secondary" onClick={addInboxToTracker}>Agregar al tracker</Button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          <Action label="Acción inmediata" value={inboxFlow.immediate} />
          <Action label="Acción 72 horas" value={inboxFlow.action72Hours} />
          <Action label="Acción 7 días" value={inboxFlow.action7Days} />
          <Action label="Acción 30 días" value={inboxFlow.action30Days} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <Action label="Automatización sugerida" value={inboxFlow.automation} />
          <Action label="Script sugerido" value={inboxFlow.script} />
          <Action label="KPI a medir" value={inboxFlow.kpi} />
        </div>
      </Card>
      {notice ? <p className="rounded-md border border-[color:var(--line)] bg-bone-2 px-4 py-3 text-sm text-ink">{notice}</p> : null}
      <div className="rounded-xl border border-[color:var(--line)] bg-white/55 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Recomendaciones estratégicas</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Cada card tiene una ruta completa: acción, automatización, script y KPI.</h2>
          </div>
          <Button href="/app/tracker" variant="secondary">Ver tracker <ArrowRight className="size-4" /></Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} onAdd={addToTracker} />
        ))}
      </div>
    </div>
  );
}

function CommandTile({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <Card className="group hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-md bg-ink text-bone transition group-hover:bg-ember">
          <Icon className="size-5" />
        </span>
        <GitBranch className="size-4 text-copper" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-fog">{text}</p>
    </Card>
  );
}

function Action({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-md border border-[color:var(--line)] bg-bone p-4 transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
      <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper"><CheckCircle2 className="size-3" /> {label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}
