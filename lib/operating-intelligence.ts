import type { CompanyProfile } from "./types";

export type OperatingPlaybook = {
  id: string;
  name: string;
  origin: string;
  principle: string;
  bridgeTranslation: string;
  liveMetric: string;
  dailyHabit: string;
  managerPrompt: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type LeadershipSignal = {
  text: string;
  attribution: string;
  sourceLabel: string;
  sourceUrl: string;
  bridgeUse: string;
};

export type DailyMission = {
  id: string;
  title: string;
  metric: string;
  target: string;
  owner: string;
  notification: string;
};

export const operatingPlaybooks: OperatingPlaybook[] = [
  {
    id: "toyota-kaizen",
    name: "Kaizen Loop",
    origin: "Principios públicos de mejora continua",
    principle: "Mejora continua, trabajo estandarizado y eliminación de desperdicio.",
    bridgeTranslation: "Cada fuga debe transformarse en una mejora pequeña, visible y revisada semanalmente.",
    liveMetric: "tareas implementadas / fugas repetidas",
    dailyHabit: "registrar una mejora pequeña antes del cierre del día",
    managerPrompt: "¿Qué fricción eliminamos hoy para que el equipo trabaje mejor mañana?",
    sourceLabel: "Public continuous improvement principles",
    sourceUrl: "https://global.toyota/en/company/vision-and-philosophy/production-system/",
  },
  {
    id: "toyota-jidoka",
    name: "Human-centered Automation",
    origin: "Principios públicos de automatización con criterio humano",
    principle: "Automatización con toque humano: detectar anomalías y detener el error antes de escalarlo.",
    bridgeTranslation: "La IA no reemplaza criterio: alerta, sugiere y obliga a revisar antes de automatizar caos.",
    liveMetric: "alertas críticas resueltas / alertas ignoradas",
    dailyHabit: "revisar una alerta y decidir si se corrige, documenta o automatiza",
    managerPrompt: "¿Dónde el sistema debe detenernos antes de seguir cometiendo el mismo error?",
    sourceLabel: "Public human-centered automation principles",
    sourceUrl: "https://www.toyota.es/historia-filosofia/filosofia/toyota-product-system",
  },
  {
    id: "service-profit-chain",
    name: "Service-Profit Chain",
    origin: "Principios públicos de service-profit chain",
    principle: "La calidad interna del servicio habilita satisfacción del equipo, valor al cliente y crecimiento.",
    bridgeTranslation: "No basta medir clientes; el sistema debe medir si el equipo tiene claridad, herramientas y entrenamiento.",
    liveMetric: "carga operativa / satisfacción cliente / avance de entrenamiento",
    dailyHabit: "preguntar qué bloqueo impide entregar mejor servicio hoy",
    managerPrompt: "¿Estamos pidiendo excelencia sin entregar sistema, claridad o entrenamiento?",
    sourceLabel: "Public service-profit chain research",
    sourceUrl: "https://hbr.org/1994/03/putting-the-service-profit-chain-to-work-2",
  },
  {
    id: "disney-service-standards",
    name: "Service Standards",
    origin: "Principios públicos de excelencia de servicio",
    principle: "El servicio se vuelve consistente cuando el equipo conoce estándares y propósito común.",
    bridgeTranslation: "Cada rol necesita criterios de atención visibles: seguridad, cortesía, inclusión, experiencia y eficiencia adaptadas al negocio.",
    liveMetric: "respuestas estandarizadas / feedback cliente / tiempos de espera",
    dailyHabit: "auditar una conversación real contra el estándar de servicio",
    managerPrompt: "¿Qué estándar de servicio debe ser obvio para cualquier colaborador nuevo?",
    sourceLabel: "Public service excellence principles",
    sourceUrl: "https://www.disneyinstitute.com/disneys-approach-quality-service/",
  },
  {
    id: "amazon-day-one",
    name: "Day 1 Operating Rhythm",
    origin: "Principios públicos de customer obsession",
    principle: "Obsesión por el cliente, decisiones veloces y rechazo a usar el proceso como excusa.",
    bridgeTranslation: "El proceso debe servir al cliente; si el proceso se cumple pero el cliente se pierde, hay fuga.",
    liveMetric: "decisiones tomadas / oportunidades sin respuesta / feedback cliente",
    dailyHabit: "tomar una decisión reversible rápido y medir su efecto",
    managerPrompt: "¿Qué proxy estamos confundiendo con resultado real?",
    sourceLabel: "Public customer obsession principles",
    sourceUrl: "https://www.aboutamazon.com/company-news/2016-letter-to-shareholders",
  },
  {
    id: "speed-to-lead",
    name: "Speed-to-Lead Discipline",
    origin: "Lead response research",
    principle: "La velocidad de respuesta es una señal crítica de intención y oportunidad.",
    bridgeTranslation: "Cada lead caliente debe tener SLA, responsable, alerta y próxima acción visible.",
    liveMetric: "tiempo primera respuesta / leads sin seguimiento / lead a reunión",
    dailyHabit: "revisar oportunidades sin contacto antes de mediodía",
    managerPrompt: "¿Qué oportunidad se enfrió por no tener dueño en los primeros minutos?",
    sourceLabel: "Public lead response research",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  {
    id: "deming-system",
    name: "System Before Blame",
    origin: "Principios públicos de calidad y sistemas",
    principle: "Los resultados son producto del sistema; mejorar exige entender cómo se mide y cómo fluye el trabajo.",
    bridgeTranslation: "Antes de culpar a una persona, el sistema pregunta qué proceso permitió la fuga.",
    liveMetric: "errores repetidos / procesos documentados / causas raíz",
    dailyHabit: "convertir un error repetido en regla, checklist o entrenamiento",
    managerPrompt: "¿Qué resultado estamos obteniendo porque el sistema lo permite?",
    sourceLabel: "Public quality improvement principles",
    sourceUrl: "https://www.ihi.org/insights/magic-every-system-perfectly-designed",
  },
];

export const leadershipSignals: LeadershipSignal[] = [
  {
    text: "La experiencia se construye con esfuerzo coordinado, no con héroes solitarios.",
    attribution: "Principio inspirado en excelencia de servicio",
    sourceLabel: "Public service excellence principles",
    sourceUrl: "https://thewaltdisneycompany.com/disney100-anniversary-cast-members/",
    bridgeUse: "Recordar que la experiencia se construye con equipo, no con héroes solitarios.",
  },
  {
    text: "La operación se mantiene viva cuando conserva velocidad, aprendizaje y foco en cliente.",
    attribution: "Principio inspirado en customer obsession",
    sourceLabel: "Public customer obsession principles",
    sourceUrl: "https://www.aboutamazon.com/company-news/2016-letter-to-shareholders",
    bridgeUse: "Evitar que procesos cómodos reemplacen aprendizaje, velocidad y cliente.",
  },
  {
    text: "Los resultados repetidos suelen revelar cómo está diseñado el sistema.",
    attribution: "Principio inspirado en mejora de sistemas",
    sourceLabel: "Public quality improvement principles",
    sourceUrl: "https://www.ihi.org/insights/magic-every-system-perfectly-designed",
    bridgeUse: "Tratar cada fuga como evidencia de diseño, no como accidente aislado.",
  },
  {
    text: "La estrategia solo vive cuando se traduce en hábitos claros y repetibles.",
    attribution: "Principio inspirado en liderazgo operativo",
    sourceLabel: "Public leadership principles",
    sourceUrl: "https://www.iawfonline.org/article/does-culture-really-eat-strategy-for-breakfast/",
    bridgeUse: "Diseñar hábitos diarios para que la estrategia sobreviva a la operación.",
  },
];

export function getDailyMissions(company: CompanyProfile): DailyMission[] {
  if (company.industry === "Corredores de propiedades / Brokerage inmobiliario") {
    return [
      {
        id: "broker-mission-1",
        title: "Cero compradores calientes sin próxima acción",
        metric: "compradores sin próxima acción",
        target: "0 al cierre del día",
        owner: "líder de oficina",
        notification: "Revisa leads compradores sin clasificación antes de las 12:00.",
      },
      {
        id: "broker-mission-2",
        title: "Seguimiento post visita documentado",
        metric: "visitas sin seguimiento",
        target: "menos de 10%",
        owner: "corredor asignado",
        notification: "Hay visitas recientes que necesitan retoma humana hoy.",
      },
      {
        id: "broker-mission-3",
        title: "Propiedades sin movimiento a revisión",
        metric: "propiedades sin movimiento 14 días",
        target: "100% revisadas semanalmente",
        owner: "líder de oficina",
        notification: "Selecciona 3 propiedades sin movimiento y define nuevo plan comercial.",
      },
    ];
  }

  return [
    {
      id: "mission-1",
      title: "Responder oportunidades calientes",
      metric: "leads sin primer contacto",
      target: "menos de 15 minutos",
      owner: "ventas / atención",
      notification: "Revisa oportunidades nuevas y asigna responsable ahora.",
    },
    {
      id: "mission-2",
      title: "Cerrar el día con próximas acciones",
      metric: "oportunidades sin próxima acción",
      target: "0 críticas abiertas",
      owner: "responsable de área",
      notification: "Antes de cerrar el día, deja cada oportunidad crítica con siguiente paso.",
    },
    {
      id: "mission-3",
      title: "Una mejora pequeña documentada",
      metric: "mejoras registradas",
      target: "1 por equipo al día",
      owner: "líder operativo",
      notification: "Registra una fricción eliminada o un aprendizaje útil.",
    },
  ];
}
