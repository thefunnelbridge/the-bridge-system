"use client";

import { useEffect, useState } from "react";
import { AreaScoreChart } from "@/components/area-score-chart";
import { LeakCard } from "@/components/leak-card";
import { ScoreRing } from "@/components/score-ring";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateAreaScores, calculateOverallScore, generateExecutiveInsight, getMaturityStatus, getTopLeaks } from "@/lib/scoring";
import { getScanResponses } from "@/lib/storage";
import type { AreaScore } from "@/lib/types";

export default function ResultsPage() {
  const [scores, setScores] = useState<AreaScore[]>([]);

  useEffect(() => setScores(calculateAreaScores(getScanResponses())), []);

  const overall = calculateOverallScore(scores);
  const leaks = getTopLeaks(scores);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Bridge Insight™" title="Resultados del diagnóstico" description="Lectura ejecutiva del Bridge Score™, madurez y puntos de fuga prioritarios." />
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Card>
          <ScoreRing score={overall} />
          <p className="text-center text-xl font-semibold">{getMaturityStatus(overall)}</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Diagnóstico ejecutivo</h2>
          <p className="mt-4 text-base leading-8 text-fog">{generateExecutiveInsight()}</p>
          <div className="mt-6 rounded-lg border border-[color:var(--line)] bg-bone-2 p-4">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Brain™ AI layer ready</p>
            <p className="mt-2 text-sm leading-6 text-fog">La función mock `generateExecutiveInsight()` ya deja preparado el punto de conexión para OpenAI.</p>
          </div>
        </Card>
      </div>
      <Card>
        <AreaScoreChart scores={scores} />
      </Card>
      <section className="grid gap-4 lg:grid-cols-3">
        {leaks.map((leak) => <LeakCard key={leak.areaId} leak={leak} />)}
      </section>
      <Button href="/app/flow">Ver Bridge Flow™</Button>
    </div>
  );
}
