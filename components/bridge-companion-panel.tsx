"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { Card } from "./ui/card";

export function BridgeCompanionPanel({ compact = false }: { compact?: boolean }) {
  const [companion, setCompanion] = useState<ReturnType<typeof getBridgeCompanion> | null>(null);

  useEffect(() => {
    const company = getCompanyProfile();
    setCompanion(getBridgeCompanion(company, calculateAdvancedScores(getScanResponses()), getDataRoom(), getTrackerTasks()));
  }, []);

  if (!companion) return null;
  const items = [
    ["Next best action", companion.nextBestAction],
    ["Daily focus", companion.dailyFocus],
    ["Manager guidance", companion.managerGuidance],
    ["Worker guidance", companion.workerGuidance],
    ["Cultural warning", companion.culturalWarning],
    ["Automation readiness", companion.automationReadinessAdvice],
  ];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.1)] text-ember"><MessageSquare className="size-5" /></span>
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Companion™</p>
          <h2 className="mt-2 text-2xl font-semibold">Guía operativa para dirección, líderes y trabajadores</h2>
        </div>
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        {items.slice(0, compact ? 4 : items.length).map(([label, text]) => (
          <div key={label} className="rounded-md bg-bone-2 p-4">
            <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
            <p className="mt-2 text-sm leading-6 text-fog">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
