export const productionModules = [
  {
    name: "Supabase Auth",
    status: "ready",
    description: "Login, recuperación de acceso y sesión por usuario.",
  },
  {
    name: "Multiempresa",
    status: "ready",
    description: "Estructura preparada para separar datos por organización.",
  },
  {
    name: "Roles y permisos",
    status: "ready",
    description: "Owner, admin, manager y worker para controlar acceso por capa.",
  },
  {
    name: "Billing",
    status: "stripe-ready",
    description: "Checkout de Stripe preparado para suscripción enterprise.",
  },
  {
    name: "Auditoría",
    status: "ready",
    description: "Eventos clave del sistema listos para guardarse por empresa.",
  },
  {
    name: "OpenAI server-side",
    status: "planned",
    description: "Bridge Brain™ debe conectarse desde API routes, nunca desde cliente.",
  },
] as const;

export const paidPilotChecklist = [
  "Crear proyecto Supabase y cargar schema SQL.",
  "Configurar variables de entorno en Vercel.",
  "Crear primera organización real.",
  "Invitar usuario owner de la empresa.",
  "Activar suscripción enterprise en Stripe.",
  "Cargar Data Room inicial con datos reales del cliente.",
  "Ejecutar Bridge Scan™ asistido.",
  "Generar Executive Report y plan de 30 días.",
];

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID_ENTERPRISE);
}

export const enterpriseInstallationSteps = [
  {
    title: "Crear organización",
    detail: "Registrar empresa, industria, unidades, sucursales, líderes y usuarios.",
  },
  {
    title: "Instalar Data Room",
    detail: "Cargar procesos, canales, métricas, herramientas, tareas, archivos y fricciones.",
  },
  {
    title: "Ejecutar Bridge Scan™",
    detail: "Diagnosticar madurez, fugas, dependencia humana, AI readiness y urgencia.",
  },
  {
    title: "Activar Bridge Pulse™",
    detail: "Definir metas diarias, alertas, próximas acciones y responsables.",
  },
  {
    title: "Asignar Workers",
    detail: "Crear misiones por rol, microlecciones y ritual semanal de operación.",
  },
  {
    title: "Configurar billing",
    detail: "Activar suscripción enterprise y estado de cuenta con Stripe.",
  },
  {
    title: "Entregar Executive Report",
    detail: "Presentar diagnóstico, plan de 7/30 días, riesgos y decisiones recomendadas.",
  },
];
