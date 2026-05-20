import { Cable } from "lucide-react";
import type { IntegrationItem } from "@/lib/types";
import { Card } from "./ui/card";

export function IntegrationCard({ integration }: { integration: IntegrationItem }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{integration.category}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{integration.name}</h3>
        </div>
        <Cable className="size-5 text-ember" />
      </div>
      <span className="mt-4 w-fit rounded bg-bone-2 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink">
        {integration.status}
      </span>
      <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
        <p><strong className="text-ink">Leerá:</strong> {integration.reads.join(", ")}</p>
        <p><strong className="text-ink">Activará:</strong> {integration.actions.join(", ")}</p>
        <p><strong className="text-ink">Impacto:</strong> {integration.expectedImpact}</p>
        <p><strong className="text-ink">Próxima acción:</strong> {integration.nextAction}</p>
      </div>
      <p className="mt-auto pt-4 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fog">Dificultad {integration.difficulty}</p>
    </Card>
  );
}
