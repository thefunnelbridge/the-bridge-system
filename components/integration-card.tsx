import { Cable } from "lucide-react";
import { Card } from "./ui/card";

export function IntegrationCard({ category, status, tools }: { category: string; status: string; tools: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{status}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{category}</h3>
        </div>
        <Cable className="size-5 text-ember" />
      </div>
      <p className="mt-4 text-sm leading-6 text-fog">{tools}</p>
    </Card>
  );
}
