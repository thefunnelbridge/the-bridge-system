import type { CompanyProfile, DemoIndustry } from "./types";

export type ConversationChannel = "WhatsApp" | "Email" | "Formulario web" | "Instagram DM" | "Llamada" | "Chat web";
export type ConversationStatus =
  | "Nuevo lead"
  | "En conversación"
  | "Cotización enviada"
  | "Seguimiento pendiente"
  | "Cliente dormido"
  | "Documento pendiente"
  | "Cerrado"
  | "Requiere atención";
export type ConversationPriority = "Crítica" | "Alta" | "Media" | "Baja";

export type BridgeInboxConversation = {
  id: string;
  customer: string;
  channel: ConversationChannel;
  responsible: string;
  lastInteraction: string;
  nextAction: string;
  priority: ConversationPriority;
  status: ConversationStatus;
  associatedFile: string;
  detectedLeak: string;
  suggestedScript: string;
  tags: string[];
  unreadMessages: number;
  hasPendingAudio: boolean;
  hasUnlinkedFiles: boolean;
  isInternalMixed: boolean;
};

export type InboxMetrics = {
  openConversations: number;
  unassigned: number;
  withoutNextAction: number;
  scatteredFiles: number;
  quotesSent: number;
  pendingDocuments: number;
  pendingAudios: number;
  unansweredMessages: number;
  internalMixedWithSales: number;
  dormantOpportunities: number;
  criticalToday: number;
};

const baseScript =
  "Hola, [Nombre]. Para ayudarte mejor, te dejo el siguiente paso claro: [acción]. Yo quedo pendiente de [dato/documento/respuesta] para avanzar.";

const templates: Record<string, BridgeInboxConversation[]> = {
  "constructora-sur": [
    {
      id: "inbox-constructor-1",
      customer: "Carolina Rivas",
      channel: "WhatsApp",
      responsible: "Ejecutivo proyecto Río Sur",
      lastInteraction: "Hace 5 horas",
      nextAction: "Confirmar si agenda visita o requiere simulación de financiamiento.",
      priority: "Alta",
      status: "Seguimiento pendiente",
      associatedFile: "cotizacion-rio-sur-carolina.pdf",
      detectedLeak: "Cotización enviada sin siguiente paso registrado.",
      suggestedScript: "Hola, Carolina. Para avanzar con Río Sur, puedo ayudarte con dos caminos: visita o simulación de financiamiento. ¿Cuál prefieres revisar hoy?",
      tags: ["Proyecto Río Sur", "Cotización enviada", "Financiamiento"],
      unreadMessages: 2,
      hasPendingAudio: false,
      hasUnlinkedFiles: false,
      isInternalMixed: false,
    },
    {
      id: "inbox-constructor-2",
      customer: "Matías Fuentes",
      channel: "Formulario web",
      responsible: "Sin asignar",
      lastInteraction: "Hace 26 horas",
      nextAction: "",
      priority: "Crítica",
      status: "Requiere atención",
      associatedFile: "sin archivo asociado",
      detectedLeak: "Lead de portal sin responsable y sin próxima acción.",
      suggestedScript: baseScript,
      tags: ["Nuevo lead", "Portal", "Sin responsable"],
      unreadMessages: 1,
      hasPendingAudio: false,
      hasUnlinkedFiles: false,
      isInternalMixed: false,
    },
  ],
  "clinica-aurora": [
    {
      id: "inbox-clinica-1",
      customer: "Paciente nuevo · tratamiento dental",
      channel: "WhatsApp",
      responsible: "Recepción",
      lastInteraction: "Hace 3 horas",
      nextAction: "Clasificar tratamiento y enviar disponibilidad de agenda.",
      priority: "Alta",
      status: "En conversación",
      associatedFile: "audio-paciente-odontologia.mp3",
      detectedLeak: "Audio pendiente y consulta sin clasificación clínica/comercial.",
      suggestedScript: "Hola, gracias por escribirnos. Para ayudarte con claridad, ¿buscas evaluación, presupuesto o agendar una hora? Te puedo orientar con el siguiente paso.",
      tags: ["Paciente nuevo", "Agenda", "Audio pendiente"],
      unreadMessages: 4,
      hasPendingAudio: true,
      hasUnlinkedFiles: true,
      isInternalMixed: false,
    },
  ],
  "century-sur-brokers": [
    {
      id: "inbox-brokerage-1",
      customer: "Comprador zona La Dehesa",
      channel: "WhatsApp",
      responsible: "Corredora Paula M.",
      lastInteraction: "Hace 72 horas",
      nextAction: "Enviar 3 alternativas y agendar visita.",
      priority: "Crítica",
      status: "Cliente dormido",
      associatedFile: "preferencias-comprador-la-dehesa.xlsx",
      detectedLeak: "Comprador con alta intención sin seguimiento después de 72 horas.",
      suggestedScript: "Hola, [Nombre]. Vi que sigues buscando en La Dehesa. Hay 3 alternativas que calzan con tu presupuesto. ¿Te las envío para elegir visita esta semana?",
      tags: ["Comprador", "Dormido 72h", "Visita"],
      unreadMessages: 0,
      hasPendingAudio: false,
      hasUnlinkedFiles: false,
      isInternalMixed: false,
    },
    {
      id: "inbox-brokerage-2",
      customer: "Propietaria tasación Providencia",
      channel: "Email",
      responsible: "Líder oficina Providencia",
      lastInteraction: "Hace 4 días",
      nextAction: "Enviar plan comercial y definir prioridad de venta.",
      priority: "Alta",
      status: "Documento pendiente",
      associatedFile: "tasacion-providencia.pdf",
      detectedLeak: "Propietaria tasada sin seguimiento post tasación.",
      suggestedScript: "Hola, [Nombre]. Ya revisamos valor estimado y mercado. El siguiente paso es definir si priorizamos velocidad, precio o equilibrio. ¿Qué objetivo prefieres?",
      tags: ["Propietario", "Tasación", "Plan comercial"],
      unreadMessages: 1,
      hasPendingAudio: false,
      hasUnlinkedFiles: true,
      isInternalMixed: false,
    },
  ],
};

