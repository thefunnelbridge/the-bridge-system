import { getIndustryRules } from "./industry-rules";
import type { CompanyProfile, Leak, Recommendation } from "./types";

export function generateRecommendations(topLeaks: Leak[], company?: CompanyProfile): Recommendation[] {
  const rules = company ? getIndustryRules(company.industry) : null;
  const brokerage = company?.industry === "Corredores de propiedades / Brokerage inmobiliario";

  return topLeaks.map((leak, index) => {
    if (brokerage) {
      return {
        id: `rec-${leak.areaId}`,
        leakTitle: leak.title,
        area: leak.areaName,
        priority: `Prioridad ${index + 1}`,
        whyItMatters: leak.whyItMatters,
        actionImmediate: "Crear SLA de respuesta de máximo 15 minutos para leads de portales, web y WhatsApp.",
        action72Hours: "Clasificar los últimos 100 leads compradores por presupuesto, comuna, urgencia y tipo de propiedad.",
        action7Days: "Implementar secuencia de seguimiento para comprador: día 1, día 3, día 7, día 14 y día 30.",
        action30Days: "Crear tablero de oportunidades dormidas por corredor y oficina.",
        automation: "Alertar al líder de oficina cuando un lead comprador no tenga próxima acción registrada en 72 horas.",
        script:
          "Hola, [Nombre]. Te escribo porque hace unos días consultaste por propiedades en [Zona]. Vi que hay nuevas opciones que podrían calzar con lo que buscabas. ¿Sigues mirando alternativas o ya encontraste algo?",
        kpi: "tiempo de primera respuesta, lead a visita, visita a oferta y oportunidades dormidas por corredor",
        owner: "corredor asignado + líder de oficina",
        difficulty: "Media",
        impact: "Alto",
        riskOfInaction: leak.riskOfInaction,
      };
    }

    return {
      id: `rec-${leak.areaId}`,
      leakTitle: leak.title,
      area: leak.areaName,
      priority: `Prioridad ${index + 1}`,
      whyItMatters: leak.whyItMatters,
      actionImmediate: `Definir un estándar visible para ${leak.areaName.toLowerCase()} con responsable y primera métrica.`,
      action72Hours: "Revisar los últimos casos reales, clasificar dónde se pierden y asignar próxima acción.",
      action7Days: "Crear un flujo operativo simple con etapas, responsables, mensajes base y revisión semanal.",
      action30Days: "Medir cumplimiento, ajustar scripts y entrenar al equipo con aprendizaje de casos reales.",
      automation: rules?.recommendedAutomations[index] ?? "Alerta automática para oportunidades sin próxima acción.",
      script: rules?.recommendedScripts[index] ?? "Mensaje de primer contacto y retoma adaptado por etapa.",
      kpi: rules?.kpisToWatch[index] ?? "oportunidades con próxima acción",
      owner: index === 0 ? "Dirección / líder comercial" : "Responsable de área",
      difficulty: index === 0 ? "Media" : "Baja/Media",
      impact: leak.impact,
      riskOfInaction: leak.riskOfInaction,
    };
  });
}

export function getSuggestedFlow() {
  return ["Diagnosticar", "Priorizar", "Corregir", "Automatizar", "Entrenar", "Medir"];
}
