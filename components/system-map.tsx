import { ArrowRight, Brain, Database, GraduationCap, LineChart, Radar, Route, ShieldCheck } from "lucide-react";

const nodes = [
  { title: "Data Room", detail: "señales reales o demo", icon: Database },
  { title: "Bridge Scan™", detail: "diagnóstico multicapa", icon: Radar },
  { title: "Bridge Insight™", detail: "índices y fugas", icon: LineChart },
  { title: "Paula Engine™", detail: "decisión ponderada", icon: Brain },
  { title: "Bridge Flow™", detail: "acciones y scripts", icon: Route },
  { title: "Bridge Academy™", detail: "hábitos de equipo", icon: GraduationCap },
  { title: "Tracker", detail: "implementación visible", icon: ShieldCheck },
];

export function SystemMap() {
  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--line)] bg-white/35 p-4">
      <div className="flex min-w-[980px] items-stretch gap-3">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.title} className="flex flex-1 items-center gap-3">
              <div className="min-h-32 flex-1 rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-bone-2 text-copper">
                    <Icon className="size-4" />
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog">0{index + 1}</span>
                </div>
                <p className="mt-4 font-semibold text-ink">{node.title}</p>
                <p className="mt-1 text-sm leading-5 text-fog">{node.detail}</p>
              </div>
              {index < nodes.length - 1 ? <ArrowRight className="size-4 shrink-0 text-copper" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
