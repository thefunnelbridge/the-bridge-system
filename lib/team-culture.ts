import type { CompanyProfile } from "./types";

export type TeamRole = {
  role: string;
  responsibilities: string[];
  associatedLeaks: string[];
  operationalLoad: "Baja" | "Media" | "Alta" | "Crítica";
  assignedTasks: string[];
  recommendedLesson: string;
  status: "Estable" | "Requiere foco" | "Sobrecarga" | "Sin sistema";
  culturalRisk: string;
};

export type BrokerageOffice = {
  office: string;
  agents: number;
  leads: number;
  responseTime: string;
  unfollowed: string;
  visits: number;
  offers: number;
  stagnantProperties: number;
  alert: string;
  recommendedTraining: string;
};

export function getTeamRoles(company: CompanyProfile): TeamRole[] {
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  if (brokerage) {
    return [
      {
        role: "Dirección nacional",
        responsibilities: ["definir estándar comercial", "leer desempeño por oficina", "priorizar fugas sistémicas"],
        associatedLeaks: ["baja visibilidad por corredor", "rituales irregulares", "oportunidades dormidas"],
        operationalLoad: "Alta",
        assignedTasks: ["instalar tablero nacional", "definir score de hábitos"],
        recommendedLesson: "Cómo medir desempeño comercial sin generar competencia tóxica",
        status: "Requiere foco",
        culturalRisk: "La red puede confundir autonomía del corredor con ausencia de sistema.",
      },
      {
        role: "Líderes de oficina",
        responsibilities: ["revisar pipeline semanal", "acompañar corredores", "desbloquear oportunidades"],
        associatedLeaks: ["leads sin seguimiento", "propiedades sin movimiento", "visitas sin retoma"],
        operationalLoad: "Crítica",
        assignedTasks: ["reunión Bridge semanal", "alertas de leads dormidos"],
        recommendedLesson: "Cómo crear un ritual semanal de pipeline inmobiliario",
        status: "Sobrecarga",
        culturalRisk: "Sin ritual común, cada oficina opera con criterios distintos.",
      },
      {
        role: "Corredores",
        responsibilities: ["responder rápido", "clasificar compradores", "hacer seguimiento post visita"],
        associatedLeaks: ["agenda personal", "WhatsApp disperso", "próxima acción no registrada"],
        operationalLoad: "Alta",
        assignedTasks: ["clasificar leads", "registrar próxima acción", "retomar compradores dormidos"],
        recommendedLesson: "Cómo hacer seguimiento sin parecer insistente",
        status: "Sin sistema",
        culturalRisk: "El desempeño depende demasiado de hábitos individuales difíciles de observar.",
      },
      {
        role: "Marketing",
        responsibilities: ["origen de leads", "mensajes por zona", "campañas por propiedad"],
        associatedLeaks: ["leads de portales mezclados", "mensajes distintos", "propiedades sin plan comercial"],
        operationalLoad: "Media",
        assignedTasks: ["matriz de mensajes", "prioridad por fuente"],
        recommendedLesson: "Cómo convertir referidos en sistema comercial",
        status: "Requiere foco",
        culturalRisk: "Marketing puede generar demanda que la red no convierte por falta de seguimiento visible.",
      },
    ];
  }

  return [
    {
      role: "Dirección / CEO",
      responsibilities: ["definir prioridades", "leer indicadores", "asignar dueños"],
      associatedLeaks: ["decisiones sin tarea", "reuniones sin cierre", "datos no usados"],
      operationalLoad: "Alta",
      assignedTasks: ["revisión semanal", "definir métrica principal"],
      recommendedLesson: "Cómo priorizar oportunidades",
      status: "Requiere foco",
      culturalRisk: "La empresa puede depender demasiado de la memoria del líder.",
    },
    {
      role: "Ventas",
      responsibilities: ["responder leads", "clasificar intención", "seguir oportunidades"],
      associatedLeaks: ["leads dormidos", "sin secuencia", "motivos de pérdida no registrados"],
      operationalLoad: "Alta",
      assignedTasks: ["SLA 15 minutos", "secuencia 7 días"],
      recommendedLesson: "Seguimiento sin parecer insistente",
      status: "Sobrecarga",
      culturalRisk: "El esfuerzo comercial existe, pero no siempre se convierte en aprendizaje compartido.",
    },
    {
      role: "Marketing",
      responsibilities: ["mensaje", "campañas", "educación del cliente"],
      associatedLeaks: ["mensaje fragmentado", "campañas desconectadas", "datos no compartidos"],
      operationalLoad: "Media",
      assignedTasks: ["matriz de mensajes", "lectura por canal"],
      recommendedLesson: "Cómo medir una campaña comercial",
      status: "Requiere foco",
      culturalRisk: "Marketing puede operar como generación de contenido, no como sistema de demanda.",
    },
    {
      role: "Atención",
      responsibilities: ["primera respuesta", "tono", "seguimiento posterior"],
      associatedLeaks: ["respuestas distintas", "FAQ no registradas", "post atención débil"],
      operationalLoad: "Alta",
      assignedTasks: ["protocolo de primera respuesta", "biblioteca de objeciones"],
      recommendedLesson: "Responder leads con claridad",
      status: "Sin sistema",
      culturalRisk: "La calidad de experiencia depende de quién responde ese día.",
    },
    {
      role: "Operaciones",
      responsibilities: ["procesos críticos", "responsables", "tableros"],
      associatedLeaks: ["memoria humana", "cuellos de botella", "responsables difusos"],
      operationalLoad: "Alta",
      assignedTasks: ["documentar proceso crítico", "definir tablero simple"],
      recommendedLesson: "Cómo documentar un proceso simple",
      status: "Requiere foco",
      culturalRisk: "El crecimiento puede sumar volumen antes de sumar claridad.",
    },
    {
      role: "Tecnología / datos",
      responsibilities: ["fuentes de verdad", "integraciones", "gobierno de datos"],
      associatedLeaks: ["datos dispersos", "automatizaciones aisladas", "AI Readiness bajo"],
      operationalLoad: "Media",
      assignedTasks: ["campos mínimos", "auditoría de herramientas"],
      recommendedLesson: "Cómo usar IA sin perder humanidad",
      status: "Estable",
      culturalRisk: "La tecnología puede quedar instalada, pero no adoptada por los hábitos del equipo.",
    },
  ];
}

export const brokerageOffices: BrokerageOffice[] = [
  { office: "Temuco Centro", agents: 18, leads: 178, responseTime: "4.8h", unfollowed: "36%", visits: 82, offers: 14, stagnantProperties: 19, alert: "visitas sin seguimiento", recommendedTraining: "post visita documentado" },
  { office: "Santiago Oriente", agents: 32, leads: 420, responseTime: "6.2h", unfollowed: "44%", visits: 188, offers: 31, stagnantProperties: 27, alert: "lead comprador sin clasificación", recommendedTraining: "clasificación por intención" },
  { office: "Puerto Varas", agents: 14, leads: 134, responseTime: "3.9h", unfollowed: "28%", visits: 64, offers: 9, stagnantProperties: 11, alert: "propietarios post tasación", recommendedTraining: "seguimiento propietario" },
  { office: "Concepción", agents: 24, leads: 260, responseTime: "7.1h", unfollowed: "49%", visits: 101, offers: 16, stagnantProperties: 23, alert: "oportunidades dormidas", recommendedTraining: "ritual semanal pipeline" },
];
