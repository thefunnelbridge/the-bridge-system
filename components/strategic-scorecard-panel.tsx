import { getStrategicScorecard } from "@/lib/excellence-library";
import type { AdvancedScores } from "@/lib/types";
import { Card } from "./ui/card";

export function StrategicScorecardPanel({ scores }: { scores: AdvancedScores }) {
  const scorecard = getStrategicScorecard(scores);

  return (
    <Card>
      <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Strategic Scorecard™</p>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">
        Inspirado en principios públicos de medición balanceada del desempeño: finanzas, clientes, procesos, aprendizaje, datos e IA se leen como un solo sistema.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {scorecard.map((item) => (
          <div key={item.name} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{item.indicator}</p>
              </div>
              <span className="font-mono text-xl font-bold text-copper">{item.score}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-fog">{item.priorityAction}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
