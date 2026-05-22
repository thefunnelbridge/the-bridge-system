"use client";

import { CalendarClock, Plus, Sparkles, Target } from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function RecommendationCard({
  recommendation,
  onAdd,
}: {
  recommendation: Recommendation;
  onAdd?: (recommendation: Recommendation) => void;
}) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Misión · {recommendation.priority}</p>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-ink">{recommendation.leakTitle}</h3>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-ink text-ember transition group-hover:bg-ember group-hover:text-bone">
          <Sparkles className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-fog"><strong className="text-ink">Por qué importa:</strong> {recommendation.whyItMatters}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-bone-2">
        <div className="h-full w-[42%] rounded-full bg-ember transition-all group-hover:w-[68%]" />
      </div>
      <div className="mt-5 grid gap-3">
        <MissionStep label="Acción inmediata" value={recommendation.actionImmediate} />
        <MissionStep label="72 horas" value={recommendation.action72Hours} />
        <MissionStep label="7 días" value={recommendation.action7Days} />
        <MissionStep label="30 días" value={recommendation.action30Days} />
      </div>
      <div className="mt-5 grid gap-3 text-sm leading-6 text-fog sm:grid-cols-2">
        <p className="rounded-md bg-bone p-3"><strong className="text-ink">Responsable:</strong> {recommendation.owner}</p>
        <p className="rounded-md bg-bone p-3"><strong className="text-ink">KPI:</strong> {recommendation.kpi}</p>
        <p className="rounded-md bg-bone p-3"><strong className="text-ink">Dificultad:</strong> {recommendation.difficulty}</p>
        <p className="rounded-md bg-bone p-3"><strong className="text-ink">Impacto:</strong> {recommendation.impact}</p>
      </div>
      <div className="mt-4 rounded-md border border-copper/30 bg-bone p-3">
        <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Riesgo de no actuar</p>
        <p className="mt-2 text-sm leading-6 text-fog">{recommendation.riskOfInaction}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
        <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog"><CalendarClock className="size-4 text-copper" /> deadline 30 días</span>
        {onAdd ? (
          <Button variant="secondary" onClick={() => onAdd(recommendation)}>
            <Plus className="size-4" /> Activar tarea
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function MissionStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-3">
      <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper"><Target className="size-3" /> {label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}
