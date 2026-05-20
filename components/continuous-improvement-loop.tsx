import { getContinuousImprovementLoop } from "@/lib/excellence-library";
import type { CompanyProfile, TrackerTask } from "@/lib/types";
import { Card } from "./ui/card";

export function ContinuousImprovementLoop({ company, tasks }: { company: CompanyProfile; tasks: TrackerTask[] }) {
  const loop = getContinuousImprovementLoop(company, tasks);

  return (
    <Card>
      <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Continuous Improvement Loop™</p>
      <div className="mt-5 grid gap-3 md:grid-cols-6">
        {loop.steps.map((step, index) => (
          <div key={step} className="rounded-md bg-bone-2 p-4">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-copper">0{index + 1}</p>
            <p className="mt-2 font-semibold">{step}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 max-w-4xl text-sm leading-7 text-fog">
        Inspirado en principios públicos de mejora continua: el sistema no busca culpar personas, sino convertir problemas repetidos en procesos visibles, medibles y mejorables.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-[color:var(--line)] bg-bone p-4"><strong>Último aprendizaje:</strong><p className="mt-2 text-sm text-fog">{loop.lastLearning}</p></div>
        <div className="rounded-md border border-[color:var(--line)] bg-bone p-4"><strong>Proceso a estandarizar:</strong><p className="mt-2 text-sm text-fog">{loop.processToStandardize}</p></div>
        <div className="rounded-md border border-[color:var(--line)] bg-bone p-4"><strong>Microacción:</strong><p className="mt-2 text-sm text-fog">{loop.suggestedMicroAction}</p></div>
      </div>
    </Card>
  );
}
