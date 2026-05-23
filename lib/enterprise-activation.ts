import type { CompanyProfile } from "./types";

export type SetupUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  status: "Invitación pendiente" | "Activo demo" | "Por crear";
};

export const roleBlueprints = [
  {
    role: "Owner / Dirección",
    permissions: ["billing", "reportes", "usuarios", "configuración", "datos completos"],
    description: "Ve el estado completo de la empresa, decide prioridades y aprueba integraciones.",
  },
  {
    role: "Admin de operación",
    permissions: ["data room", "inbox", "pulse", "flow", "tracker", "usuarios operativos"],
    description: "Mantiene el sistema vivo, revisa alertas y coordina responsables.",
  },
  {
    role: "Líder de área / sucursal",
    permissions: ["equipo", "tareas", "metas", "reportes de área", "academy"],
    description: "Gestiona misiones, bloqueos, hábitos y avances de su equipo.",
  },
  {
    role: "Colaborador / Worker",
    permissions: ["mis tareas", "mis metas", "mis conversaciones", "microlecciones", "reportar bloqueo"],
    description: "Ejecuta su foco diario sin ver información estratégica sensible.",
  },
  {
    role: "Integraciones / TI",
    permissions: ["webhooks", "tokens", "logs técnicos", "integraciones", "seguridad"],
    description: "Configura accesos técnicos con Vercel, Supabase, WhatsApp, CRM y OpenAI.",
  },
  {
    role: "Finanzas",
    permissions: ["billing", "facturación", "estado de suscripción"],
    description: "Gestiona pagos, suscripción y datos comerciales del contrato.",
  },
];

export const whatsappConnectionChecklist = [
  "Confirmar si la empresa usará número actual o número nuevo.",
  "Validar Meta Business Manager y WhatsApp Business Account.",
  "Obtener phone_number_id del número conectado a Cloud API.",
  "Crear access token seguro y guardarlo solo como variable de entorno.",
  "Configurar webhook HTTPS de The Bridge System™.",
  "Verificar webhook con token de verificación.",
  "Suscribir eventos de mensajes entrantes y estados.",
  "Crear plantillas aprobadas para seguimiento, confirmación y documentos.",
  "Definir reglas de Bridge Inbox™: responsable, estado, prioridad y próxima acción.",
  "Hacer prueba con 5 conversaciones antes de producción.",
];

export const crmConnectionChecklist = [
  "Definir cuál es la fuente de verdad: CRM, planilla, ERP o WhatsApp.",
  "Mapear objetos: lead, cliente, oportunidad, tarea, actividad y responsable.",
  "Definir campos mínimos obligatorios para The Bridge System™.",
  "Crear importación inicial o webhook de eventos.",
  "Mapear etapas actuales con estados Bridge Flow™.",
  "Probar lectura de 20 registros reales.",
  "Activar alertas de oportunidad sin próxima acción.",
];

export const enterpriseImplementationTimeline = [
  {
    day: "Día 0",
    title: "Preparación de acceso",
    detail: "Definir owner, admin operativo, responsable TI, responsable comercial y alcance de datos.",
  },
  {
    day: "Día 1",
    title: "Carga de contexto",
    detail: "Completar empresa, industria, roles, canales, Data Room e Inbox demo con datos reales mínimos.",
  },
  {
    day: "Día 2",
    title: "Bridge Scan™",
    detail: "Ejecutar diagnóstico con dirección y líderes de área para detectar fugas prioritarias.",
  },
  {
    day: "Día 3",
    title: "Primer Bridge Flow™",
    detail: "Convertir fugas en tareas, responsables, KPI, fechas y microlecciones.",
  },
  {
    day: "Día 4",
    title: "Workers y cultura",
    detail: "Activar vista diaria para colaboradores, bloqueo, claridad y microentrenamiento.",
  },
  {
    day: "Día 5",
    title: "Integraciones iniciales",
    detail: "Conectar WhatsApp/CRM/Sheets según factibilidad técnica y privacidad.",
  },
  {
    day: "Día 7",
    title: "Reporte ejecutivo",
    detail: "Presentar hallazgos, uso diario, primeras acciones y roadmap de integración real.",
  },
];

export const clientAccessRequestList = [
  "Dominio o URL donde se instalará The Bridge System™.",
  "Correos de dirección, admin operativo, TI, líderes y colaboradores piloto.",
  "Lista de sucursales, oficinas, áreas o unidades de negocio.",
  "Canales actuales: WhatsApp, CRM, formularios, email, Ads, llamadas.",
  "Acceso o exportación de datos iniciales: leads, oportunidades, tareas, agenda o conversaciones.",
  "Responsable legal/privacidad para aprobar uso de datos.",
  "Contacto de facturación para Stripe.",
];

