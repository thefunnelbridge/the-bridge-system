"use client";

import { Plus, Sparkles } from "lucide-react";
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
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{recommendation.priority}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{recommendation.leakTitle}</h3>
        </div>
        <Sparkles className="mt-1 size-5 text-ember" />
      </div>
      <div className="mt-5 space-y-4 text-sm leading-6 text-fog">
        <p><strong className="text-ink">Acción inmediata:</strong> {recommendation.actionImmediate}</p>
        <p><strong className="text-ink">Acción de sistema:</strong> {recommendation.actionSystem}</p>
        <p><strong className="text-ink">Automatización/IA:</strong> {recommendation.actionAutomation}</p>
        <p><strong className="text-ink">Impacto esperado:</strong> {recommendation.expectedImpact}</p>
        <p><strong className="text-ink">Primer paso:</strong> {recommendation.firstStep}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">Dificultad {recommendation.difficulty}</span>
        {onAdd ? (
          <Button variant="secondary" onClick={() => onAdd(recommendation)}>
            <Plus className="size-4" /> Agregar al tracker
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
