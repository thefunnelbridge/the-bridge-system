import type { AreaId } from "./types";

export const areaLabels: Record<AreaId, string> = {
  sales: "Ventas",
  marketing: "Marketing y comunicación",
  customer: "Atención al cliente",
  operations: "Operaciones",
  technology: "Tecnología y datos",
  team: "Equipo y cultura",
  leadership: "Liderazgo y toma de decisiones",
  experience: "Experiencia del cliente",
  aiReadiness: "Preparación IA",
  continuousImprovement: "Seguimiento y mejora continua",
};

export const areaMicrocopy: Record<AreaId, string> = {
  sales: "Mide velocidad, priorización, seguimiento y aprendizaje comercial.",
  marketing: "Evalúa consistencia de mensaje, campañas conectadas y datos compartidos.",
  customer: "Detecta si la atención depende de criterio individual o de un sistema vivo.",
  operations: "Revisa documentación, responsables, continuidad y cuellos de botella.",
  technology: "Mide centralización, gobierno de datos y automatizaciones reales.",
  team: "Observa entrenamiento, rituales, carga operativa y cultura de mejora.",
  leadership: "Conecta indicadores, decisiones, responsables y avance semanal.",
  experience: "Evalúa claridad, tiempos de espera, fricciones y seguimiento posterior.",
  aiReadiness: "Mide si hay datos, workflows y criterio humano antes de automatizar.",
  continuousImprovement: "Verifica si los aprendizajes se documentan y se convierten en implementación.",
};

export const scanQuestions: Record<AreaId, string[]> = {
  sales: [
    "¿Los leads se asignan a un responsable en menos de 15 minutos?",
    "¿Existe una secuencia documentada de seguimiento?",
    "¿Se mide conversión por canal?",
    "¿El equipo sabe qué leads priorizar?",
    "¿Se registran motivos de pérdida?",
  ],
  marketing: [
    "¿La propuesta de valor es clara y consistente?",
    "¿Los mensajes cambian según industria, servicio o etapa del cliente?",
    "¿Marketing y ventas comparten datos?",
    "¿Se mide qué campañas generan oportunidades reales?",
    "¿Existen mensajes base aprobados?",
  ],
  customer: [
    "¿Existe protocolo de primera respuesta?",
    "¿El tono se mantiene consistente entre personas?",
    "¿Se registran preguntas frecuentes?",
    "¿Hay seguimiento después de la atención?",
    "¿Se mide satisfacción o feedback?",
  ],
  operations: [
    "¿Los procesos críticos están documentados?",
    "¿Las tareas repetitivas están identificadas?",
    "¿Hay responsables por etapa?",
    "¿La operación puede funcionar si falta una persona clave?",
    "¿Existen tableros o sistemas de seguimiento?",
  ],
  technology: [
    "¿Los datos de clientes están centralizados?",
    "¿Las herramientas se conectan entre sí?",
    "¿Los datos se usan para decidir?",
    "¿Hay automatizaciones activas?",
    "¿Existe gobierno básico de datos?",
  ],
  team: [
    "¿El equipo entiende los objetivos?",
    "¿Hay rituales de revisión semanal?",
    "¿El equipo recibe entrenamiento?",
    "¿Las decisiones no dependen solo del líder?",
    "¿Existe cultura de mejora continua?",
  ],
  leadership: [
    "¿La dirección revisa indicadores clave semanalmente?",
    "¿Las prioridades se traducen en tareas?",
    "¿Hay dueño por iniciativa?",
    "¿Se mide avance de proyectos internos?",
    "¿Las decisiones tienen datos de respaldo?",
  ],
  experience: [
    "¿El cliente recibe claridad desde el primer contacto?",
    "¿El proceso de compra o atención está definido?",
    "¿Se reducen tiempos de espera?",
    "¿Se detectan fricciones recurrentes?",
    "¿Se hace seguimiento posterior?",
  ],
  aiReadiness: [
    "¿La empresa tiene datos ordenados para alimentar IA?",
    "¿Existen procesos claros antes de automatizar?",
    "¿El equipo sabe usar IA con criterio?",
    "¿Hay casos de uso priorizados?",
    "¿Existen límites, responsables y revisión humana?",
  ],
  continuousImprovement: [
    "¿Se revisan resultados periódicamente?",
    "¿Se documentan aprendizajes?",
    "¿Se corrigen procesos después de detectar errores?",
    "¿Se comparte feedback con el equipo?",
    "¿Hay un sistema para asegurar implementación?",
  ],
};

export const areaIds = Object.keys(areaLabels) as AreaId[];

export const scaleLabels = [
  "No existe",
  "Existe de forma informal",
  "Parcialmente implementado",
  "Estandarizado",
  "Medido y optimizado",
];
