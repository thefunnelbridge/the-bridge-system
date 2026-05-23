"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Clock,
  GraduationCap,
  MessageSquare,
  Save,
  ShieldAlert,
  Smartphone,
  Target,
  UserRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import { getIndustryInduction } from "@/lib/industry-induction";
import type { WorkerPersona } from "@/lib/industry-induction";
import type { BridgeInboxConversation } from "@/lib/inbox";
import { getLiveGoals, updateGoalProgress, type LiveGoal } from "@/lib/live-goals";
import { generateNotifications, type BridgeNotification } from "@/lib/notification-engine";
import { calculateAdvancedScores } from "@/lib/scoring";
import {
  getCompanyProfile,
  getDataRoom,
  getInboxConversations,
  getScanResponses,
  getTrackerTasks,
  saveInboxConversations,
  saveTrackerTasks,
} from "@/lib/storage";
import type { CompanyProfile, TrackerTask } from "@/lib/types";

const workerStateKey = "bridge-system.worker.today";
const roleKey = "bridge-system.worker.role";

type WorkerTodayState = {
  checkIn: Record<string, string>;
  inductionDone: string[];
  lessonDone: boolean;
};

function defaultState(): WorkerTodayState {
  return { checkIn: {}, inductionDone: [], lessonDone: false };
}

function readWorkerState(): WorkerTodayState {
  if (typeof window === "undefined") return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(window.localStorage.getItem(workerStateKey) ?? "{}") };
  } catch {
    return defaultState();
  }
}

function saveWorkerState(state: WorkerTodayState) {
  window.localStorage.setItem(workerStateKey, JSON.stringify(state));
}

