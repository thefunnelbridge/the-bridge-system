import { generateInternalComms, getWeeklyCommsSummary } from "@/lib/internal-comms";
import type { AdvancedScores, CompanyProfile, TrackerTask } from "@/lib/types";
import { Card } from "./ui/card";

export function InternalCommsPanel({
  company,
  scores,
  tasks,
  compact = false,
}: {
  company: CompanyProfile;
  scores: AdvancedScores;
  tasks: TrackerTask[];
  compact?: boolean;
}) {
  const messages = generateInternalComms(company, scores, tasks);
  const visible = compact ? messages.slice(0, 3) : messages;

  return (
    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Internal Comms™</p>
          <h2 className="mt-2 text-2xl font-semibold">Comunicación interna para mover la operación</h2>
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog">Daily · Weekly · Team</span>
      </div>
      <p className="mt-4 rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">{getWeeklyCommsSummary(company, scores)}</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {visible.map((item) => (
          <div key={item.title} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{item.audience} · {item.tone}</p>
            <h3 className="mt-2 font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-fog">{item.message}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
