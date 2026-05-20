import type { AdvancedScores, CompanyProfile, TrackerTask } from "./types";

export type ExcellencePrinciple = {
  id: string;
  category: string;
  name: string;
  inspiredBy: string;
  description: string;
  principles: string[];
  appliesTo: string[];
  bridgeApplication: string[];
  metric: string;
};

export type ExcellenceDimension = {
  name: string;
  score: number;
  status: string;
  indicator: string;
  priorityAction: string;
};

export type BridgeExcellenceScore = {
  overall: number;
  status: "Riesgo estructural" | "Operación reactiva" | "Sistema en formación" | "Operación inteligente" | "Cultura de excelencia";
  dimensions: ExcellenceDimension[];
};

export const bridgeExcellenceLibrary: ExcellencePrinciple[] = [
  {
    id: "continuous-improvement",
    category: "Continuous Improvement",
    name: "Kaizen-inspired Improvement",
    inspiredBy: "principios públicos de mejora continua y participación de equipos",
    description: "Cada problema repetido debe convertirse en aprendizaje, estándar o microacción visible.",
    principles: ["mejora pequeña y constante", "participación de quienes hacen el trabajo", "eliminación de desperdicio", "estandarizar antes de automatizar", "no culpar personas, corregir sistemas"],
    appliesTo: ["Bridge Culture™", "Bridge Flow™", "Tracker", "Academy"],
    bridgeApplication: ["cada trabajador puede detectar fugas", "cada semana existe una microacción", "cada bloqueo se convierte en aprendizaje"],
    metric: "microacciones implementadas",
  },
  {
    id: "balanced-scorecard",
    category: "Strategic Measurement",
    name: "Balanced Scorecard-inspired Lens",
    inspiredBy: "principios públicos de medición balanceada del desempeño",
    description: "La empresa no se mide solo por ventas; también por clientes, procesos, aprendizaje, datos e IA.",
    principles: ["lo que se mide se gestiona", "conectar estrategia con operación", "traducir objetivos en indicadores", "hacer visible el avance"],
    appliesTo: ["Bridge Insight™", "Executive Report", "Command Center"],
    bridgeApplication: ["score por dimensión", "indicador recomendado", "acción prioritaria"],
    metric: "avance por dimensión estratégica",
  },
  {
    id: "service-profit-chain",
    category: "People + Customer Experience",
    name: "Service-Profit Chain-inspired Logic",
    inspiredBy: "principios públicos sobre experiencia del colaborador, cliente y resultados",
    description: "Si el equipo no tiene claridad, entrenamiento o soporte, el cliente siente la fricción.",
    principles: ["experiencia del colaborador impacta experiencia del cliente", "equipos entrenados atienden mejor", "claridad interna produce mejor servicio"],
    appliesTo: ["Bridge Culture™", "Academy", "Team & Culture", "Executive Report"],
    bridgeApplication: ["medir carga operativa", "recomendar entrenamiento", "detectar fricción interna antes de que llegue al cliente"],
    metric: "training need + customer experience risk",
  },
  {
    id: "service-standard",
    category: "Service Excellence",
    name: "Bridge Service Standard™",
    inspiredBy: "principios públicos de excelencia de servicio",
    description: "Un estándar propio para evaluar atención, scripts, comunicación interna y consistencia del servicio.",
    principles: ["claridad", "cortesía", "consistencia", "eficiencia", "humanidad"],
    appliesTo: ["Bridge Culture™", "Academy", "Bridge Flow™", "Scripts"],
    bridgeApplication: ["evaluar scripts", "recomendar microentrenamientos", "generar mensajes más humanos"],
    metric: "Service Standard Score™",
  },
  {
    id: "speed-to-lead",
    category: "Sales Response",
    name: "Speed-to-Lead Discipline",
    inspiredBy: "investigaciones públicas sobre velocidad de respuesta a leads",
    description: "Los leads calientes pierden valor con el tiempo; cada oportunidad necesita SLA y próxima acción.",
    principles: ["responder rápido aumenta probabilidad de contacto", "seguimiento consistente es ventaja comercial", "la próxima acción debe estar registrada"],
    appliesTo: ["Bridge Scan™", "Bridge Insight™", "Live Goals™", "Notifications"],
    bridgeApplication: ["medir tiempo de respuesta", "alertar oportunidades dormidas", "recomendar SLA"],
    metric: "tiempo de primera respuesta",
  },
  {
    id: "customer-effort",
    category: "Customer Experience",
    name: "Friction Reduction",
    inspiredBy: "principios públicos de reducción de esfuerzo del cliente",
    description: "Resolver bien y con claridad suele valer más que impresionar con complejidad.",
    principles: ["el cliente no debería repetir lo mismo", "cada paso innecesario reduce conversión", "claridad reduce fricción", "resolver bien vale más que impresionar"],
    appliesTo: ["Experience Lens™", "Data Room", "Bridge Flow™"],
    bridgeApplication: ["detectar respuestas confusas", "simplificar camino de compra", "reducir cambios de canal"],
    metric: "customer experience risk",
  },
  {
    id: "operational-excellence",
    category: "Operational Excellence",
    name: "Operating Rhythm",
    inspiredBy: "principios públicos de ejecución, claridad y accountability",
    description: "La ejecución mejora cuando hay responsables claros, indicadores vivos y decisiones con dueño.",
    principles: ["procesos documentados", "responsables claros", "tableros de avance", "decisiones con datos", "rituales semanales"],
    appliesTo: ["Command Center", "Tracker", "Team & Culture"],
    bridgeApplication: ["tablero de prioridades", "metas diarias", "revisión semanal", "accountability sin castigo"],
    metric: "implementation urgency",
  },
  {
    id: "ai-readiness",
    category: "AI Readiness",
    name: "AI Before Automation Readiness",
    inspiredBy: "principios públicos de gobernanza, datos y revisión humana",
    description: "La IA necesita datos conectados, procesos claros, límites y revisión humana.",
    principles: ["datos conectados antes de IA", "procesos claros antes de automatizar", "privacidad", "gobernanza", "casos de uso priorizados"],
    appliesTo: ["Paula Engine™", "Integrations", "Settings"],
    bridgeApplication: ["medir preparación IA", "recomendar casos de uso", "proteger criterio humano"],
    metric: "AI Readiness Index",
  },
];

