import type { AdvancedScores, CompanyProfile, TrackerTask } from "./types";

export type InternalMessage = {
  audience: string;
  title: string;
  message: string;
  tone: "Dirección" | "Liderazgo" | "Equipo" | "Operativo";
};

export function generateInternalComms(company: CompanyProfile, scores: AdvancedScores, tasks: TrackerTask[]): InternalMessage[] {
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const openTask = tasks.find((task) => task.status !== "Implementado");
  const focus = openTask?.title ?? (brokerage ? "revisar oportunidades dormidas por corredor" : "registrar próxima acción en oportunidades abiertas");
  const pressure = scores.implementationUrgency > 65 ? "alta" : "moderada";

  return [
    {
      audience: "Dirección",
      title: "Mensaje para dirección",
      tone: "Dirección",
      message: `La presión operativa es ${pressure}. Esta semana conviene proteger foco: una fuga prioritaria, un responsable visible y una métrica de avance antes de abrir nuevas iniciativas.`,
    },
    {
      audience: "Líderes",
      title: "Mensaje para líderes",
      tone: "Liderazgo",
      message: `Hoy no buscamos hacer más por hacer más. Buscamos cerrar una fuga concreta: ${focus}. Cada bloqueo debe terminar en decisión, regla o aprendizaje.`,
    },
    {
      audience: brokerage ? "Corredores" : "Equipo comercial",
      title: brokerage ? "Mensaje para corredores" : "Mensaje para ventas",
      tone: "Equipo",
      message: brokerage
        ? "Cada comprador sin próxima acción se convierte en oportunidad dormida. Revisen seguimiento, visitas y propietarios pendientes antes del cierre del día."
        : "Cada oportunidad que queda sin próxima acción empieza a enfriarse. Registrar el siguiente paso protege tu trabajo y mejora la experiencia del cliente.",
    },
    {
      audience: "Atención",
      title: "Mensaje para atención",
      tone: "Operativo",
      message: "Un sistema no reemplaza tu criterio. Lo protege: usa mensajes base, conserva humanidad y deja visible qué necesita el cliente después de cada contacto.",
    },
    {
      audience: "Equipo operativo",
      title: "Mensaje positivo de avance",
      tone: "Equipo",
      message: "La mejora continua no ocurre en reuniones largas. Ocurre en pequeñas acciones repetidas con claridad, dueño y seguimiento.",
    },
  ];
}

export function getWeeklyCommsSummary(company: CompanyProfile, scores: AdvancedScores) {
  return `${company.name} debe enfocar la semana en claridad operacional, seguimiento visible y aprendizaje por fuga. Bridge Score™ ${scores.overallScore}, AI Readiness ${scores.aiReadinessIndex}% y dependencia humana ${scores.humanDependencyIndex}%.`;
}
