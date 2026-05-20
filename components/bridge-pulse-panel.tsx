"use client";

import { AlertCircle, Bell, CheckCircle2, Clock, GraduationCap, Radio, Smartphone, Target, Users } from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { generateActivityFeed, getRecentActivity } from "@/lib/activity-feed";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import { getLiveGoals, getTodayFocus } from "@/lib/live-goals";
import { generateNotifications, getCriticalNotifications } from "@/lib/notification-engine";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function numberFrom(value: unknown, fallback: number) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function BridgePulsePanel({ compact = false }: { compact?: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  if (!ready) return null;

  const company = getCompanyProfile();
  const dataRoom = getDataRoom();
  const tasks = getTrackerTasks();
  const scores = calculateAdvancedScores(getScanResponses());
  const goals = getLiveGoals(company, scores, tasks, dataRoom);
  const notifications = generateNotifications({ company, scores, dataRoom, tasks, goals });
  const feed = generateActivityFeed(company, company.industry, tasks, goals);
  const critical = getCriticalNotifications(notifications);
  const focus = getTodayFocus(goals);
  const companion = getBridgeCompanion(company, scores, dataRoom, tasks);
  const completedToday = tasks.filter((task) => task.status === "Implementado").length;
  const blocked = tasks.filter((task) => task.status === "Bloqueado").length;
  const riskyGoals = goals.filter((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada").length;
  const operationalScore = Math.round((100 - scores.implementationUrgency + scores.strategicClarityIndex + scores.dataMaturityIndex) / 3);
  const pulseState = operationalScore >= 75 ? "Día estable" : operationalScore >= 55 ? "Día en tensión" : "Día crítico";
  const unfollowed = numberFrom(dataRoom.leads.porcentajeSinSeguimiento, 30);

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Pulse™</p>
          <h2 className="mt-2 text-2xl font-semibold">Pulso operativo diario</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-fog">
            The Bridge System™ está diseñado para uso continuo. No se completa una vez: se instala como capa de inteligencia aplicada sobre la operación diaria de la empresa.
          </p>
        </div>
        <Button href="/app/pulse" variant="secondary"><Bell className="size-4" /> Abrir Pulse</Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <PulseMetric icon={Clock} label="Estado del día" value={pulseState} />
        <PulseMetric icon={Target} label="Score operativo" value={`${operationalScore}%`} />
        <PulseMetric icon={AlertCircle} label="Alertas críticas" value={critical.length} />
        <PulseMetric icon={Users} label="Bloqueos visibles" value={blocked} />
      </div>

      <div className="mt-5 rounded-md border border-[color:var(--line)] bg-bone-2 p-4">
        <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-copper">Próxima mejor acción</p>
        <p className="mt-2 text-lg font-semibold text-ink">Si haces una sola cosa hoy, haz esto: {focus.title.toLowerCase()}.</p>
        <p className="mt-2 text-sm leading-6 text-fog">{companion.dailyFocus}</p>
      </div>

      {!compact ? (
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-copper">Feed operativo</p>
            <div className="mt-3 space-y-3">
              {getRecentActivity(feed, 5).map((item) => (
                <div key={item.id} className="grid gap-3 rounded-md border border-[color:var(--line)] bg-bone p-3 md:grid-cols-[72px_1fr_auto] md:items-center">
                  <span className="font-mono text-xs text-fog">{new Date(item.time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span>
                  <div>
                    <p className="font-semibold text-ink">{item.area} · {item.event}</p>
                    <p className="mt-1 text-sm text-fog">{item.suggestedAction}</p>
                  </div>
                  <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-copper">{item.priority}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-copper">Indicadores vivos</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <PulseMetric icon={CheckCircle2} label="Tareas completadas" value={completedToday} />
              <PulseMetric icon={AlertCircle} label="Metas en riesgo" value={riskyGoals} />
              <PulseMetric icon={Bell} label="Sin leer" value={notifications.filter((item) => item.status === "unread").length} />
              <PulseMetric icon={GraduationCap} label="Microlecciones" value="3" />
              <PulseMetric icon={Users} label="Trabajadores activos" value="12" />
              <PulseMetric icon={Radio} label="Oportunidades dormidas" value={`${unfollowed}%`} />
              <PulseMetric icon={Smartphone} label="Mobile ready" value="Activo" />
            </div>
            <Link href="/app/workers/today" className="mt-4 block rounded-md border border-[color:var(--line)] bg-bone p-4 text-sm leading-6 text-fog transition hover:border-copper">
              Abrir vista móvil del trabajador: metas, tareas, notificaciones y microlección de hoy.
            </Link>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function PulseMetric({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-4">
      <div className="flex items-center gap-2 text-copper">
        <Icon className="size-4" />
        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em]">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
