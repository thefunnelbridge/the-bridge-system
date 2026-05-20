"use client";

import { AlertCircle, CheckCircle2, CircleHelp, Clock, GraduationCap, MessageSquare, ShieldAlert, Smartphone, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import type { BridgeInboxConversation } from "@/lib/inbox";
import { getLiveGoals, updateGoalProgress, type LiveGoal } from "@/lib/live-goals";
import { generateNotifications, type BridgeNotification } from "@/lib/notification-engine";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getInboxConversations, getScanResponses, getTrackerTasks, saveInboxConversations, saveTrackerTasks } from "@/lib/storage";
import type { TrackerTask } from "@/lib/types";

const worker = {
  name: "María",
  role: "Ejecutiva comercial",
  area: "Ventas y seguimiento",
};

export default function WorkerTodayPage() {
  const [goals, setGoals] = useState<LiveGoal[]>([]);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);
  const [notifications, setNotifications] = useState<BridgeNotification[]>([]);
  const [conversations, setConversations] = useState<BridgeInboxConversation[]>([]);
  const [lessonDone, setLessonDone] = useState(false);
  const [message, setMessage] = useState("");
  const [workerNotice, setWorkerNotice] = useState("");

  useEffect(() => {
    const company = getCompanyProfile();
    const dataRoom = getDataRoom();
    const nextTasks = getTrackerTasks();
    const scores = calculateAdvancedScores(getScanResponses());
    const nextGoals = getLiveGoals(company, scores, nextTasks, dataRoom);
    const companion = getBridgeCompanion(company, scores, dataRoom, nextTasks);
    setGoals(nextGoals.filter((goal) => goal.cadence === "Diaria").slice(0, 3));
    setTasks(nextTasks.filter((task) => task.status !== "Implementado").slice(0, 4));
    setNotifications(generateNotifications({ company, scores, dataRoom, tasks: nextTasks, goals: nextGoals }).slice(0, 4));
    setConversations(getInboxConversations().filter((item) => item.status !== "Cerrado").slice(0, 3));
    setMessage(companion.workerGuidance);
    setLessonDone(window.localStorage.getItem("bridge-system.worker.lessonDone") === "true");
  }, []);

  function markProgress(goal: LiveGoal) {
    const nextGoals = updateGoalProgress(goals, goal.id, Math.min(100, goal.progress + 20));
    setGoals(nextGoals);
    window.localStorage.setItem("bridge-system.worker.goals", JSON.stringify(nextGoals));
  }

  function reportBlock(task: TrackerTask) {
    const allTasks = getTrackerTasks();
    const updated = allTasks.map((item) => (item.id === task.id ? { ...item, status: "Bloqueado" as const } : item));
    saveTrackerTasks(updated);
    setTasks(updated.filter((item) => item.status !== "Implementado").slice(0, 4));
    setWorkerNotice("Bloqueo reportado en el tracker.");
  }

  function completeLesson() {
    setLessonDone(true);
    window.localStorage.setItem("bridge-system.worker.lessonDone", "true");
  }

  function askClarity(task: TrackerTask) {
    const request = {
      taskId: task.id,
      taskTitle: task.title,
      requestedAt: new Date().toISOString(),
      worker: worker.name,
    };
    window.localStorage.setItem("bridge-system.worker.clarityRequest", JSON.stringify(request));
    setWorkerNotice("Solicitud de claridad registrada.");
  }

  function updateConversation(conversation: BridgeInboxConversation, patch: Partial<BridgeInboxConversation>, text: string) {
    const all = getInboxConversations();
    const updated = all.map((item) => (item.id === conversation.id ? { ...item, ...patch } : item));
    saveInboxConversations(updated);
    setConversations(updated.filter((item) => item.status !== "Cerrado").slice(0, 3));
    setWorkerNotice(text);
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 pb-10">
      <Card className="bg-ink text-bone">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-copper">Hoy en The Bridge System™</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Hola, {worker.name}</h1>
            <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.7)]">{worker.role} · {worker.area}</p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[rgba(245,241,234,0.1)] text-copper"><Smartphone className="size-5" /></span>
        </div>
        <p className="mt-5 rounded-md bg-[rgba(245,241,234,0.1)] p-4 text-sm leading-6 text-[rgba(245,241,234,0.78)]">
          Esta vista está diseñada para que cada colaborador revise sus metas, tareas y notificaciones desde el celular.
        </p>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.1)] text-ember"><MessageSquare className="size-5" /></span>
          <div>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Companion™</p>
            <p className="mt-2 text-lg font-semibold text-ink">{message || "Hoy tu foco no es hacer más cosas. Es cerrar el punto de fuga asignado y registrar avance visible."}</p>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Metas del día</p>
        {goals.map((goal) => (
          <Card key={goal.id}>
            <div className="flex items-start gap-3">
              <Target className="mt-1 size-5 shrink-0 text-copper" />
              <div className="flex-1">
                <h2 className="font-semibold text-ink">{goal.title}</h2>
                <p className="mt-2 text-sm leading-6 text-fog">{goal.description}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
                  <div className="h-full bg-copper" style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{goal.progress}% · {goal.status}</p>
                <Button className="mt-4 w-full justify-center" variant="secondary" onClick={() => markProgress(goal)}>
                  <CheckCircle2 className="size-4" /> Marcar avance
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Tareas asignadas</p>
        {tasks.map((task) => (
          <Card key={task.id}>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 size-5 shrink-0 text-copper" />
              <div className="flex-1">
                <h2 className="font-semibold text-ink">{task.title}</h2>
                <p className="mt-2 text-sm leading-6 text-fog">{task.description}</p>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">{task.area} · {task.status} · KPI {task.kpi}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => reportBlock(task)}><ShieldAlert className="size-4" /> Reportar bloqueo</Button>
                  <Button variant="ghost" onClick={() => askClarity(task)}><CircleHelp className="size-4" /> Pedir claridad</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {workerNotice ? <p className="rounded-md bg-bone-2 p-3 text-center text-sm text-fog">{workerNotice}</p> : null}

      <section className="space-y-3">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Mis conversaciones de hoy</p>
        {conversations.map((conversation) => (
          <Card key={conversation.id}>
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-1 size-5 shrink-0 text-copper" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-ink">{conversation.customer}</h2>
                  <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-copper">{conversation.channel}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-fog">{conversation.nextAction || "Agregar próxima acción antes de cerrar el día."}</p>
                <p className="mt-2 rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">{conversation.suggestedScript}</p>
                <div className="mt-4 grid gap-2">
                  <Button variant="secondary" onClick={() => updateConversation(conversation, { unreadMessages: 0, status: "En conversación" }, "Conversación marcada como respondida.")}>Responder</Button>
                  <Button variant="ghost" onClick={() => updateConversation(conversation, { nextAction: "Retomar cliente y registrar siguiente paso antes de las 17:00.", status: "Seguimiento pendiente" }, "Próxima acción agregada.")}>Agregar próxima acción</Button>
                  <Button variant="ghost" onClick={() => updateConversation(conversation, { hasUnlinkedFiles: false, status: "En conversación" }, "Documento marcado como recibido.")}>Marcar documento recibido</Button>
                  <Button variant="ghost" onClick={() => updateConversation(conversation, { status: "Requiere atención" }, "Bloqueo de conversación reportado.")}>Reportar bloqueo</Button>
                  <Button variant="ghost" onClick={() => setWorkerNotice("Script sugerido listo para usar en la conversación.")}>Usar script sugerido</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-1 size-5 shrink-0 text-copper" />
          <div className="flex-1">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Microlección recomendada</p>
            <h2 className="mt-2 text-lg font-semibold">Seguimiento sin parecer insistente</h2>
            <p className="mt-2 text-sm leading-6 text-fog">Objetivo: registrar próxima acción, retomar con contexto y mantener humanidad en cada mensaje.</p>
            <Button className="mt-4 w-full justify-center" onClick={completeLesson}>
              <CheckCircle2 className="size-4" /> {lessonDone ? "Microlección completada" : "Completar microlección"}
            </Button>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Notificaciones</p>
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 size-5 shrink-0 text-ember" />
              <div>
                <h2 className="font-semibold text-ink">{notification.title}</h2>
                <p className="mt-2 text-sm leading-6 text-fog">{notification.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
