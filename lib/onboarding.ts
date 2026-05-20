import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ClipboardList,
  Compass,
  Database,
  FileText,
  GitBranch,
  Inbox,
  Radio,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BridgeLayerGuide = {
  id: string;
  name: string;
  route: string;
  icon: LucideIcon;
  simple: string;
  whyItMatters: string;
  whatToDo: string;
  output: string;
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  route: string;
  duration: string;
};

export const bridgeLayerGuides: BridgeLayerGuide[] = [
  {
    id: "data-room",
    name: "Data Room",
    route: "/app/data-room",
    icon: Database,
    simple: "Aquí cargas o editas la información de tu empresa.",
    whyItMatters: "Si el sistema no conoce tus canales, procesos, datos y fricciones, solo puede adivinar.",
    whatToDo: "Revisa leads, ventas, comunicación, operación, equipo, archivos y benchmarks.",
    output: "Contexto real para que Scan, Insight, Pulse y Flow sean más precisos.",
  },
  {
    id: "inbox",
    name: "Bridge Inbox™",
    route: "/app/inbox",
    icon: Inbox,
    simple: "Aquí se ordena el caos de WhatsApp, emails, formularios y chats.",
    whyItMatters: "El cliente no debería perderse dentro de una conversación ni depender de memoria humana.",
    whatToDo: "Asigna responsable, estado, archivo y próxima acción a cada conversación relevante.",
    output: "Oportunidades accionables, scripts sugeridos y alertas de seguimiento.",
  },
  {
    id: "trends",
    name: "Bridge Trends™",
    route: "/app/trends",
    icon: TrendingUp,
    simple: "Aquí ves señales externas aplicadas a tu industria.",
    whyItMatters: "La operación no vive aislada: cambian canales, clientes, herramientas y comportamientos.",
    whatToDo: "Lee la tendencia principal y convierte una señal externa en una acción concreta.",
    output: "Acciones recomendadas por industria, KPI, urgencia e impacto.",
  },
  {
    id: "scan",
    name: "Bridge Scan™",
    route: "/app/scan",
    icon: ClipboardList,
    simple: "Aquí respondes preguntas para medir la madurez real de tu operación.",
    whyItMatters: "No se puede mejorar lo que no está visible.",
    whatToDo: "Contesta cada área con honestidad: ventas, datos, equipo, IA, conversaciones y mejora continua.",
    output: "Bridge Score™, scores por área y puntos de fuga detectados.",
  },
  {
    id: "insight",
    name: "Bridge Insight™",
    route: "/app/insight",
    icon: BarChart3,
    simple: "Aquí el sistema interpreta qué significan los datos.",
    whyItMatters: "Un dashboard solo muestra números. Insight explica riesgos, oportunidades y prioridades.",
    whatToDo: "Revisa score, fugas, matriz impacto/urgencia, AI readiness, dependencia humana y benchmarks.",
    output: "Diagnóstico ejecutivo y lectura de lo que debe priorizarse.",
  },
  {
    id: "pulse",
    name: "Bridge Pulse™",
    route: "/app/pulse",
    icon: Radio,
    simple: "Aquí ves qué está pasando hoy.",
    whyItMatters: "Una empresa no mejora con reportes mensuales solamente. También necesita foco diario.",
    whatToDo: "Mira metas, alertas, conversaciones críticas, bloqueos, notificaciones y próxima mejor acción.",
    output: "Pulso operativo del día y acciones antes de las 17:00.",
  },
  {
    id: "flow",
    name: "Bridge Flow™",
    route: "/app/flow",
    icon: GitBranch,
    simple: "Aquí el diagnóstico se convierte en acciones.",
    whyItMatters: "Detectar fugas sirve poco si no termina en responsables, fechas y KPIs.",
    whatToDo: "Agrega recomendaciones al tracker y transforma ideas en tareas medibles.",
    output: "Plan 72 horas, 7 días, 30 días, automatizaciones y scripts.",
  },
  {
    id: "companion",
    name: "Bridge Companion™",
    route: "/app/pulse",
    icon: Sparkles,
    simple: "Es la guía que dice cuál es la próxima mejor acción.",
    whyItMatters: "La operación diaria necesita claridad, no solo más información.",
    whatToDo: "Usa sus mensajes para dirección, líderes y trabajadores.",
    output: "Foco diario, guía para equipos y recomendaciones contextuales.",
  },
  {
    id: "culture",
    name: "Workers + Bridge Culture™",
    route: "/app/team",
    icon: Users,
    simple: "Aquí el sistema baja al equipo, roles, hábitos y bloqueos.",
    whyItMatters: "La transformación falla cuando la gente no entiende qué debe hacer distinto.",
    whatToDo: "Revisa roles, carga operativa, ritual semanal y riesgos culturales.",
    output: "Equipo más alineado, menos dependencia de memoria y más claridad operativa.",
  },
  {
    id: "academy",
    name: "Bridge Academy™",
    route: "/app/academy",
    icon: BookOpen,
    simple: "Aquí el equipo aprende justo lo que necesita para cerrar fugas reales.",
    whyItMatters: "La capacitación genérica se olvida. La microlección conectada con una fuga se implementa.",
    whatToDo: "Completa microentrenamientos según las fugas detectadas.",
    output: "Adopción interna, mejores respuestas y cultura de mejora continua.",
  },
  {
    id: "notifications",
    name: "Notifications",
    route: "/app/pulse",
    icon: Bell,
    simple: "Son alertas simuladas que muestran qué requiere atención.",
    whyItMatters: "La próxima acción no debería depender de que alguien se acuerde.",
    whatToDo: "Lee, marca como resuelta y convierte alertas importantes en acción.",
    output: "Menos tareas dormidas, más claridad y seguimiento diario.",
  },
  {
    id: "paula-engine",
    name: "Paula Engine™",
    route: "/app/paula-engine",
    icon: Brain,
    simple: "Es el motor estratégico que separa síntoma de causa.",
    whyItMatters: "No todo problema se resuelve con más herramientas. A veces falta ordenar el puente.",
    whatToDo: "Revisa decisiones recomendadas, scripts, preguntas de dirección y plan 72h.",
    output: "Criterio estratégico, mensajes y decisiones accionables.",
  },
  {
    id: "report",
    name: "Executive Report",
    route: "/app/report",
    icon: FileText,
    simple: "Aquí se arma el informe para dirección.",
    whyItMatters: "Dirección necesita entender avances, riesgos y próximos pasos sin navegar toda la app.",
    whatToDo: "Exporta PDF, copia resumen o descarga JSON demo.",
    output: "Reporte ejecutivo imprimible y vendible.",
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "understand",
    title: "Entiende el sistema",
    description: "Lee la introducción rápida: qué es, para qué sirve y qué no reemplaza.",
    route: "/app/intro",
    duration: "3 min",
  },
  {
    id: "company",
    title: "Configura la empresa",
    description: "Revisa la empresa demo o crea contexto real en perfil y Data Room.",
    route: "/app/company",
    duration: "8 min",
  },
  {
    id: "inbox",
    title: "Ordena conversaciones",
    description: "Convierte WhatsApp y mensajes dispersos en responsables y próximas acciones.",
    route: "/app/inbox",
    duration: "7 min",
  },
  {
    id: "scan",
    title: "Completa el Bridge Scan™",
    description: "Responde el diagnóstico para detectar fugas, madurez y preparación IA.",
    route: "/app/scan",
    duration: "12 min",
  },
  {
    id: "insight",
    title: "Lee el Insight",
    description: "Revisa qué significa el score y cuáles son las fugas prioritarias.",
    route: "/app/insight",
    duration: "5 min",
  },
  {
    id: "flow",
    title: "Activa el Flow",
    description: "Agrega acciones al tracker y define responsables, KPI y horizonte.",
    route: "/app/flow",
    duration: "10 min",
  },
  {
    id: "pulse",
    title: "Usa Pulse todos los días",
    description: "Revisa metas, alertas, bloqueos y próxima mejor acción antes de las 17:00.",
    route: "/app/pulse",
    duration: "4 min/día",
  },
];

export function getLayerByRoute(route: string) {
  return bridgeLayerGuides.find((layer) => route === layer.route || route.startsWith(`${layer.route}/`));
}

export const introNarrative = [
  {
    title: "No es una landing",
    text: "Es un sistema operativo demo: cada módulo existe para transformar información dispersa en claridad, decisiones y ejecución.",
  },
  {
    title: "No reemplaza herramientas",
    text: "Se pone encima de WhatsApp, CRM, planillas, formularios y reportes para ordenar señales y convertirlas en acción.",
  },
  {
    title: "No se usa una sola vez",
    text: "Data Room alimenta el contexto, Scan mide madurez, Pulse muestra el día, Flow crea tareas y Academy entrena al equipo.",
  },
];
