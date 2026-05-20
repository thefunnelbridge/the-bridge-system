import type { AdvancedScores, CompanyProfile, DataRoom, TrackerTask } from "./types";

export type LiveGoal = {
  id: string;
  title: string;
  description: string;
  cadence: "Diaria" | "Semanal" | "Mensual";
  scope: "Trabajador" | "Equipo" | "Empresa" | "Oficina" | "Corredor" | "Area";
  area: string;
  owner: string;
  progress: number;
  dueDate: string;
  priority: "Alta" | "Media" | "Baja";
  status: "En curso" | "En riesgo" | "Cumplida" | "Bloqueada";
  metric: string;
  companionRecommendation: string;
};

function due(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("es-CL");
}

function numberFrom(value: unknown, fallback: number) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function getGoalRiskStatus(progress: number, priority: string): LiveGoal["status"] {
  if (progress >= 100) return "Cumplida";
  if (priority === "Alta" && progress < 45) return "En riesgo";
  return "En curso";
}

export function generateDailyGoals(company: CompanyProfile, scores: AdvancedScores, dataRoom?: DataRoom): LiveGoal[] {
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const clinic = company.industry === "Clínica / salud / estética / dental";
  const automotive = company.industry === "Automotora";
  const responseHours = numberFrom(dataRoom?.leads.tiempoPromedioRespuesta ?? company.metrics.responseTime, 4);
  const responseProgress = Math.max(10, 100 - responseHours * 9);
  return [
    {
      id: "daily-response",
      title: brokerage
        ? "Revisar compradores sin próxima acción"
        : clinic
          ? "Clasificar consultas nuevas antes de las 17:00"
          : automotive
            ? "Asignar leads nuevos en menos de 10 minutos"
            : "Responder 100% de leads nuevos antes de 15 minutos",
      description: brokerage
        ? "Cada corredor debe revisar sus leads abiertos, registrar próxima acción y activar retoma cuando corresponda."
        : clinic
          ? "Recepción debe separar paciente nuevo, confirmación, postconsulta y seguimiento pendiente."
          : automotive
            ? "Ventas debe separar intención: cotización, financiamiento, permuta, flota o test drive."
            : "El equipo debe proteger la ventana de primera respuesta y registrar el siguiente paso comercial.",
      cadence: "Diaria",
      scope: brokerage ? "Corredor" : "Equipo",
      area: "Ventas",
      owner: brokerage ? "líder de oficina" : "ventas / atención",
      progress: responseProgress,
      dueDate: due(0),
      priority: "Alta",
      status: getGoalRiskStatus(responseProgress, "Alta"),
      metric: brokerage ? "oportunidades dormidas por corredor" : "tiempo de primera respuesta",
      companionRecommendation: brokerage
        ? "Cada lead sin fecha de seguimiento se convierte en oportunidad dormida. Revisa compradores antes de las 12:00."
        : "Tu tarea de hoy no es hacer más cosas: es cerrar la fuga de respuesta y registrar próxima acción.",
    },
    {
      id: "daily-next-action",
      title: "Registrar próxima acción en oportunidades abiertas",
      description: "Toda oportunidad viva debe tener responsable, fecha y próxima acción visible para que el seguimiento no dependa de memoria personal.",
      cadence: "Diaria",
      scope: "Equipo",
      area: "Operaciones",
      owner: "responsable de área",
      progress: Math.max(20, 100 - scores.operationalLeakIndex),
      dueDate: due(0),
      priority: "Alta",
      status: getGoalRiskStatus(Math.max(20, 100 - scores.operationalLeakIndex), "Alta"),
      metric: "oportunidades con próxima acción",
      companionRecommendation: "Cada oportunidad sin próximo paso obliga al equipo a depender de memoria humana.",
    },
    {
      id: "daily-critical-task",
      title: "Revisar tareas bloqueadas antes de las 17:00",
      description: "Los bloqueos se convierten en aprendizaje cuando se hacen visibles, tienen dueño y se traducen en una decisión concreta.",
      cadence: "Diaria",
      scope: "Area",
      area: "Equipo y cultura",
      owner: "líder operativo",
      progress: Math.max(12, 100 - scores.teamTrainingNeed),
      dueDate: due(0),
      priority: "Alta",
      status: getGoalRiskStatus(Math.max(12, 100 - scores.teamTrainingNeed), "Alta"),
      metric: "bloqueos resueltos",
      companionRecommendation: "La mejora continua no busca culpar a nadie; busca convertir fricción repetida en proceso visible.",
    },
  ];
}

