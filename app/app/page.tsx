"use client";

import { AlertTriangle, ClipboardCheck, ListChecks, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { AreaScoreChart } from "@/components/area-score-chart";
import { LeakCard } from "@/components/leak-card";
import { ScoreRing } from "@/components/score-ring";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCompanyProfile, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { calculateAreaScores, calculateOverallScore, getMaturityStatus, getTopLeaks } from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";
import type { CompanyProfile, AreaScore, TrackerTask } from "@/lib/types";

export default function DashboardPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AreaScore[]>([]);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setScores(calculateAreaScores(getScanResponses()));
    setTasks(getTrackerTasks());
  }, []);

  const overall = calculateOverallScore(scores);
  const leaks = getTopLeaks(scores);
  const recommendations = generateRecommendations(leaks);
  const criticalAreas = scores.filter((area) => area.score < 60).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Dashboard principal"
          title={company?.name ?? "Constructora del Sur SpA"}
          description="Resumen ejecutivo de madurez, puntos de fuga y acciones de implementación para recuperar claridad comercial y operativa."
        />
        <div className="flex flex-wrap gap-2">
          <Button href="/app/scan" variant="secondary">Continuar diagnóstico</Button>
          <Button href="/app/flow">Ver Bridge Flow™</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Puntos de fuga detectados" value={leaks.length} detail="Áreas con menor score priorizadas por urgencia." icon={AlertTriangle} />
        <StatCard label="Recomendaciones activas" value={recommendations.length} detail="Acciones inmediatas, de sistema y automatización." icon={Target} />
        <StatCard label="Tareas en implementación" value={tasks.filter((task) => task.status !== "Implementado").length} detail="Checklist demo persistido en localStorage." icon={ListChecks} />
        <StatCard label="Áreas críticas" value={criticalAreas} detail="Scores bajo 60 requieren corrección prioritaria." icon={ClipboardCheck} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Score por área</p>
              <h2 className="mt-2 text-2xl font-semibold">Bridge Scan™</h2>
            </div>
            <span className="rounded bg-bone-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-fog">{getMaturityStatus(overall)}</span>
          </div>
          <AreaScoreChart scores={scores} />
        </Card>
        <Card>
          <ScoreRing score={overall} />
          <p className="text-center text-sm leading-6 text-fog">Estado de madurez: <strong className="text-ink">{getMaturityStatus(overall)}</strong></p>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Top 3 puntos de fuga</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {leaks.map((leak) => <LeakCard key={leak.areaId} leak={leak} />)}
        </div>
      </section>
    </div>
  );
}
