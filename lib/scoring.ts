import { areaIds, areaLabels } from "./scan-questions";
import type { AreaScore, Leak, MaturityStatus, ScanResponses } from "./types";

const leakMap: Record<string, Omit<Leak, "areaId" | "areaName" | "score">> = {
  sales: {
    title: "Seguimiento comercial inconsistente",
    description:
      "Los leads entran, pero no existe un sistema claro para responder, priorizar y retomar oportunidades.",
    impact: "Alto",
    urgency: "Inmediata",
  },
  marketing: {
    title: "Mensaje comercial fragmentado",
    description:
      "La empresa comunica distinto según canal o persona, debilitando la claridad de compra.",
    impact: "Medio/Alto",
    urgency: "Alta",
  },
  customer: {
    title: "Experiencia de respuesta irregular",
    description: "La atención depende del criterio individual y no de un protocolo claro.",
    impact: "Alto",
    urgency: "Alta",
  },
  operations: {
    title: "Procesos dependientes de memoria humana",
    description:
      "Las tareas críticas no están suficientemente documentadas ni distribuidas.",
    impact: "Alto",
    urgency: "Media/Alta",
  },
  technology: {
    title: "Datos dispersos y baja preparación para IA",
    description:
      "La empresa tiene herramientas, pero la información no está conectada ni preparada para automatización inteligente.",
    impact: "Alto",
    urgency: "Alta",
  },
  team: {
    title: "Equipo sin sistema de mejora continua",
    description:
      "El equipo opera con esfuerzo, pero sin entrenamiento, feedback o métricas suficientes.",
    impact: "Medio/Alto",
    urgency: "Media",
  },
};

export function calculateAreaScores(responses: ScanResponses): AreaScore[] {
  return areaIds.map((id) => {
    const values = responses[id] ?? [];
    const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
    return { id, name: areaLabels[id], score: Math.round(average * 20) };
  });
}

export function calculateOverallScore(areaScores: AreaScore[]): number {
  const total = areaScores.reduce((sum, area) => sum + area.score, 0);
  return Math.round(total / Math.max(areaScores.length, 1));
}

export function getMaturityStatus(score: number): MaturityStatus {
  if (score <= 39) return "Fuga crítica";
  if (score <= 59) return "Alto riesgo";
  if (score <= 79) return "En desarrollo";
  return "Sistema escalable";
}

export function getTopLeaks(areaScores: AreaScore[]): Leak[] {
  return [...areaScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((area) => ({
      areaId: area.id,
      areaName: area.name,
      score: area.score,
      ...leakMap[area.id],
    }));
}

export function generateExecutiveInsight(): string {
  return "The Bridge System™ detectó que la empresa tiene una base comercial activa, pero sus principales puntos de fuga están en seguimiento, conexión de datos y consistencia operativa. La prioridad no es conseguir más herramientas, sino ordenar el flujo entre entrada de oportunidades, respuesta, seguimiento y medición.";
}
