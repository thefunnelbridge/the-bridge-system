import { bridgeExcellenceLibrary, calculateBridgeExcellenceScore, getContinuousImprovementLoop, getServiceStandardScore } from "./excellence-library";
import { getIndustryRules } from "./industry-rules";
import { getLiveGoals } from "./live-goals";
import type { AdvancedScores, CompanyProfile, DataRoom, TrackerTask } from "./types";

export function getBridgeCompanion(company: CompanyProfile, scores: AdvancedScores, dataRoom: DataRoom, tasks: TrackerTask[]) {
  const rules = getIndustryRules(company.industry);
  const goals = getLiveGoals(company, scores, tasks);
  const excellence = calculateBridgeExcellenceScore(scores);
  const service = getServiceStandardScore(scores);
  const loop = getContinuousImprovementLoop(company, tasks);
  const topGoal = goals.find((goal) => goal.status === "En riesgo") ?? goals[0];
  const topPrinciple = bridgeExcellenceLibrary[0];

  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const clinic = company.industry === "Clínica / salud / estética / dental";
  const auto = company.industry === "Automotora";

  return {
    nextBestAction: topGoal.companionRecommendation,
    dailyFocus: brokerage
      ? "Revisa compradores sin próxima acción, visitas sin seguimiento y propiedades sin movimiento antes del cierre del día."
      : clinic
        ? "Clasifica consultas: paciente nuevo, confirmación, postconsulta o seguimiento pendiente."
        : auto
          ? "Separa leads de financiamiento, permuta y cotización antes de enviar respuesta."
          : "Responde oportunidades calientes y deja próxima acción registrada en cada caso crítico.",
    weeklySummary: `Bridge Excellence Score™ en ${excellence.overall}/100. La prioridad es ${topGoal.title.toLowerCase()} y el proceso a estandarizar es ${loop.processToStandardize}.`,
    internalMessage:
      "Hoy no buscamos hacer más por hacer más. Buscamos cerrar una fuga concreta, aprender de ella y dejar el siguiente paso visible para todos.",
    workerGuidance: brokerage
      ? "Revisa tus compradores sin próxima acción. Cada lead sin fecha de seguimiento se convierte en oportunidad dormida."
      : "Tu tarea de hoy no es hacer más cosas. Es cerrar el punto de fuga asignado y registrar avance.",
    managerGuidance:
      "Tu empresa no necesita más presión sobre el equipo. Necesita claridad sobre qué acción mueve el indicador esta semana.",
    culturalWarning: scores.humanDependencyIndex > 45
      ? "Hay dependencia alta de memoria humana. Conviene convertir decisiones repetidas en checklist, regla o tablero."
      : "La cultura muestra señales de sistema, pero necesita ritual semanal para sostener la mejora.",
    customerExperienceWarning: service.overall < 70
      ? "La experiencia de cliente tiene fricción. Revisa claridad, consistencia y eficiencia de los mensajes."
      : "El estándar de servicio es defendible, pero debe seguir midiendo consistencia por canal.",
    processStandardizationAdvice: topPrinciple.bridgeApplication[1],
    automationReadinessAdvice: scores.aiReadinessIndex < 70
      ? "Antes de automatizar, ordena datos, responsable, caso de uso y revisión humana."
      : "Hay base para automatizaciones asistidas si se mantienen límites y trazabilidad.",
    sourceContext: {
      dataRoomSignal: String(dataRoom.leads.porcentajeSinSeguimiento ?? ""),
      industryRisk: rules.riskSignals[0],
      excellencePrinciple: topPrinciple.name,
    },
  };
}
