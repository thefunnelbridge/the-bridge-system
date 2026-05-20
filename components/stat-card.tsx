import type { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="min-h-36">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md border border-[color:var(--line)] bg-bone-2">
          <Icon className="size-5 text-ink" />
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-fog">{detail}</p>
    </Card>
  );
}