export const legendaryBusinessPrinciples = [
  "Principio de medición: lo que se hace visible puede gestionarse mejor.",
  "Principio de cliente: comenzar desde la experiencia del cliente y trabajar hacia atrás.",
  "Principio de operación: estandarizar antes de escalar.",
  "Principio de cultura: la estrategia necesita hábitos diarios para sobrevivir.",
  "Principio de mejora continua: todo proceso puede mejorar una microacción a la vez.",
  "Principio de liderazgo: la claridad crea accountability sin castigo.",
  "Principio de IA aplicada: automatizar solo después de entender el proceso.",
];

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));
}

function status(score: number): BridgeExcellenceScore["status"] {
  if (score <= 39) return "Riesgo estructural";
  if (score <= 59) return "Operación reactiva";
  if (score <= 74) return "Sistema en formación";
  if (score <= 89) return "Operación inteligente";
  return "Cultura de excelencia";
}

function dimensionStatus(score: number) {
  if (score <= 39) return "crítico";
  if (score <= 59) return "reactivo";
  if (score <= 74) return "en formación";
  if (score <= 89) return "inteligente";
  return "excelencia";
}

export function calculateBridgeExcellenceScore(scores: AdvancedScores): BridgeExcellenceScore {
  const dims: ExcellenceDimension[] = [
    {
      name: "Claridad estratégica",
      score: scores.strategicClarityIndex,
      status: dimensionStatus(scores.strategicClarityIndex),
      indicator: "prioridades con dueño",
      priorityAction: "Traducir cada prioridad en responsable, fecha y métrica.",
    },
    {
      name: "Velocidad comercial",
      score: Math.max(0, 100 - scores.commercialLeakIndex),
      status: dimensionStatus(Math.max(0, 100 - scores.commercialLeakIndex)),
      indicator: "tiempo primera respuesta",
      priorityAction: "Instalar SLA y alerta para oportunidades calientes.",
    },
    {
      name: "Consistencia de servicio",
      score: Math.max(0, 100 - scores.customerExperienceRisk),
      status: dimensionStatus(Math.max(0, 100 - scores.customerExperienceRisk)),
      indicator: "respuestas alineadas",
      priorityAction: "Aplicar Bridge Service Standard™ a scripts y atención.",
    },
    {
      name: "Disciplina operativa",
      score: Math.max(0, 100 - scores.operationalLeakIndex),
      status: dimensionStatus(Math.max(0, 100 - scores.operationalLeakIndex)),
      indicator: "procesos con seguimiento",
      priorityAction: "Documentar un proceso crítico y medir cumplimiento.",
    },
    {
      name: "Cultura de mejora continua",
      score: Math.max(0, 100 - scores.teamTrainingNeed),
      status: dimensionStatus(Math.max(0, 100 - scores.teamTrainingNeed)),
      indicator: "microacciones semanales",
      priorityAction: "Instalar ritual Bridge de 25 minutos.",
    },
    {
      name: "Preparación IA",
      score: scores.aiReadinessIndex,
      status: dimensionStatus(scores.aiReadinessIndex),
      indicator: "datos + procesos + revisión humana",
      priorityAction: "Priorizar un caso de uso de IA con datos confiables.",
    },
    {
      name: "Experiencia colaborador",
      score: Math.max(0, 100 - Math.round((scores.humanDependencyIndex + scores.teamTrainingNeed) / 2)),
      status: dimensionStatus(Math.max(0, 100 - Math.round((scores.humanDependencyIndex + scores.teamTrainingNeed) / 2))),
      indicator: "claridad de rol y carga",
      priorityAction: "Reducir dependencia de memoria humana con checklist visible.",
    },
    {
      name: "Experiencia cliente",
      score: Math.max(0, 100 - scores.customerExperienceRisk),
      status: dimensionStatus(Math.max(0, 100 - scores.customerExperienceRisk)),
      indicator: "fricción y seguimiento",
      priorityAction: "Eliminar un paso repetido o confuso del recorrido cliente.",
    },
  ];

  const overall = average(dims.map((dim) => dim.score));
  return { overall, status: status(overall), dimensions: dims };
}

