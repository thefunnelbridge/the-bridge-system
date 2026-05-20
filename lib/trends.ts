import type { CompanyProfile, DemoIndustry } from "./types";

export type BridgeTrend = {
  id: string;
  industries: DemoIndustry[];
  title: string;
  externalSignal: string;
  meaning: string;
  recommendedAction: string;
  suggestedChannel: string;
  suggestedTool: string;
  kpi: string;
  urgency: "Alta" | "Media/Alta" | "Media";
  impact: "Alto" | "Medio/Alto" | "Medio";
};

export const bridgeTrends: BridgeTrend[] = [
  {
    id: "auto-financing-intent",
    industries: ["Automotora"],
    title: "Leads de financiamiento necesitan mensajes separados",
    externalSignal: "El cliente que pregunta por financiamiento suele estar comparando viabilidad, no solo precio.",
    meaning: "No debería recibir el mismo mensaje que alguien que solo pide una cotización rápida por modelo.",
    recommendedAction: "Crear script específico de financiamiento, asignar responsable y medir respuesta en 24 horas.",
    suggestedChannel: "WhatsApp + CRM",
    suggestedTool: "CRM con etapa de intención financiera",
    kpi: "cotización a conversación financiera",
    urgency: "Alta",
    impact: "Alto",
  },
  {
    id: "clinic-digital-front-door",
    industries: ["Clínica / salud / estética / dental"],
    title: "La primera respuesta funciona como puerta digital de atención",
    externalSignal: "Pacientes comparan claridad, velocidad y confianza antes de agendar.",
    meaning: "WhatsApp saturado no es solo un problema operativo: afecta agenda, no-shows y percepción de cuidado.",
    recommendedAction: "Separar consultas nuevas, confirmaciones, postconsulta y seguimiento pendiente con mensajes base.",
    suggestedChannel: "WhatsApp + calendario",
    suggestedTool: "Agenda digital con recordatorios",
    kpi: "consulta a agenda y no-show",
    urgency: "Alta",
    impact: "Alto",
  },
  {
    id: "construction-project-traceability",
    industries: ["Construcción / Inmobiliaria"],
    title: "Los leads por proyecto requieren trazabilidad por etapa",
    externalSignal: "Los ciclos largos aumentan la pérdida de contexto entre consulta, financiamiento, visita y reserva.",
    meaning: "Más leads no corrigen la fuga si no existe seguimiento por proyecto, disponibilidad y etapa.",
    recommendedAction: "Crear tablero por proyecto con SLA, etapa, responsable y próxima acción.",
    suggestedChannel: "Portales + WhatsApp + tablero comercial",
    suggestedTool: "CRM o planilla estructurada por proyecto",
    kpi: "lead a visita y visita a reserva",
    urgency: "Media/Alta",
    impact: "Alto",
  },
  {
    id: "brokerage-agent-habits",
    industries: ["Corredores de propiedades / Brokerage inmobiliario"],
    title: "El desempeño de corretaje depende de hábitos comerciales visibles",
    externalSignal: "Redes de agentes pierden oportunidades cuando cada corredor opera con memoria y agenda personal.",
    meaning: "La ventaja no es controlar al corredor; es hacer visible respuesta, clasificación, visitas, ofertas y retomas.",
    recommendedAction: "Instalar revisión semanal de oportunidades dormidas por oficina y corredor.",
    suggestedChannel: "CRM inmobiliario + WhatsApp",
    suggestedTool: "Dashboard por oficina",
    kpi: "oportunidades dormidas 7/14/30 días",
    urgency: "Alta",
    impact: "Alto",
  },
  {
    id: "smb-owner-dependency",
    industries: ["Pyme local"],
    title: "La dueña o dueño no puede seguir siendo el sistema",
    externalSignal: "Negocios locales pierden recompra cuando ventas, atención, cobro y marketing viven en una sola cabeza.",
    meaning: "La primera automatización útil suele ser una base simple de clientes y una rutina de seguimiento.",
    recommendedAction: "Crear base mínima de clientes y calendario de retoma semanal.",
    suggestedChannel: "WhatsApp + planilla",
    suggestedTool: "Google Sheets estructurado",
    kpi: "recompra y consultas respondidas",
    urgency: "Media/Alta",
    impact: "Medio/Alto",
  },
  {
    id: "legal-intake-clarity",
    industries: ["Legal"],
    title: "El intake legal debe clasificar urgencia y documentos desde el inicio",
    externalSignal: "Consultas urgentes pierden calidad cuando se piden antecedentes tarde o sin checklist claro.",
    meaning: "El primer contacto debe ordenar tipo de caso, urgencia, documentos y próximo paso.",
    recommendedAction: "Crear formulario de intake y checklist por área legal.",
    suggestedChannel: "Web + WhatsApp + email",
    suggestedTool: "Formulario con automatización simple",
    kpi: "consulta a reunión y documentos completos",
    urgency: "Alta",
    impact: "Medio/Alto",
  },
  {
    id: "education-follow-up",
    industries: ["Educación"],
    title: "Postulantes y apoderados necesitan claridad de siguiente paso",
    externalSignal: "La decisión educativa combina confianza, información y seguimiento oportuno.",
    meaning: "Una consulta sin ruta clara puede transformarse en matrícula perdida.",
    recommendedAction: "Estandarizar etapas de admisión, documentos, visita y seguimiento.",
    suggestedChannel: "Email + WhatsApp + CRM admisión",
    suggestedTool: "Tablero de admisiones",
    kpi: "consulta a visita y visita a matrícula",
    urgency: "Media",
    impact: "Medio/Alto",
  },
  {
    id: "wellness-retention",
    industries: ["Gimnasio / wellness"],
    title: "Retención depende de hábitos, seguimiento y señales tempranas",
    externalSignal: "Clientes wellness abandonan cuando no sienten avance, acompañamiento o rutina clara.",
    meaning: "La oportunidad no está solo en vender planes, sino en detectar riesgo de abandono.",
    recommendedAction: "Crear alertas para inactividad, seguimiento de objetivos y microfeedback.",
    suggestedChannel: "App + WhatsApp + recepción",
    suggestedTool: "CRM liviano de miembros",
    kpi: "asistencia semanal y retención",
    urgency: "Media",
    impact: "Medio/Alto",
  },
  {
    id: "retail-repurchase",
    industries: ["Retail / e-commerce"],
    title: "La recompra necesita calendario y segmentación simple",
    externalSignal: "Clientes que compraron antes suelen responder mejor a mensajes oportunos que a promociones genéricas.",
    meaning: "Promocionar sin seguimiento ni base segmentada reduce aprendizaje comercial.",
    recommendedAction: "Separar clientes nuevos, recurrentes y dormidos con campañas de retoma.",
    suggestedChannel: "Email + WhatsApp + ecommerce",
    suggestedTool: "Segmentación en CRM o planilla",
    kpi: "recompra y venta por campaña",
    urgency: "Media",
    impact: "Medio/Alto",
  },
  {
    id: "multi-branch-standardization",
    industries: ["Municipalidad / institución pública", "Logística", "Hotelería / turismo", "Energía / estaciones de servicio / conveniencia"],
    title: "Empresas con múltiples puntos necesitan estándares visibles",
    externalSignal: "Cuando hay sucursales o equipos distribuidos, la experiencia se fragmenta si cada punto opera distinto.",
    meaning: "La dirección necesita leer fricciones por punto, responsable y proceso, no solo por resultado final.",
    recommendedAction: "Crear estándar operativo mínimo, tablero por punto y ritual semanal de seguimiento.",
    suggestedChannel: "Tablero interno + mensajería operacional",
    suggestedTool: "Dashboard multi-sucursal",
    kpi: "cumplimiento estándar y bloqueos por punto",
    urgency: "Media/Alta",
    impact: "Alto",
  },
];

