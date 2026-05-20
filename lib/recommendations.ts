import type { Leak, Recommendation } from "./types";

const recommendationsByArea: Record<string, Omit<Recommendation, "id" | "leakTitle">> = {
  sales: {
    priority: "Prioridad 1",
    actionImmediate: "Crear un protocolo de respuesta a leads en menos de 15 minutos.",
    actionSystem: "Implementar una secuencia de seguimiento de 7 días.",
    actionAutomation:
      "Activar alertas automáticas para leads sin respuesta y sugerencias de mensaje por etapa.",
    expectedImpact: "Menos leads perdidos y mayor tasa de cierre.",
    difficulty: "Media",
    firstStep:
      "Mapear los últimos 30 leads recibidos y clasificar cuántos recibieron seguimiento real.",
  },
  marketing: {
    priority: "Prioridad 2",
    actionImmediate: "Unificar la propuesta de valor en web, WhatsApp, campañas y discurso comercial.",
    actionSystem: "Crear una matriz de mensajes por canal, objeción y etapa de compra.",
    actionAutomation:
      "Preparar una librería de respuestas asistidas para campañas y conversaciones comerciales.",
    expectedImpact: "Mayor claridad de compra y menos fricción entre marketing y ventas.",
    difficulty: "Media",
    firstStep: "Auditar 10 mensajes actuales y detectar diferencias de promesa, tono y llamado a la acción.",
  },
  customer: {
    priority: "Prioridad 2",
    actionImmediate: "Definir estándar de primera respuesta por canal.",
    actionSystem: "Crear protocolos de atención con criterios de derivación y seguimiento.",
    actionAutomation:
      "Diseñar respuestas sugeridas y alertas para consultas abiertas sin cierre.",
    expectedImpact: "Experiencia más consistente y menos oportunidades abandonadas.",
    difficulty: "Baja/Media",
    firstStep: "Recolectar preguntas frecuentes y objeciones de los últimos 15 días.",
  },
  operations: {
    priority: "Prioridad 1",
    actionImmediate: "Documentar los procesos críticos que hoy dependen de una persona.",
    actionSystem: "Asignar responsables por etapa y crear checklists operativos.",
    actionAutomation:
      "Convertir tareas repetitivas en flujos con recordatorios y estados visibles.",
    expectedImpact: "Menos dependencia de memoria humana y más libertad operativa.",
    difficulty: "Media/Alta",
    firstStep: "Elegir un proceso crítico y mapear entradas, responsables, decisiones y salida esperada.",
  },
  technology: {
    priority: "Prioridad 1",
    actionImmediate: "Centralizar oportunidades y clientes en una fuente de verdad inicial.",
    actionSystem: "Definir campos mínimos, estados y reglas de actualización de datos.",
    actionAutomation:
      "Preparar la arquitectura agéntica para futuras integraciones con Bridge Brain™.",
    expectedImpact: "Datos confiables para medir, priorizar y activar inteligencia aplicada.",
    difficulty: "Media",
    firstStep: "Consolidar una planilla maestra con leads, canal, responsable, estado y próxima acción.",
  },
  team: {
    priority: "Prioridad 3",
    actionImmediate: "Instalar una revisión semanal de seguimiento, aprendizajes y bloqueos.",
    actionSystem: "Crear rutinas de entrenamiento breve para ventas, atención y uso de datos.",
    actionAutomation:
      "Generar resúmenes semanales de tareas abiertas, métricas y decisiones pendientes.",
    expectedImpact: "Equipos que vuelven a pensar con métricas, feedback y mejora continua.",
    difficulty: "Baja",
    firstStep: "Definir una reunión de 30 minutos con tres métricas y tres decisiones obligatorias.",
  },
};

export function generateRecommendations(topLeaks: Leak[]): Recommendation[] {
  return topLeaks.map((leak) => ({
    id: `rec-${leak.areaId}`,
    leakTitle: leak.title,
    ...recommendationsByArea[leak.areaId],
  }));
}

export function getSuggestedFlow() {
  return ["Diagnosticar", "Priorizar", "Corregir", "Automatizar", "Entrenar", "Medir"];
}