const commonConversations: BridgeInboxConversation[] = [
  {
    id: "inbox-common-1",
    customer: "Lead WhatsApp sin etiqueta",
    channel: "WhatsApp",
    responsible: "Sin asignar",
    lastInteraction: "Hace 18 horas",
    nextAction: "",
    priority: "Alta",
    status: "Nuevo lead",
    associatedFile: "captura-documento-cliente.jpg",
    detectedLeak: "Conversación comercial mezclada con coordinación interna.",
    suggestedScript: baseScript,
    tags: ["Nuevo lead", "Sin etiqueta", "Archivo disperso"],
    unreadMessages: 3,
    hasPendingAudio: false,
    hasUnlinkedFiles: true,
    isInternalMixed: true,
  },
  {
    id: "inbox-common-2",
    customer: "Cliente con documento pendiente",
    channel: "Email",
    responsible: "Administración",
    lastInteraction: "Hace 2 días",
    nextAction: "Solicitar documento faltante y registrar fecha de seguimiento.",
    priority: "Media",
    status: "Documento pendiente",
    associatedFile: "documentos-cliente.zip",
    detectedLeak: "Archivo asociado, pero sin responsable de cierre documental.",
    suggestedScript: "Hola, [Nombre]. Para avanzar falta [documento]. Si me lo envías hoy, dejamos registrado el siguiente paso y evitamos atrasos.",
    tags: ["Documento pendiente", "Administración"],
    unreadMessages: 0,
    hasPendingAudio: false,
    hasUnlinkedFiles: false,
    isInternalMixed: false,
  },
];