export default function WorkerTodayPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [personaId, setPersonaId] = useState("");
  const [goals, setGoals] = useState<LiveGoal[]>([]);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);
  const [notifications, setNotifications] = useState<BridgeNotification[]>([]);
  const [conversations, setConversations] = useState<BridgeInboxConversation[]>([]);
  const [message, setMessage] = useState("");
  const [workerNotice, setWorkerNotice] = useState("");
  const [state, setState] = useState<WorkerTodayState>(defaultState());

  useEffect(() => {
    const nextCompany = getCompanyProfile();
    const dataRoom = getDataRoom();
    const nextTasks = getTrackerTasks();
    const scores = calculateAdvancedScores(getScanResponses());
    const nextGoals = getLiveGoals(nextCompany, scores, nextTasks, dataRoom);
    const companion = getBridgeCompanion(nextCompany, scores, dataRoom, nextTasks);
    const storedState = readWorkerState();
    const induction = getIndustryInduction(nextCompany);
    const storedPersona = window.localStorage.getItem(roleKey) ?? induction.workerPersonas[0]?.id ?? "";

    setCompany(nextCompany);
    setPersonaId(storedPersona);
    setGoals(nextGoals.filter((goal) => goal.cadence === "Diaria").slice(0, 3));
    setTasks(nextTasks.filter((task) => task.status !== "Implementado").slice(0, 4));
    setNotifications(generateNotifications({ company: nextCompany, scores, dataRoom, tasks: nextTasks, goals: nextGoals }).slice(0, 4));
    setConversations(getInboxConversations().filter((item) => item.status !== "Cerrado").slice(0, 4));
    setMessage(companion.workerGuidance);
    setState(storedState);
  }, []);

  const induction = useMemo(() => (company ? getIndustryInduction(company) : null), [company]);
  const persona = useMemo<WorkerPersona | null>(() => {
    if (!induction) return null;
    return induction.workerPersonas.find((item) => item.id === personaId) ?? induction.workerPersonas[0] ?? null;
  }, [induction, personaId]);

  if (!company || !induction || !persona) return null;

  function persistState(next: WorkerTodayState) {
    setState(next);
    saveWorkerState(next);
  }

  function selectPersona(id: string) {
    setPersonaId(id);
    window.localStorage.setItem(roleKey, id);
    setWorkerNotice("Vista personalizada para el rol seleccionado.");
  }

  function updateCheckIn(field: string, value: string) {
    persistState({ ...state, checkIn: { ...state.checkIn, [field]: value } });
  }

  function saveCheckIn() {
    setWorkerNotice("Check-in guardado. El líder verá más claro qué pasó hoy.");
  }

  function markProgress(goal: LiveGoal) {
    const nextGoals = updateGoalProgress(goals, goal.id, Math.min(100, goal.progress + 20));
    setGoals(nextGoals);
    window.localStorage.setItem("bridge-system.worker.goals", JSON.stringify(nextGoals));
    setWorkerNotice("Avance registrado en la meta diaria.");
  }

  function reportBlock(task: TrackerTask) {
    const allTasks = getTrackerTasks();
    const updated = allTasks.map((item) => (item.id === task.id ? { ...item, status: "Bloqueado" as const } : item));
    saveTrackerTasks(updated);
    setTasks(updated.filter((item) => item.status !== "Implementado").slice(0, 4));
    setWorkerNotice("Bloqueo reportado en el tracker.");
  }

  function completeLesson() {
    persistState({ ...state, lessonDone: true });
    setWorkerNotice("Microlección completada. Esto alimenta Bridge Culture™.");
  }

  function askClarity(task: TrackerTask) {
    const request = {
      taskId: task.id,
      taskTitle: task.title,
      requestedAt: new Date().toISOString(),
      worker: persona.name,
      role: persona.role,
    };
    window.localStorage.setItem("bridge-system.worker.clarityRequest", JSON.stringify(request));
    setWorkerNotice("Solicitud de claridad registrada.");
  }

  function updateConversation(conversation: BridgeInboxConversation, patch: Partial<BridgeInboxConversation>, text: string) {
    const all = getInboxConversations();
    const updated = all.map((item) => (item.id === conversation.id ? { ...item, ...patch } : item));
    saveInboxConversations(updated);
    setConversations(updated.filter((item) => item.status !== "Cerrado").slice(0, 4));
    setWorkerNotice(text);
  }

  function toggleInduction(item: string) {
    const inductionDone = state.inductionDone.includes(item)
      ? state.inductionDone.filter((done) => done !== item)
      : [...state.inductionDone, item];
    persistState({ ...state, inductionDone });
  }

  const progress = Math.round((state.inductionDone.length / induction.dailyRitual.length) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-10">
      <Card className="bridge-dark-wave overflow-hidden p-0 text-bone">
        <div className="relative p-5 sm:p-7">
          <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-copper">Hoy en The Bridge System™</p>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-none lg:text-7xl">Hola, {persona.name}</h1>
              <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.72)]">{persona.role} · {persona.area} · {company.name}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.78)]">{induction.simpleExplanation}</p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[rgba(245,241,234,0.1)] text-copper">
              <Smartphone className="size-6" />
            </span>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            <MiniStat label="Misión del día" value={induction.firstDayGoal} />
            <MiniStat label="Tu rol" value={persona.mission} />
            <MiniStat label="Progreso inducción" value={`${progress}%`} />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <Card>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Personalizar experiencia</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Elige tu rol</h2>
            <div className="mt-4 grid gap-2">
              {induction.workerPersonas.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectPersona(item.id)}
                  className={`rounded-lg border p-4 text-left transition ${
                    item.id === persona.id ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone hover:border-copper"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <UserRound className={`mt-1 size-4 ${item.id === persona.id ? "text-ember" : "text-copper"}`} />
                    <div>
                      <p className="font-semibold">{item.role}</p>
                      <p className={`mt-1 text-sm leading-5 ${item.id === persona.id ? "text-[rgba(245,241,234,0.7)]" : "text-fog"}`}>{item.area}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-bone-2">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Inducción por industria</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{induction.title}</h2>
            <div className="mt-4 space-y-2">
              {induction.dailyRitual.map((item) => {
                const done = state.inductionDone.includes(item);
                return (
                  <button key={item} onClick={() => toggleInduction(item)} className="flex w-full items-start gap-3 rounded-md border border-[color:var(--line)] bg-bone p-3 text-left">
                    <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${done ? "text-ember" : "text-fog"}`} />
                    <span className="text-sm leading-6 text-fog">{item}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Ejemplo para entenderlo rápido</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
              <p><strong className="text-ink">Conversación:</strong> {induction.examples.conversation}</p>
              <p><strong className="text-ink">Tarea:</strong> {induction.examples.task}</p>
              <p><strong className="text-ink">Métrica:</strong> {induction.examples.metric}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-copper/40">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.1)] text-ember"><MessageSquare className="size-5" /></span>
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Companion™</p>
                <p className="mt-2 text-xl font-semibold leading-8 text-ink">{induction.companionTone || message}</p>
                <p className="mt-2 text-sm leading-6 text-fog">{message}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Check-in del turno</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Qué debes ingresar hoy</h2>
                <p className="mt-2 text-sm leading-6 text-fog">No es control. Es contexto para que dirección, Pulse y Flow sepan dónde ayudar.</p>
              </div>
              <Button onClick={saveCheckIn}><Save className="size-4" /> Guardar check-in</Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {persona.dailyInputs.map((field) => (
                <label key={field} className="grid gap-2">
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{field}</span>
                  <input
                    className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper"
                    placeholder="Escribe número, estado o comentario breve"
                    value={state.checkIn[field] ?? ""}
                    onChange={(event) => updateCheckIn(field, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </Card>

          {workerNotice ? <p className="rounded-md border border-copper/30 bg-bone-2 p-3 text-center text-sm text-fog">{workerNotice}</p> : null}

          <section className="grid gap-4 xl:grid-cols-2">
            <WorkerSection title="Metas del día" icon={Target}>
              {goals.map((goal) => (
                <ActionCard key={goal.id} title={goal.title} detail={goal.description} meta={`${goal.progress}% · ${goal.status}`}>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
                    <div className="h-full bg-copper transition-all" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <Button className="mt-4 w-full justify-center" variant="secondary" onClick={() => markProgress(goal)}>
                    <CheckCircle2 className="size-4" /> Marcar avance
                  </Button>
                </ActionCard>
              ))}
            </WorkerSection>

            <WorkerSection title="Tareas asignadas" icon={ClipboardList}>
              {tasks.slice(0, 3).map((task) => (
                <ActionCard key={task.id} title={task.title} detail={task.description} meta={`${task.area} · ${task.status} · KPI ${task.kpi}`}>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="secondary" onClick={() => reportBlock(task)}><ShieldAlert className="size-4" /> Bloqueo</Button>
                    <Button variant="ghost" onClick={() => askClarity(task)}><CircleHelp className="size-4" /> Claridad</Button>
                  </div>
                </ActionCard>
              ))}
            </WorkerSection>
          </section>

          <WorkerSection title="Mis conversaciones de hoy" icon={MessageSquare}>
            <div className="grid gap-3 lg:grid-cols-2">
              {conversations.map((conversation) => (
                <ActionCard
                  key={conversation.id}
                  title={conversation.customer}
                  detail={conversation.nextAction || "Agregar próxima acción antes de cerrar el día."}
                  meta={`${conversation.channel} · ${conversation.priority}`}
                >
                  <p className="mt-3 rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">{conversation.suggestedScript}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Button variant="secondary" onClick={() => updateConversation(conversation, { unreadMessages: 0, status: "En conversación" }, "Conversación marcada como respondida.")}>Responder</Button>
                    <Button variant="ghost" onClick={() => updateConversation(conversation, { nextAction: "Retomar cliente y registrar siguiente paso antes de las 17:00.", status: "Seguimiento pendiente" }, "Próxima acción agregada.")}>Próxima acción</Button>
                    <Button variant="ghost" onClick={() => updateConversation(conversation, { hasUnlinkedFiles: false, status: "En conversación" }, "Documento marcado como recibido.")}>Documento recibido</Button>
                    <Button variant="ghost" onClick={() => updateConversation(conversation, { status: "Requiere atención" }, "Bloqueo de conversación reportado.")}>Reportar bloqueo</Button>
                  </div>
                </ActionCard>
              ))}
            </div>
          </WorkerSection>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-1 size-5 shrink-0 text-copper" />
                <div className="flex-1">
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Microlección recomendada</p>
                  <h2 className="mt-2 text-lg font-semibold">{induction.managerChecklist[0] ?? "Seguimiento con claridad"}</h2>
                  <p className="mt-2 text-sm leading-6 text-fog">Objetivo: instalar un hábito simple para cerrar la fuga principal de tu industria.</p>
                  <Button className="mt-4 w-full justify-center" onClick={completeLesson}>
                    <CheckCircle2 className="size-4" /> {state.lessonDone ? "Microlección completada" : "Completar microlección"}
                  </Button>
                </div>
              </div>
            </Card>

            <WorkerSection title="Notificaciones" icon={AlertCircle}>
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="rounded-md border border-[color:var(--line)] bg-bone p-3">
                  <h2 className="font-semibold text-ink">{notification.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-fog">{notification.description}</p>
                </div>
              ))}
            </WorkerSection>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.08)] p-4">
      <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(245,241,234,0.78)]">{value}</p>
    </div>
  );
}

function WorkerSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="flex items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">
        <Icon className="size-4" /> {title}
      </p>
      {children}
    </section>
  );
}

function ActionCard({ title, detail, meta, children }: { title: string; detail: string; meta: string; children?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Clock className="mt-1 size-5 shrink-0 text-copper" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-fog">{detail}</p>
          <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-fog">{meta}</p>
          {children}
        </div>
      </div>
    </Card>
  );
}
