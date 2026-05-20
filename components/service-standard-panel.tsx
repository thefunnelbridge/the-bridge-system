import { getServiceStandardScore } from "@/lib/excellence-library";
import type { AdvancedScores } from "@/lib/types";
import { Card } from "./ui/card";

export function ServiceStandardPanel({ scores }: { scores: AdvancedScores }) {
  const service = getServiceStandardScore(scores);

  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Service Standard™</p>
          <h2 className="mt-2 text-2xl font-semibold">Claridad, cortesía, consistencia, eficiencia y humanidad</h2>
        </div>
        <span className="font-mono text-3xl font-bold text-copper">{service.overall}</span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {service.dimensions.map((item) => (
          <div key={item.name} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
            <p className="font-semibold text-ink">{item.name}</p>
            <p className="mt-2 text-2xl font-semibold text-copper">{item.score}</p>
            <p className="mt-2 text-xs leading-5 text-fog">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md bg-bone-2 p-4">
        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Experience Lens™</p>
        <p className="mt-2 text-sm leading-6 text-fog">
          Revisa dónde el cliente espera, repite información o recibe mensajes inconsistentes. El estándar busca servicio memorable sin perder eficiencia ni humanidad.
        </p>
      </div>
    </Card>
  );
}
