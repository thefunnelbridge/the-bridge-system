import type { CompanyProfile, TrackerTask } from "./types";
import type { LiveGoal } from "./live-goals";

export type ActivityEvent = {
  id: string;
  time: string;
  event: string;
  area: string;
  priority: "Alta" | "Media" | "Baja";
  suggestedAction: string;
  responsible: string;
  status: "Nuevo" | "En revisión" | "En progreso" | "Resuelto";
};

function at(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function generateActivityFeed(company: CompanyProfile, industry: string, tasks: TrackerTask[], goals: LiveGoal[]): ActivityEvent[] {
  const brokerage = industry === "Corredores de propiedades / Brokerage inmobiliario";
  const clinic = industry === "Clínica / salud / estética / dental";
  const blocked = tasks.find((task) => task.status === "Bloqueado");
  const riskyGoal = goals.find((goal) => goal.status === "En riesgo" || goal.status === "Bloqueada");

  const feed: ActivityEvent[] = [
    {
      id: "activity-0915",
      time: at(9, 15),
      event: brokerage ? "Lead comprador caliente sin clasificación" : "Lead caliente sin respuesta",
      area: "Ventas",
      priority: "Alta",
      suggestedAction: brokerage ? "Asignar corredor y clasificar presupuesto, comuna y urgencia." : "Asignar responsable y registrar próxima acción.",
      responsible: brokerage ? "líder de oficina" : "ventas",
      status: "Nuevo",
    },
    {
      id: "activity-1030",
      time: at(10, 30),
      event: clinic ? "3 consultas sin confirmar agenda" : "3 consultas sin clasificar",
      area: "Atención",
      priority: "Media",
      suggestedAction: "Usar protocolo de primera respuesta y separar intención del cliente.",
      responsible: clinic ? "recepción" : "atención",
      status: "En progreso",
    },
    {
      id: "activity-1145",
      time: at(11, 45),
      event: blocked ? `${blocked.title} aparece bloqueada` : "Tarea crítica requiere claridad",
      area: blocked?.area ?? "Operaciones",
      priority: "Alta",
      suggestedAction: "Pedir decisión al líder y convertir el bloqueo en microacción.",
      responsible: blocked?.owner ?? "líder operativo",
      status: blocked ? "En revisión" : "Nuevo",
    },
    {
      id: "activity-1235",
      time: at(12, 35),
      event: brokerage ? "Sistema detectó propiedades sin movimiento" : "Proceso repetido sin documentación",
      area: "Operaciones",
      priority: "Media",
      suggestedAction: brokerage ? "Revisar propiedades con 14 días sin avance." : "Documentar paso mínimo y responsable.",
      responsible: brokerage ? "coordinación comercial" : "operaciones",
      status: "Nuevo",
    },
    {
      id: "activity-1400",
      time: at(14, 0),
      event: "Microlección pendiente",
      area: "Bridge Academy™",
      priority: "Media",
      suggestedAction: "Completar antes de las 17:00 y aplicar checklist en el flujo real.",
      responsible: "equipo asignado",
      status: "En progreso",
    },
    {
      id: "activity-1530",
      time: at(15, 30),
      event: riskyGoal ? `Meta en riesgo: ${riskyGoal.title}` : "Bridge Companion™ recomendó acción de cierre",
      area: riskyGoal?.area ?? "Mejora continua",
      priority: riskyGoal?.priority ?? "Media",
      suggestedAction: riskyGoal?.companionRecommendation ?? "Revisar protocolo de respuesta y próximas acciones.",
      responsible: riskyGoal?.owner ?? "dirección",
      status: "En revisión",
    },
  ];

  if (brokerage) {
    feed.push({
      id: "activity-1610",
      time: at(16, 10),
      event: "Visitas sin seguimiento posterior detectadas",
      area: "Brokerage Lens™",
      priority: "Alta",
      suggestedAction: "Activar script post visita y registrar probabilidad de oferta.",
      responsible: "corredor asignado",
      status: "Nuevo",
    });
  }

  return feed;
}

export function getRecentActivity(feed: ActivityEvent[], limit = 5) {
  return [...feed].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, limit);
}

export function addActivityEvent(feed: ActivityEvent[], event: ActivityEvent) {
  return [event, ...feed];
}

export function filterActivityByArea(feed: ActivityEvent[], area: string) {
  if (area === "Todas") return feed;
  return feed.filter((item) => item.area === area);
}
