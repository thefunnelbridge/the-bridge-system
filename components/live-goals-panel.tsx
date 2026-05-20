"use client";

import { Bell, CheckCircle2, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { getLiveGoals, updateGoalProgress, type LiveGoal } from "@/lib/live-goals";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function LiveGoalsPanel({ compact = false }: { compact?: boolean }) {
  const [goals, setGoals] = useState<LiveGoal[]>([]);

  useEffect(() => {
    const company = getCompanyProfile();
    const generated = getLiveGoals(company, calculateAdvancedScores(getScanResponses()), getTrackerTasks());
    const stored = window.localStorage.getItem("bridge-system.liveGoals");
    if (!stored) {
      setGoals(generated);
      return;
    }
    try {
      const overrides = JSON.parse(stored) as LiveGoal[];
      setGoals(generated.map((goal) => overrides.find((item) => item.id === goal.id) ?? goal));
    } catch {
      setGoals(generated);
    }
  }, []);

  function markProgress(goal: LiveGoal) {
    const nextGoals = updateGoalProgress(goals, goal.id, Math.min(100, goal.progress + 15));
    setGoals(nextGoals);
    window.localStorage.setItem("bridge-system.liveGoals", JSON.stringify(nextGoals));
  }

  const visible = compact ? goals.slice(0, 3) : goals;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Live Goals™</p>
          <h2 className="mt-2 text-2xl font-semibold">Metas vivas conectadas a fugas, roles y aprendizaje</h2>
        </div>
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fog">Daily · Weekly · Team</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {visible.map((goal) => (
          <Card key={goal.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.1)] text-ember">
                {goal.status === "Cumplida" ? <CheckCircle2 className="size-4" /> : <Target className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.13em] text-copper">{goal.cadence}</p>
                  <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-fog">{goal.status}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{goal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fog">{goal.description}</p>
                <p className="mt-2 text-sm leading-6 text-fog">Responsable: {goal.owner}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
                  <div className="h-full bg-copper" style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-fog">{goal.progress}% · {goal.metric} · límite {goal.dueDate}</p>
                <p className="mt-3 text-sm leading-6 text-fog">{goal.companionRecommendation}</p>
                {!compact ? (
                  <Button className="mt-4" variant="secondary" onClick={() => markProgress(goal)}>
                    <Bell className="size-4" /> Marcar avance
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
