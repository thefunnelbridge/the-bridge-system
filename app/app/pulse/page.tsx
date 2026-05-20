"use client";

import { AlertCircle, Bell, CheckCircle2, Clock, FileText as FileTextIcon, GraduationCap, MessageSquare as MessageSquareIcon, Radio, Smartphone, Target, Users } from "lucide-react";
import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { BridgePulsePanel } from "@/components/bridge-pulse-panel";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateActivityFeed } from "@/lib/activity-feed";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import { getInboxMetrics, getInboxPulse } from "@/lib/inbox";
import { getLiveGoals, getTodayFocus, type LiveGoal } from "@/lib/live-goals";
import { generateNotifications, getCriticalNotifications, markNotificationRead, resolveNotification, type BridgeNotification } from "@/lib/notification-engine";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getInboxConversations, getScanResponses, getTrackerTasks } from "@/lib/storage";
import type { AdvancedScores, CompanyProfile, DataRoom, TrackerTask } from "@/lib/types";

function numberFrom(value: unknown, fallback: number) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export default function BridgePulsePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);
  const [goals, setGoals] = useState<LiveGoal[]>([]);
  const [notifications, setNotifications] = useState<BridgeNotification[]>([]);

  useEffect(() => {
    const nextCompany = getCompanyProfile();
    const nextDataRoom = getDataRoom();
    const nextTasks = getTrackerTasks();
    const nextScores = calculateAdvancedScores(getScanResponses());
    const nextGoals = getLiveGoals(nextCompany, nextScores, nextTasks, nextDataRoom);
    setCompany(nextCompany);
    setScores(nextScores);
    setDataRoom(nextDataRoom);
    setTasks(nextTasks);
    setGoals(nextGoals);
    setNotifications(generateNotifications({ company: nextCompany, scores: nextScores, dataRoom: nextDataRoom, tasks: nextTasks, goals: nextGoals }));
  }, []);

  if (!company || !scores || !dataRoom) return null;

  const feed = generateActivityFeed(company, company.industry, tasks, goals);
  const focus = getTodayFocus(goals);
  const companion = getBridgeCompanion(company, scores, dataRoom, tasks);
  const critical = getCriticalNotifications(notifications);
  const operationalScore = Math.round((100 - scores.implementationUrgency + scores.strategicClarityIndex + scores.dataMaturityIndex) / 3);
  const blockedTasks = tasks.filter((task) => task.status === "Bloqueado");
  const riskyGoals = goals.filter((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada");
  const unfollowed = numberFrom(dataRoom.leads.porcentajeSinSeguimiento, 30);
  const inbox = getInboxConversations();
  const inboxMetrics = getInboxMetrics(inbox);
  const inboxPulse = getInboxPulse(inbox);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          eyebrow="Bridge Pulse™"
          title="Pulso vivo diario de la empresa"
          description="Metas, alertas, tareas críticas, oportunidades dormidas, trabajadores bloqueados, notificaciones y actividad reciente en una sola lectura operacional."
        />
        <div className="flex flex-wrap gap-2">
          <Button href="/app/workers/today" variant="secondary"><Smartphone className="size-4" /> Vista trabajador</Button>
          <Button href="/app/tracker"><Target className="size-4" /> Abrir tracker</Button>
        </div>
      </div>

      <BridgePulsePanel />

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Metas del día</p>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {goals.filter((goal) => goal.cadence === "Diaria").map((goal) => (
            <div key={goal.id} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{goal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-fog">{goal.description}</p>
                </div>
                <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-copper">{goal.status}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
                <div className="h-full bg-copper" style={{ width: `${goal.progress}%` }} />
              </div>
              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{goal.progress}% · {goal.metric}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.1)] text-ember"><Radio className="size-5" /></span>
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Pulso de hoy</p>
            <h2 className="mt-2 text-2xl font-semibold">{new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })} · {company.name}</h2>
            <p className="mt-3 text-sm leading-6 text-fog">Estado del día: <strong className="text-ink">{operationalScore >= 75 ? "estable" : operationalScore >= 55 ? "en tensión" : "crítico"}</strong>. Score operativo diario: <strong className="text-ink">{operationalScore}%</strong>.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Metric icon={AlertCircle} label="Alertas activas" value={critical.length} />
          <Metric icon={Target} label="Tareas críticas" value={tasks.filter((task) => task.priority === "Alta" && task.status !== "Implementado").length} />
          <Metric icon={Clock} label="Metas en riesgo" value={riskyGoals.length} />
          <Metric icon={Users} label="Bloqueos visibles" value={blockedTasks.length} />
          <Metric icon={Bell} label="Notificaciones sin leer" value={notifications.filter((item) => item.status === "unread").length} />
          <Metric icon={GraduationCap} label="Microlecciones pendientes" value="3" />
          <Metric icon={CheckCircle2} label="Metas cumplidas" value={goals.filter((goal) => goal.status === "Cumplida").length} />
          <Metric icon={Radio} label="Oportunidades dormidas" value={`${unfollowed}%`} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Pulso de conversaciones</p>
            <h2 className="mt-2 text-2xl font-semibold">Clientes esperando respuesta, documentos pendientes y oportunidades dormidas.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">{inboxPulse.nextBestAction}</p>
          </div>
          <Button href="/app/inbox" variant="secondary">Abrir Bridge Inbox™</Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Metric icon={MessageSquareIcon} label="Críticas hoy" value={inboxMetrics.criticalToday} />
          <Metric icon={Bell} label="Esperando respuesta" value={inboxMetrics.unansweredMessages} />
          <Metric icon={FileTextIcon} label="Documentos pendientes" value={inboxMetrics.pendingDocuments} />
          <Metric icon={Clock} label="Dormidas" value={inboxMetrics.dormantOpportunities} />
          <Metric icon={Users} label="Sin responsable" value={inboxMetrics.unassigned} />
          <Metric icon={AlertCircle} label="Sin próxima acción" value={inboxMetrics.withoutNextAction} />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {inboxPulse.criticalConversations.map((conversation) => (
            <div key={conversation.id} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
              <p className="font-semibold text-ink">{conversation.customer}</p>
              <p className="mt-2 text-sm leading-6 text-fog">{conversation.detectedLeak}</p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-copper">{conversation.channel} · {conversation.status}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Feed operativo en vivo simulado</p>
          <div className="mt-5 space-y-3">
            {feed.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-md border border-[color:var(--line)] bg-bone p-4 lg:grid-cols-[76px_1fr_120px] lg:items-center">
                <span className="font-mono text-sm text-fog">{new Date(item.time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{item.area} · {item.event}</p>
                    <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-copper">{item.priority}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-fog">{item.suggestedAction}</p>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">Responsable: {item.responsible}</p>
                </div>
                <span className="rounded-md border border-[color:var(--line)] bg-bone-2 px-3 py-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{item.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Próxima mejor acción</p>
            <h3 className="mt-3 text-2xl font-semibold">Si haces una sola cosa hoy, haz esto: {focus.title.toLowerCase()}.</h3>
            <p className="mt-3 text-sm leading-6 text-fog">{focus.description}</p>
            <p className="mt-4 rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">{companion.managerGuidance}</p>
          </Card>

          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Alertas en vivo simuladas</p>
            <div className="mt-4 space-y-3">
              {notifications.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-md border border-[color:var(--line)] bg-bone p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-fog">{item.description}</p>
                    </div>
                    <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-copper">{item.priority}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => setNotifications(markNotificationRead(notifications, item.id))}>Marcar leída</Button>
                    <Button variant="ghost" onClick={() => setNotifications(resolveNotification(notifications, item.id))}>Resolver</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string | number }) {
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
