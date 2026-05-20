import { areaIds, areaLabels, areaMicrocopy } from "./scan-questions";
import { getIndustryRules } from "./industry-rules";
import type { AdvancedScores, AreaId, AreaScore, CompanyProfile, DataRoom, Leak, MatrixItem, MaturityStatus, ScanResponses } from "./types";

const leakMap: Record<AreaId, Omit<Leak, "id" | "areaId" | "areaName" | "score">> = {
  sales: {
    title: "Seguimiento comercial inconsistente",
    description: "Las oportunidades entran, pero no existe un sistema visible para responder, priorizar, retomar y aprender.",
    impact: "Alto",
    urgency: "Inmediata",
    whyItMatters: "La demanda sin seguimiento se convierte en energía comercial perdida.",
    riskOfInaction: "Más oportunidades dormidas, baja conversión y decisiones comerciales reactivas.",
  },
  marketing: {
    title: "Mensaje comercial fragmentado",
    description: "La empresa comunica distinto según canal, campaña o persona, debilitando claridad y confianza.",
    impact: "Medio/Alto",
    urgency: "Alta",
    whyItMatters: "La consistencia del mensaje reduce fricción entre interés, conversación y decisión.",
    riskOfInaction: "Marketing seguirá generando atención que ventas no puede convertir con claridad.",
  },
  customer: {
    title: "Experiencia de respuesta irregular",
    description: "La atención depende del criterio individual y no de un protocolo medible.",
    impact: "Alto",
    urgency: "Alta",
    whyItMatters: "El cliente evalúa la calidad del sistema desde el primer contacto.",
    riskOfInaction: "Más consultas sin cierre, respuestas dispares y pérdida de confianza.",
  },
  operations: {
    title: "Procesos dependientes de memoria humana",
    description: "Las tareas críticas no están suficientemente documentadas, distribuidas ni visibles.",
    impact: "Alto",
    urgency: "Media/Alta",
    whyItMatters: "La memoria personal no escala y aumenta el costo operativo invisible.",
    riskOfInaction: "El crecimiento agregará más carga, reuniones y errores repetidos.",
  },
  technology: {
    title: "Datos dispersos y baja preparación para IA",
    description: "La empresa tiene herramientas, pero la información no está conectada ni preparada para automatización inteligente.",
    impact: "Alto",
    urgency: "Alta",
    whyItMatters: "La IA necesita datos confiables y procesos claros antes de automatizar.",
    riskOfInaction: "La tecnología seguirá funcionando como archivo, no como inteligencia aplicada.",
  },
  team: {
    title: "Equipo sin sistema de mejora continua",
    description: "El equipo opera con esfuerzo, pero sin entrenamiento, feedback o métricas suficientes.",
    impact: "Medio/Alto",
    urgency: "Media",
    whyItMatters: "La mejora continua convierte presión operativa en aprendizaje compartido.",
    riskOfInaction: "La calidad dependerá de personas puntuales y no de hábitos del equipo.",
  },
  leadership: {
    title: "Prioridades sin traducción operativa",
    description: "Las decisiones de dirección no siempre bajan a responsables, tareas y medición semanal.",
    impact: "Alto",
    urgency: "Alta",
    whyItMatters: "La estrategia solo existe cuando se transforma en decisiones con dueño.",
    riskOfInaction: "Las reuniones seguirán produciendo conversación, pero no implementación sostenida.",
  },
  experience: {
    title: "Fricción invisible en la experiencia cliente",
    description: "El cliente no siempre recibe claridad, continuidad y seguimiento entre etapas.",
    impact: "Alto",
    urgency: "Alta",
    whyItMatters: "La experiencia se rompe en los tramos donde nadie se siente dueño.",
    riskOfInaction: "Más abandono, más dudas repetidas y menor percepción de profesionalismo.",
  },
  aiReadiness: {
    title: "IA sin base operativa suficiente",
    description: "Hay intención de usar IA, pero faltan datos ordenados, casos de uso y revisión humana.",
    impact: "Medio/Alto",
    urgency: "Media/Alta",
    whyItMatters: "La IA aplicada debe amplificar criterio, no desorden.",
    riskOfInaction: "La adopción de IA quedará en pruebas aisladas sin impacto operativo.",
  },
  continuousImprovement: {
    title: "Aprendizajes que no se convierten en sistema",
    description: "Los problemas se detectan, pero no siempre se documentan, corrigen y entrenan.",
    impact: "Medio/Alto",
    urgency: "Media",
    whyItMatters: "La mejora continua reduce repetición de errores y dependencia del liderazgo.",
    riskOfInaction: "El equipo seguirá resolviendo síntomas sin corregir causas.",
  },
  inbox: {
    title: "Conversaciones sin sistema operativo",
    description: "WhatsApp, emails y chats funcionan como ventas, atención, archivo y agenda al mismo tiempo, pero sin responsable, estado ni próxima acción visible.",
    impact: "Alto",
    urgency: "Alta",
    whyItMatters: "Cada conversación sin estructura puede convertirse en oportunidad dormida, archivo perdido o respuesta inconsistente.",
    riskOfInaction: "Más clientes perdidos dentro del chat, documentos enterrados y seguimiento dependiente de memoria personal.",
  },
};