export function getDemoInboxConversations(company: CompanyProfile): BridgeInboxConversation[] {
  return [...(templates[company.id] ?? []), ...commonConversations].map((conversation) => ({
    ...conversation,
    id: `${company.id}-${conversation.id}`,
  }));
}

export function getInboxMetrics(conversations: BridgeInboxConversation[]): InboxMetrics {
  const openStatuses: ConversationStatus[] = ["Nuevo lead", "En conversación", "Cotización enviada", "Seguimiento pendiente", "Cliente dormido", "Documento pendiente", "Requiere atención"];
  return {
    openConversations: conversations.filter((item) => openStatuses.includes(item.status)).length,
    unassigned: conversations.filter((item) => item.responsible === "Sin asignar").length,
    withoutNextAction: conversations.filter((item) => !item.nextAction.trim()).length,
    scatteredFiles: conversations.filter((item) => item.hasUnlinkedFiles).length,
    quotesSent: conversations.filter((item) => item.status === "Cotización enviada").length,
    pendingDocuments: conversations.filter((item) => item.status === "Documento pendiente").length,
    pendingAudios: conversations.filter((item) => item.hasPendingAudio).length,
    unansweredMessages: conversations.reduce((sum, item) => sum + item.unreadMessages, 0),
    internalMixedWithSales: conversations.filter((item) => item.isInternalMixed).length,
    dormantOpportunities: conversations.filter((item) => item.status === "Cliente dormido").length,
    criticalToday: conversations.filter((item) => item.priority === "Crítica" || item.status === "Requiere atención").length,
  };
}

export function getSuggestedInboxTags(industry: DemoIndustry): string[] {
  const base = ["Nuevo lead", "Cotización enviada", "Seguimiento pendiente", "Cliente dormido", "Documento pendiente"];
  if (industry === "Corredores de propiedades / Brokerage inmobiliario") return [...base, "Comprador", "Propietario", "Post visita", "Post tasación", "Propiedad sin movimiento"];
  if (industry === "Clínica / salud / estética / dental") return [...base, "Paciente nuevo", "Confirmación", "Postconsulta", "No-show"];
  if (industry === "Automotora") return [...base, "Financiamiento", "Permuta", "Test drive", "Modelo solicitado"];
  return base;
}

export function getInboxPulse(conversations: BridgeInboxConversation[]) {
  const metrics = getInboxMetrics(conversations);
  return {
    criticalConversations: conversations.filter((item) => item.priority === "Crítica" || item.status === "Requiere atención").slice(0, 3),
    clientsWaiting: conversations.filter((item) => item.unreadMessages > 0).slice(0, 3),
    documentsPending: conversations.filter((item) => item.status === "Documento pendiente").slice(0, 3),
    dormantOpportunities: conversations.filter((item) => item.status === "Cliente dormido").slice(0, 3),
    unassigned: conversations.filter((item) => item.responsible === "Sin asignar").slice(0, 3),
    nextBestAction:
      metrics.withoutNextAction > 0
        ? "Asignar responsable y próxima acción a cada conversación abierta antes de cerrar el día."
        : "Revisar conversaciones con documentos pendientes y confirmar siguiente paso con el cliente.",
  };
}

export function getInboxFlowRecommendation() {
  return {
    title: "Ordenar WhatsApp como parte del sistema operativo",
    immediate: "Crear etiquetas base para conversaciones: Nuevo lead, Cotización enviada, Seguimiento pendiente, Cliente dormido y Documento pendiente.",
    action72Hours: "Revisar conversaciones abiertas y asignar próxima acción a cada una.",
    action7Days: "Crear biblioteca de respuestas aprobadas para las 10 preguntas más frecuentes.",
    action30Days: "Conectar WhatsApp Business API o integrar canal mediante herramienta intermedia.",
    automation: "Crear alerta cuando una conversación no tenga respuesta en 2 horas o próxima acción en 24 horas.",
    script: baseScript,
    kpi: "conversaciones con responsable, estado y próxima acción.",
  };
}