export const mondayEnterpriseKickoffList = [
  "Definir sponsor ejecutivo y dueño operativo del piloto.",
  "Elegir 1 unidad inicial: sucursal, área comercial, proyecto, clínica, oficina o equipo.",
  "Seleccionar 5 a 20 usuarios piloto con roles claros.",
  "Confirmar qué canal se ordenará primero: WhatsApp, CRM, formulario, email o planilla.",
  "Cargar una muestra real de 30 a 100 oportunidades o conversaciones.",
  "Ejecutar Bridge Scan™ con dirección y líderes.",
  "Activar 3 misiones iniciales en Bridge Flow™.",
  "Definir meta diaria visible para Workers.",
  "Acordar reporte ejecutivo semanal.",
  "Dejar fecha para integración técnica real.",
];

export const stripeProductionChecklist = [
  "Crear producto en Stripe: The Bridge System™ Enterprise.",
  "Crear Price ID mensual o anual según plan comercial.",
  "Configurar STRIPE_SECRET_KEY en Vercel.",
  "Configurar STRIPE_PRICE_ID_ENTERPRISE en Vercel.",
  "Configurar NEXT_PUBLIC_APP_URL con el dominio final.",
  "Activar webhook de Stripe para checkout.session.completed.",
  "Guardar customerId y subscriptionId en Supabase organizations.",
  "Bloquear acceso si la suscripción queda impaga o cancelada.",
];

export const productionEnvironmentChecklist = [
  "Conectar repositorio GitHub a Vercel.",
  "Configurar variables Supabase, Stripe, WhatsApp y OpenAI server-side.",
  "Crear proyecto Supabase y ejecutar schema SQL.",
  "Configurar dominio del cliente o subdominio de The Funnel Bridge.",
  "Activar Supabase Auth para usuarios reales.",
  "Crear organización inicial y usuario owner.",
  "Verificar build de producción en Vercel.",
  "Probar login, checkout, Data Room, Inbox, Pulse, Workers y Report.",
];

export const connectorAccessMatrix = [
  {
    connector: "WhatsApp Business Platform",
    access: "Meta Business Manager, WhatsApp Business Account, phone_number_id, token y webhook verification token.",
    owner: "TI / Marketing / proveedor Meta",
  },
  {
    connector: "CRM",
    access: "API key, export CSV o permisos de lectura para leads, oportunidades, tareas y responsables.",
    owner: "Gerencia comercial / TI",
  },
  {
    connector: "Google Sheets / Drive",
    access: "Archivo fuente, estructura de columnas, carpeta de documentos y permisos de servicio.",
    owner: "Operaciones / Administración",
  },
  {
    connector: "Stripe",
    access: "Cuenta Stripe activa, Price ID, clave secreta, webhook signing secret y email de facturación.",
    owner: "Finanzas / Dirección",
  },
  {
    connector: "Supabase",
    access: "Proyecto, URL, anon key, service role key, schema y políticas RLS.",
    owner: "Implementación técnica",
  },
];

export function getDefaultLocations(company: CompanyProfile) {
  if (company.industry === "Corredores de propiedades / Brokerage inmobiliario") {
    return ["Oficina Santiago", "Oficina Temuco", "Oficina Concepción", "Oficina Puerto Montt"];
  }
  if (company.industry === "Construcción / Inmobiliaria") {
    return ["Proyecto principal", "Sala de ventas", "Administración comercial"];
  }
  if (company.industry === "Automotora") {
    return ["Sucursal ventas", "Financiamiento", "Servicio técnico"];
  }
  if (company.industry === "Clínica / salud / estética / dental" || company.industry === "Salón de belleza / estética grande") {
    return ["Recepción", "Agenda", "Equipo profesional", "Administración"];
  }
  if (company.industry === "Negocio unipersonal / solopreneur") {
    return ["Operación personal"];
  }
  return [company.city || "Casa matriz", "Ventas", "Operación"];
}

export function getDefaultSetupUsers(company: CompanyProfile, roles: string[]) {
  const locations = getDefaultLocations(company);
  const baseRoles = roles.length ? roles : company.team;
  return baseRoles.slice(0, 5).map((role, index): SetupUser => ({
    id: `setup-user-${index}`,
    name: index === 0 ? "Dirección" : role,
    email: index === 0 ? "direccion@empresa.cl" : `${role.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@empresa.cl`,
    role,
    location: locations[index % locations.length],
    status: index === 0 ? "Activo demo" : "Invitación pendiente",
  }));
}
