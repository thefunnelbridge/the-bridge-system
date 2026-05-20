"use client";

import { useEffect, useState } from "react";
import { FlowTimeline } from "@/components/flow-timeline";
import { RecommendationCard } from "@/components/recommendation-card";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { generateRecommendations, getSuggestedFlow } from "@/lib/recommendations";
import { calculateAreaScores, getTopLeaks } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses, getTrackerTasks, saveTrackerTasks } from "@/lib/storage";
import type { Recommendation, TrackerTask } from "@/lib/types";

export default function FlowPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notice, setNotice] = useState("");

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

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Bridge Flow™" title="Ruta sugerida de implementación" description="Un flujo claro para pasar de diagnóstico a corrección, automatización, entrenamiento y medición." />
      <FlowTimeline steps={getSuggestedFlow()} />
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Paula Engine™</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">La ruta prioriza libertad operativa: procesos que dejan de depender de la memoria humana, equipos que vuelven a pensar y mejora continua medible.</p>
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
