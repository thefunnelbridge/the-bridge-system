import { AlertTriangle } from "lucide-react";
import type { Leak } from "@/lib/types";
import { Card } from "./ui/card";

export function LeakCard({ leak }: { leak: Leak }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-md bg-ember/10 text-ember">
          <AlertTriangle className="size-4" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{leak.areaName}</p>
            <span className="rounded border border-[color:var(--line)] px-2 py-1 font-mono text-[0.62rem] text-fog">{leak.score}/100</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink">{leak.title}</h3>
          <p className="mt-2 text-sm leading-6 text-fog">{leak.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[0.64rem] uppercase tracking-[0.12em]">
            <span className="rounded bg-bone-2 px-2 py-1 text-ink">Impacto {leak.impact}</span>
            <span className="rounded bg-ember/10 px-2 py-1 text-ember">Urgencia {leak.urgency}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