function avg(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function byId(scores: AreaScore[], id: AreaId) {
  return scores.find((score) => score.id === id)?.score ?? 0;
}

function riskFromScore(score: number) {
  return Math.max(0, 100 - score);
}

export function calculateAreaScores(responses: ScanResponses): AreaScore[] {
  return areaIds.map((id) => {
    const values = responses[id] ?? [];
    return {
      id,
      name: areaLabels[id],
      microcopy: areaMicrocopy[id],
      score: Math.round(avg(values) * 20),
    };
  });
}

export function calculateOverallScore(areaScores: AreaScore[]): number {
  const total = areaScores.reduce((sum, area) => sum + area.score, 0);
  return Math.round(total / Math.max(areaScores.length, 1));
}

export function getMaturityStatus(score: number): MaturityStatus {
  if (score <= 39) return "Fuga crítica";
  if (score <= 59) return "Alto riesgo";
  if (score <= 74) return "Sistema en desarrollo";
  if (score <= 89) return "Sistema escalable";
  return "Organización inteligente";
}

export function calculateAdvancedScores(responses: ScanResponses): AdvancedScores {
  const areaScores = calculateAreaScores(responses);
  const overallScore = calculateOverallScore(areaScores);
  const commercial = Math.round(avg([byId(areaScores, "sales"), byId(areaScores, "marketing"), byId(areaScores, "experience"), byId(areaScores, "inbox")]));
  const ops = Math.round(avg([byId(areaScores, "operations"), byId(areaScores, "technology"), byId(areaScores, "continuousImprovement")]));
  const people = Math.round(avg([byId(areaScores, "team"), byId(areaScores, "leadership")]));

  return {
    areaScores,
    overallScore,
    maturityLevel: getMaturityStatus(overallScore),
    commercialLeakIndex: riskFromScore(commercial),
    communicationLeakIndex: riskFromScore(Math.round(avg([byId(areaScores, "marketing"), byId(areaScores, "customer"), byId(areaScores, "inbox")]))),
    operationalLeakIndex: riskFromScore(ops),
    customerExperienceRisk: riskFromScore(Math.round(avg([byId(areaScores, "customer"), byId(areaScores, "experience"), byId(areaScores, "inbox")]))),
    aiReadinessIndex: byId(areaScores, "aiReadiness"),
    dataMaturityIndex: byId(areaScores, "technology"),
    humanDependencyIndex: riskFromScore(Math.round(avg([byId(areaScores, "operations"), byId(areaScores, "team"), byId(areaScores, "leadership")]))),
    strategicClarityIndex: byId(areaScores, "leadership"),
    implementationUrgency: riskFromScore(Math.round(avg([overallScore, byId(areaScores, "continuousImprovement")]))),
    automationPotential: Math.round(avg([riskFromScore(ops), byId(areaScores, "technology"), riskFromScore(byId(areaScores, "operations"))])),
    teamTrainingNeed: riskFromScore(people),
  };
}

export function getTopLeaks(areaScores: AreaScore[], limit = 5): Leak[] {
  return [...areaScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((area) => ({
      id: `leak-${area.id}`,
      areaId: area.id,
      areaName: area.name,
      score: area.score,
      ...leakMap[area.id],
    }));
}

export function createImpactUrgencyMatrix(leaks: Leak[]): MatrixItem[] {
  return leaks.map((leak) => {
    const impact = leak.impact === "Alto" ? 90 : leak.impact === "Medio/Alto" ? 76 : 58;
    const urgency = leak.urgency === "Inmediata" ? 94 : leak.urgency === "Alta" ? 82 : leak.urgency === "Media/Alta" ? 70 : 52;
    const quadrant =
      impact >= 80 && urgency >= 80
        ? "High impact / high urgency"
        : impact >= 75
          ? "System fixes"
          : urgency >= 75
            ? "Quick wins"
            : "Later optimizations";
    return { id: leak.id, title: leak.title, area: leak.areaName, impact, urgency, quadrant };
  });
}

export function getExecutiveDiagnosis(company: CompanyProfile, scores: AdvancedScores, dataRoom: DataRoom): string {
  const rules = getIndustryRules(company.industry);
  const topLeak = getTopLeaks(scores.areaScores, 1)[0];
  const response = dataRoom.leads.tiempoPromedioRespuesta;
  const unfollowed = dataRoom.leads.porcentajeSinSeguimiento;

  if (company.industry === "Corredores de propiedades / Brokerage inmobiliario") {
    return "No creo que el problema principal sea conseguir más leads. La red ya tiene demanda, presencia territorial y agentes activos. El punto de fuga está en la falta de visibilidad y consistencia después del primer contacto: quién responde, quién clasifica, quién agenda, quién retoma y quién convierte la intención en oferta. La oportunidad está en transformar hábitos individuales de corredores en un sistema comercial visible, medible y entrenable.";
  }

  return `${rules.executiveLanguage} En ${company.name}, el patrón principal aparece en ${topLeak.areaName.toLowerCase()}: ${topLeak.description} El mayor riesgo es mantener ${unfollowed} de oportunidades sin seguimiento con una respuesta promedio de ${response}. La oportunidad inmediata es convertir las próximas acciones en un sistema visible para dirección y equipo. Si no se actúa, la empresa seguirá comprando herramientas sin corregir la fuga entre demanda, responsable, proceso y medición.`;
}

export function generateExecutiveInsight(): string {
  return "Las empresas no pierden crecimiento por falta de herramientas. Lo pierden por puntos de fuga invisibles entre ventas, comunicación, operación y equipo.";
}