export function getStrategicScorecard(scores: AdvancedScores): ExcellenceDimension[] {
  return [
    { name: "Finanzas / crecimiento", score: Math.max(0, 100 - scores.commercialLeakIndex), status: dimensionStatus(Math.max(0, 100 - scores.commercialLeakIndex)), indicator: "conversión y oportunidades activas", priorityAction: "Conectar demanda con seguimiento medible." },
    { name: "Clientes", score: Math.max(0, 100 - scores.customerExperienceRisk), status: dimensionStatus(Math.max(0, 100 - scores.customerExperienceRisk)), indicator: "claridad y fricción", priorityAction: "Reducir esfuerzo del cliente en el siguiente paso." },
    { name: "Procesos internos", score: Math.max(0, 100 - scores.operationalLeakIndex), status: dimensionStatus(Math.max(0, 100 - scores.operationalLeakIndex)), indicator: "responsables y tableros", priorityAction: "Estandarizar el proceso con más fugas." },
    { name: "Aprendizaje y cultura", score: Math.max(0, 100 - scores.teamTrainingNeed), status: dimensionStatus(Math.max(0, 100 - scores.teamTrainingNeed)), indicator: "microlecciones y rituales", priorityAction: "Asignar una lección a cada fuga prioritaria." },
    { name: "Tecnología / datos", score: scores.dataMaturityIndex, status: dimensionStatus(scores.dataMaturityIndex), indicator: "fuente de verdad", priorityAction: "Definir campos mínimos y dato confiable." },
    { name: "Preparación IA", score: scores.aiReadinessIndex, status: dimensionStatus(scores.aiReadinessIndex), indicator: "casos de uso priorizados", priorityAction: "Elegir un flujo para automatización asistida." },
  ];
}

export function getServiceStandardScore(scores: AdvancedScores) {
  const dimensions = [
    { name: "Claridad", score: scores.strategicClarityIndex, description: "el cliente entiende el siguiente paso" },
    { name: "Cortesía", score: Math.max(0, 100 - scores.customerExperienceRisk + 5), description: "el mensaje mantiene tono humano" },
    { name: "Consistencia", score: Math.max(0, 100 - scores.communicationLeakIndex), description: "el equipo responde alineado" },
    { name: "Eficiencia", score: Math.max(0, 100 - scores.operationalLeakIndex), description: "el proceso reduce espera y repetición" },
    { name: "Humanidad", score: Math.max(0, 100 - Math.round(scores.humanDependencyIndex / 2)), description: "la tecnología acompaña sin despersonalizar" },
  ].map((item) => ({ ...item, score: Math.min(100, item.score) }));

  return {
    overall: average(dimensions.map((dim) => dim.score)),
    dimensions,
  };
}

export function getContinuousImprovementLoop(company: CompanyProfile, tasks: TrackerTask[]) {
  const openTask = tasks.find((task) => task.status !== "Implementado");
  return {
    steps: ["Detectar", "Estandarizar", "Implementar", "Medir", "Aprender", "Mejorar"],
    lastLearning: "Las oportunidades sin próxima acción se enfrían aunque el canal genere demanda.",
    processToStandardize: company.industry === "Corredores de propiedades / Brokerage inmobiliario" ? "seguimiento post visita y post tasación" : "primera respuesta y seguimiento comercial",
    recurringBlocker: "la próxima acción no siempre queda visible para el equipo",
    suggestedMicroAction: openTask?.title ?? "documentar una regla simple de seguimiento",
    owner: openTask?.owner ?? "líder operativo",
    nextReview: "próxima reunión Bridge semanal",
  };
}