const generalTrends: BridgeTrend[] = [
  {
    id: "ai-ready-context",
    industries: ["Construcción / Inmobiliaria", "Automotora", "Clínica / salud / estética / dental", "Legal", "Pyme local", "Corredores de propiedades / Brokerage inmobiliario", "Educación", "Municipalidad / institución pública", "Retail / e-commerce", "Logística", "Hotelería / turismo", "Gimnasio / wellness", "Energía / estaciones de servicio / conveniencia"],
    title: "IA útil requiere operación visible antes de automatizar",
    externalSignal: "Las empresas están adoptando IA, pero muchas aún no tienen datos, responsables y workflows suficientemente claros.",
    meaning: "La IA puede acelerar el caos si el proceso base no está ordenado.",
    recommendedAction: "Elegir un caso de uso, definir datos mínimos, responsable y revisión humana.",
    suggestedChannel: "Data Room + Paula Engine™",
    suggestedTool: "Bridge Brain™ AI-ready layer",
    kpi: "AI Readiness y procesos documentados",
    urgency: "Media/Alta",
    impact: "Alto",
  },
];

export function getTrendsForCompany(company: CompanyProfile) {
  return [...bridgeTrends.filter((trend) => trend.industries.includes(company.industry)), ...generalTrends];
}

export function getPrimaryTrend(company: CompanyProfile) {
  return getTrendsForCompany(company)[0] ?? generalTrends[0];
}
