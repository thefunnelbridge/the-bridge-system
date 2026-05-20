export const benchmarks = [
  {
    title: "Speed-to-lead",
    signal: "La velocidad de respuesta afecta fuertemente la calificación de oportunidades.",
    productImplication: "Medir SLA de respuesta, leads sin seguimiento y oportunidades dormidas.",
    relatedMetrics: ["responseTime", "unfollowedLeads", "leadToMeeting"],
    sourceLabel: "HBR / Lead response research",
  },
  {
    title: "CRM adoption",
    signal: "Tener CRM no significa tener proceso comercial vivo.",
    productImplication: "Medir registro, priorización, seguimiento, aprendizaje y próxima acción.",
    relatedMetrics: ["nextAction", "pipelineStage", "lossReason"],
    sourceLabel: "CRM adoption patterns",
  },
  {
    title: "Digital transformation",
    signal: "Muchos proyectos fallan por adopción, cultura, procesos y alineación.",
    productImplication: "Diagnosticar herramientas instaladas versus procesos usados por el equipo.",
    relatedMetrics: ["rituals", "training", "ownership"],
    sourceLabel: "Digital transformation public research",
  },
  {
    title: "AI readiness",
    signal: "La IA sin datos conectados ni workflows claros amplifica el desorden.",
    productImplication: "Medir datos, casos de uso, límites, responsables y revisión humana.",
    relatedMetrics: ["dataMaturity", "automationPotential", "humanReview"],
    sourceLabel: "AI readiness frameworks",
  },
  {
    title: "Brokerage lead management",
    signal: "Las redes de corredores pierden visibilidad cuando cada agente opera desde hábitos individuales.",
    productImplication: "Medir respuesta, clasificación, visitas, ofertas, oportunidades dormidas y desempeño por oficina.",
    relatedMetrics: ["buyerClassification", "visitFollowUp", "agentHabits"],
    sourceLabel: "Real estate brokerage operating patterns",
  },
];
