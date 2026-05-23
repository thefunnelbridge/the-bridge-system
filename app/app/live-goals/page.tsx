"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarClock, CheckCircle2, Flame, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiveGoalsPanel } from "@/components/live-goals-panel";
import { MissionControl } from "@/components/command-widgets";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { getLiveGoals, getTodayFocus, type LiveGoal } from "@/lib/live-goals";

export default function LiveGoalsPage() {
  const [goals, setGoals] = useState<LiveGoal[]>([]);

  useEffect(() => {
    const company = getCompanyProfile();
    const scores = calculateAdvancedScores(getScanResponses());
    setGoals(getLiveGoals(company, scores, getTrackerTasks(), getDataRoom()));
  }, []);

  const focus = useMemo(() => getTodayFocus(goals), [goals]);
  const completed = goals.filter((goal) => goal.status === "Cumplida").length;
  const atRisk = goals.filter((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada").length;
  const daily = goals.filter((goal) => goal.cadence === "Diaria").length;
  const weekly = goals.filter((goal) => goal.cadence === "Semanal").length;

  return (
    <div className="space-y-8">
      <MissionControl
        mission="Convertir metas diarias en avance visible."
        nextAction={focus.description}
        risk="Si las metas no tienen dueño, deadline y KPI, la ejecución vuelve a depender de memoria humana."
        owner="Dirección y líderes de área"
        deadline="Hoy · 17:00"
        progress={goals.length ? Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length) : 42}
      />

      <SectionHeader
        eyebrow="Live Goals™"
        title="Metas vivas para mantener despierta la operación"
        description="Cada meta conecta diagnóstico, tareas, responsables, alertas y Bridge Companion™. La idea no es controlar al equipo: es darle foco diario."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GoalMetric icon={Target} label="Metas del día" value={String(daily)} detail="Foco operativo diario" />
        <GoalMetric icon={CalendarClock} label="Metas semanales" value={String(weekly)} detail="Mejora continua" />
        <GoalMetric icon={Flame} label="En riesgo" value={String(atRisk)} detail="Requieren claridad" />
        <GoalMetric icon={CheckCircle2} label="Cumplidas" value={String(completed)} detail="Avance visible" />
      </div>

      <Card className="bg-bone-2">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Foco de hoy</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{focus.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">{focus.description}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Bridge Companion™</p>
            <p className="mt-2 text-sm leading-6 text-fog">
              El sistema recomienda revisar las metas en riesgo antes de abrir nuevas iniciativas. Una operación inteligente protege el foco antes de pedir más esfuerzo.
            </p>
            <Button href="/app/pulse" className="mt-4" variant="secondary">
              <Bell className="size-4" /> Ver Pulse
            </Button>
          </div>
        </div>
      </Card>

      <LiveGoalsPanel />
    </div>
  );
}

function GoalMetric({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-lg bg-[rgba(255,59,31,0.1)] text-ember">
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-3xl font-bold text-ink">{value}</span>
      </div>
      <p className="mt-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{detail}</p>
    </Card>
  );
}
