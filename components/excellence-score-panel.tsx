import { calculateBridgeExcellenceScore, getServiceStandardScore, getStrategicScorecard } from "@/lib/excellence-library";
import type { AdvancedScores } from "@/lib/types";
import { Card } from "./ui/card";

export function ExcellenceScorePanel({ scores }: { scores: AdvancedScores }) {
  const excellence = calculateBridgeExcellenceScore(scores);
  const service = getServiceStandardScore(scores);
  const scorecard = getStrategicScorecard(scores);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Excellence Score™</p>
          <p className="mt-4 text-6xl font-semibold">{excellence.overall}</p>
          <p className="mt-3 text-lg font-semibold">{excellence.status}</p>
          <p className="mt-3 text-sm leading-6 text-fog">Compuesto por claridad estratégica, velocidad comercial, servicio, disciplina operativa, cultura, IA, colaborador y cliente.</p>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Strategic Scorecard™</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {scorecard.map((item) => (
              <div key={item.name} className="rounded-md bg-bone-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{item.name}</p>
                  <span className="font-mono text-sm text-copper">{item.score}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-fog">{item.priorityAction}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Service Standard™ · {service.overall}/100</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {service.dimensions.map((item) => (
            <div key={item.name} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold text-copper">{item.score}</p>
              <p className="mt-2 text-xs leading-5 text-fog">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
