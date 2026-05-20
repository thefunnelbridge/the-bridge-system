"use client";

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
      <SectionHeader eyebrow="Bridge Flow™" title="Ruta sugerida de implementación" description="Un flujo claro para pasar de diagnóstico a corrección, automatización, entrenamiento y medición." />
      <FlowTimeline steps={getSuggestedFlow()} />
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Paula Engine™</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">La ruta prioriza libertad operativa: procesos que dejan de depender de la memoria humana, equipos que vuelven a pensar y mejora continua medible.</p>
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
      <div className="grid gap-4 xl:grid-cols-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} onAdd={addToTracker} />
        ))}
      </div>
    </div>
  );
}

function Action({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-4">
      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}