export function generateWeeklyGoals(company: CompanyProfile, scores: AdvancedScores, tasks: TrackerTask[]): LiveGoal[] {
  const openCritical = tasks.filter((task) => task.status !== "Implementado").length;
  return [
    {
      id: "weekly-lessons",
      title: "Completar 5 microlecciones esta semana",
      description: "El equipo debe entrenar sobre las fugas detectadas para que el cambio no quede solo en dirección.",
      cadence: "Semanal",
      scope: "Equipo",
      area: "Bridge Academy™",
      owner: "líder de equipo",
      progress: Math.max(10, 100 - scores.teamTrainingNeed),
      dueDate: due(7),
      priority: "Media",
      status: getGoalRiskStatus(Math.max(10, 100 - scores.teamTrainingNeed), "Media"),
      metric: "microlecciones completadas",
      companionRecommendation: "La mejora no ocurre en reuniones largas; ocurre en pequeñas acciones repetidas con claridad.",
    },
    {
      id: "weekly-critical-tasks",
      title: "Cerrar 3 tareas críticas de Bridge Flow™",
      description: "Convertir recomendaciones en avance real con responsables, KPI asociado y evidencia de implementación.",
      cadence: "Semanal",
      scope: "Empresa",
      area: "Tracker",
      owner: "dirección / líder operativo",
      progress: Math.max(5, Math.min(100, 100 - openCritical * 12)),
      dueDate: due(7),
      priority: "Alta",
      status: getGoalRiskStatus(Math.max(5, Math.min(100, 100 - openCritical * 12)), "Alta"),
      metric: "tareas críticas cerradas",
      companionRecommendation: "Hoy no buscamos hacer más por hacer más. Buscamos cerrar una fuga concreta.",
    },
    {
      id: "weekly-standardize",
      title: company.industry === "Clínica / salud / estética / dental" ? "Reducir no-shows con recordatorio y confirmación" : "Estandarizar 3 mensajes de atención",
      description: "Alinear mensajes repetidos para que el cliente reciba claridad, cortesía, consistencia y eficiencia.",
      cadence: "Semanal",
      scope: "Area",
      area: "Atención",
      owner: "atención / coordinación",
      progress: Math.max(20, 100 - scores.communicationLeakIndex),
      dueDate: due(7),
      priority: "Media",
      status: getGoalRiskStatus(Math.max(20, 100 - scores.communicationLeakIndex), "Media"),
      metric: "consistencia de servicio",
      companionRecommendation: "Un sistema no reemplaza tu criterio. Lo protege.",
    },
  ];
}

export function getLiveGoals(company: CompanyProfile, scores: AdvancedScores, tasks: TrackerTask[], dataRoom?: DataRoom): LiveGoal[] {
  return [...generateDailyGoals(company, scores, dataRoom), ...generateWeeklyGoals(company, scores, tasks)];
}

export function updateGoalProgress(goals: LiveGoal[], goalId: string, progress: number): LiveGoal[] {
  return goals.map((goal) =>
    goal.id === goalId ? { ...goal, progress, status: getGoalRiskStatus(progress, goal.priority) } : goal,
  );
}

export function updateGoalStatus(goals: LiveGoal[], goalId: string, status: LiveGoal["status"]): LiveGoal[] {
  return goals.map((goal) => (goal.id === goalId ? { ...goal, status } : goal));
}

export function calculateGoalProgress(goal: LiveGoal, tasks: TrackerTask[], dataRoom?: DataRoom): number {
  if (goal.id === "weekly-critical-tasks") {
    const implemented = tasks.filter((task) => task.status === "Implementado").length;
    return Math.min(100, Math.max(goal.progress, implemented * 20));
  }
  if (goal.id === "daily-response" && dataRoom?.leads.tiempoPromedioRespuesta) {
    return Math.max(8, Math.min(100, 100 - numberFrom(dataRoom.leads.tiempoPromedioRespuesta, 4) * 9));
  }
  return goal.progress;
}

export function getTodayFocus(goals: LiveGoal[]) {
  const goal = goals.find((item) => item.cadence === "Diaria" && item.status !== "Cumplida") ?? goals[0];
  return {
    title: goal?.title ?? "Registrar próxima acción en oportunidades abiertas",
    description: goal?.companionRecommendation ?? "Si haces una sola cosa hoy, haz visible el siguiente paso de cada oportunidad activa.",
  };
}
