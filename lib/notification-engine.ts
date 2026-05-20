import type { AdvancedScores, CompanyProfile, DataRoom, TrackerTask } from "./types";
import type { LiveGoal } from "./live-goals";

export type BridgeNotification = {
  id: string;
  title: string;
  description: string;
  type: "alert" | "task" | "goal" | "learning" | "culture" | "data" | "integration" | "report";
  priority: "critical" | "high" | "medium" | "low";
  area: string;
  recipientRole: string;
  createdAt: string;
  status: "unread" | "read" | "resolved";
  ctaLabel: string;
  ctaRoute: string;
};

type NotificationContext = {
  company: CompanyProfile;
  scores: AdvancedScores;
  dataRoom: DataRoom;
  tasks: TrackerTask[];
  goals: LiveGoal[];
};

function timeAgo(minutesAgo: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
}

function numberFrom(value: unknown, fallback: number) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function generateNotifications({ company, scores, dataRoom, tasks, goals }: NotificationContext): BridgeNotification[] {
  const blockedTasks = tasks.filter((task) => task.status === "Bloqueado");
  const openTasks = tasks.filter((task) => task.status !== "Implementado");
  const riskyGoals = goals.filter((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada");
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const unfollowed = numberFrom(dataRoom.leads.porcentajeSinSeguimiento ?? company.metrics.unfollowedPercentage, 30);
  const notifications: BridgeNotification[] = [
    {
      id: "lead-no-next-action",
      title: brokerage ? "Compradores sin próxima acción" : "Lead sin próxima acción hace 72 horas",
      description: brokerage
        ? "El sistema detecta oportunidades de compradores abiertas sin fecha de seguimiento por corredor."
        : "Hay oportunidades activas sin responsable visible ni siguiente paso registrado.",
      type: "alert",
      priority: "critical",
      area: "Ventas",
      recipientRole: brokerage ? "líder de oficina" : "gerencia comercial",
      createdAt: timeAgo(18),
      status: "unread",
      ctaLabel: "Revisar Pulse",
      ctaRoute: "/app/pulse",
    },
    {
      id: "goal-risk",
      title: riskyGoals[0]?.title ?? "Meta diaria de seguimiento en riesgo",
      description: riskyGoals[0]?.companionRecommendation ?? "La meta principal del día avanza más lento que el ritmo recomendado.",
      type: "goal",
      priority: "high",
      area: riskyGoals[0]?.area ?? "Operaciones",
      recipientRole: riskyGoals[0]?.owner ?? "líder operativo",
      createdAt: timeAgo(46),
      status: "unread",
      ctaLabel: "Ver metas",
      ctaRoute: "/app/pulse",
    },
    {
      id: "blocked-task",
      title: blockedTasks.length ? "Trabajador reportó bloqueo" : "Tarea crítica sin responsable claro",
      description: blockedTasks[0]?.description ?? "Una tarea de implementación requiere dueño, decisión o claridad antes de avanzar.",
      type: "task",
      priority: blockedTasks.length ? "high" : "medium",
      area: blockedTasks[0]?.area ?? "Equipo y cultura",
      recipientRole: blockedTasks[0]?.owner ?? "dirección",
      createdAt: timeAgo(78),
      status: "read",
      ctaLabel: "Abrir tracker",
      ctaRoute: "/app/tracker",
    },
    {
      id: "academy-pending",
      title: "Microlección recomendada para el equipo",
      description: "Bridge Academy™ sugiere entrenar seguimiento, claridad de mensajes y registro de próxima acción.",
      type: "learning",
      priority: "medium",
      area: "Bridge Academy™",
      recipientRole: "líder de equipo",
      createdAt: timeAgo(114),
      status: "unread",
      ctaLabel: "Ver Academy",
      ctaRoute: "/app/academy",
    },
    {
      id: "data-room-warning",
      title: "Data Room requiere actualización",
      description: unfollowed > 25
        ? "El porcentaje de oportunidades sin seguimiento sugiere una fuga comercial activa."
        : "Actualizar datos mejora la precisión del diagnóstico y las recomendaciones.",
      type: "data",
      priority: unfollowed > 35 ? "high" : "medium",
      area: "Data Room",
      recipientRole: "administración",
      createdAt: timeAgo(168),
      status: "read",
      ctaLabel: "Actualizar datos",
      ctaRoute: "/app/data-room",
    },
    {
      id: "bridge-inbox-warning",
      title: "Conversaciones requieren orden operativo",
      description: "Bridge Inbox™ recomienda revisar chats abiertos, archivos dispersos y conversaciones sin próxima acción.",
      type: "alert",
      priority: "high",
      area: "Bridge Inbox™",
      recipientRole: "ventas / atención",
      createdAt: timeAgo(194),
      status: "unread",
      ctaLabel: "Abrir Inbox",
      ctaRoute: "/app/inbox",
    },
    {
      id: "ai-readiness-warning",
      title: "Automatización requiere proceso base",
      description: scores.aiReadinessIndex < 65
        ? "Antes de conectar IA real, conviene ordenar datos, responsables y revisión humana."
        : "La empresa ya tiene señales suficientes para diseñar pilotos de automatización inteligente.",
      type: "integration",
      priority: scores.aiReadinessIndex < 65 ? "high" : "low",
      area: "Tecnología y datos",
      recipientRole: "dirección / tecnología",
      createdAt: timeAgo(220),
      status: "unread",
      ctaLabel: "Ver Integrations",
      ctaRoute: "/app/integrations",
    },
  ];

  if (openTasks.length > 4) {
    notifications.push({
      id: "many-open-tasks",
      title: "Hay varias acciones abiertas sin cierre",
      description: "Bridge Flow™ recomienda reducir el trabajo en curso y cerrar primero las fugas de mayor impacto.",
      type: "culture",
      priority: "medium",
      area: "Mejora continua",
      recipientRole: "dirección",
      createdAt: timeAgo(248),
      status: "unread",
      ctaLabel: "Ver tracker",
      ctaRoute: "/app/tracker",
    });
  }

  return notifications;
}

export function markNotificationRead(notifications: BridgeNotification[], id: string) {
  return notifications.map((item) => (item.id === id ? { ...item, status: "read" as const } : item));
}

export function resolveNotification(notifications: BridgeNotification[], id: string) {
  return notifications.map((item) => (item.id === id ? { ...item, status: "resolved" as const } : item));
}

export function getCriticalNotifications(notifications: BridgeNotification[]) {
  return notifications.filter((item) => item.priority === "critical" || item.priority === "high");
}

export function getNotificationsByRole(notifications: BridgeNotification[], role: string) {
  const normalized = role.toLowerCase();
  return notifications.filter((item) => item.recipientRole.toLowerCase().includes(normalized) || item.recipientRole === "dirección");
}

export function getDailyDigest(company: CompanyProfile, tasks: TrackerTask[], goals: LiveGoal[], scores: AdvancedScores) {
  const blocked = tasks.filter((task) => task.status === "Bloqueado").length;
  const risky = goals.filter((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada").length;
  return `${company.name}: ${risky} metas requieren atención, ${blocked} bloqueos visibles y un Bridge Score™ de ${scores.overallScore}. El foco recomendado es cerrar oportunidades sin próxima acción antes de las 17:00.`;
}
