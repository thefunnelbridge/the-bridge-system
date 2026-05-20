import type { AreaId } from "./types";

export const areaLabels: Record<AreaId, string> = {
  sales: "Ventas",
  marketing: "Marketing y comunicación",
  customer: "Atención al cliente",
  operations: "Operaciones",
  technology: "Tecnología y datos",
  team: "Equipo y cultura",
};

export const scanQuestions: Record<AreaId, string[]> = {
  sales: [
    "¿La empresa responde nuevos leads en menos de 15 minutos?",
    "¿Existe un proceso documentado de seguimiento comercial?",
    "¿Cada oportunidad tiene un responsable asignado?",
    "¿El equipo sabe qué leads priorizar?",
    "¿Se mide la tasa de cierre por canal?",
  ],
  marketing: [
    "¿La propuesta de valor está claramente definida?",
    "¿Los mensajes son consistentes entre web, redes, WhatsApp y vendedores?",
    "¿Existe contenido diseñado para educar y preparar al cliente?",
    "¿Las campañas están conectadas con un proceso comercial?",
    "¿La empresa mide qué mensajes generan más oportunidades?",
  ],
  customer: [
    "¿Existe un protocolo claro de primera respuesta?",
    "¿El equipo usa mensajes estandarizados sin perder humanidad?",
    "¿Se registran preguntas frecuentes y objeciones?",
    "¿Se hace seguimiento después de una consulta o atención?",
    "¿La experiencia del cliente es consistente entre canales?",
  ],
  operations: [
    "¿Los procesos críticos están documentados?",
    "¿Las tareas repetitivas están identificadas?",
    "¿El equipo sabe qué hacer sin depender de una sola persona?",
    "¿Existen responsables claros por etapa del proceso?",
    "¿La operación puede crecer sin aumentar el caos?",
  ],
  technology: [
    "¿La empresa centraliza la información de clientes y oportunidades?",
    "¿Usa herramientas digitales conectadas entre sí?",
    "¿Tiene datos confiables para tomar decisiones?",
    "¿Existe alguna automatización activa?",
    "¿La empresa está preparada para integrar IA de forma práctica?",
  ],
  team: [
    "¿El equipo entiende los objetivos comerciales?",
    "¿Existen reuniones o revisiones de mejora periódicas?",
    "¿El equipo recibe entrenamiento para mejorar atención y ventas?",
    "¿Las decisiones no dependen solo de la memoria del líder?",
    "¿Existe una cultura de seguimiento, medición y aprendizaje?",
  ],
};

export const areaIds = Object.keys(areaLabels) as AreaId[];

export const scaleLabels = [
  "Nunca / No existe",
  "Muy poco",
  "Parcialmente",
  "Casi siempre",
  "Sí, sistematizado",
];
