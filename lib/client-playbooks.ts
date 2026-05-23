import type { DemoIndustry } from "./types";

export type ClientPlaybook = {
  industry: DemoIndustry | "Empresa con sucursales";
  buyerLanguage: string;
  installationPromise: string;
  firstConversation: string;
  minimumData: string[];
  rolesToInvite: string[];
  first72Hours: string[];
  liveGoals: string[];
  executiveKPIs: string[];
  workerInputs: string[];
  proofMoment: string;
};

export const clientPlaybooks: ClientPlaybook[] = [
  {
    industry: "Automotora",
    buyerLanguage: "Para automotoras, concesionarios y grupos con ventas, financiamiento, servicio técnico y sucursales.",
    installationPromise: "Ordenar leads por intención, asignar vendedor rápido y hacer visible cada cotización, financiamiento, permuta, test drive y cierre.",
    firstConversation: "Hoy no buscamos cambiar tu CRM. Buscamos que ningún lead caliente quede sin vendedor, intención y próxima acción.",
    minimumData: ["Leads últimos 30 días", "Modelos consultados", "Vendedores", "Financiamientos", "Test drives", "Motivos de pérdida"],
    rolesToInvite: ["Gerencia comercial", "Jefe de ventas", "Vendedores", "Financiamiento", "Marketing", "Servicio técnico"],
    first72Hours: [
      "Separar leads por intención: cotización, financiamiento, permuta, flota, test drive.",
      "Crear SLA de asignación en menos de 10 minutos.",
      "Cargar 100 leads reales o una exportación del CRM.",
      "Activar misión diaria: revisar leads sin próxima acción.",
    ],
    liveGoals: ["Asignar 100% de leads nuevos", "Agendar test drive para leads calientes", "Retomar financiamientos pendientes"],
    executiveKPIs: ["Tiempo de primera respuesta", "Cotización a test drive", "Test drive a cierre", "Leads por vendedor", "Oportunidades dormidas"],
    workerInputs: ["Leads respondidos", "Cotizaciones enviadas", "Test drives agendados", "Documentos de financiamiento pendientes"],
    proofMoment: "El cliente ve en 15 minutos cuántos leads están vivos, quién los tomó y qué próxima acción falta.",
  },
  {
    industry: "Corredores de propiedades / Brokerage inmobiliario",
    buyerLanguage: "Para redes de corredores, oficinas regionales, franquicias, líderes de oficina y equipos de agentes.",
    installationPromise: "Transformar hábitos individuales en pipeline visible por oficina, corredor, comprador, propietario, visita, oferta y cierre.",
    firstConversation: "La red no necesita más presión sobre corredores: necesita visibilidad sobre qué pasa después del primer contacto.",
    minimumData: ["Compradores", "Propietarios", "Corredores", "Oficinas", "Visitas", "Ofertas", "Propiedades sin movimiento"],
    rolesToInvite: ["Dirección nacional", "Líderes de oficina", "Corredores", "Asistentes comerciales", "Marketing", "Administración"],
    first72Hours: [
      "Clasificar últimos 100 compradores por presupuesto, comuna, urgencia y tipo de propiedad.",
      "Detectar propietarios sin seguimiento post tasación.",
      "Crear tablero de oportunidades dormidas por corredor y oficina.",
      "Activar ritual semanal de pipeline inmobiliario.",
    ],
    liveGoals: ["Registrar próxima acción en leads abiertos", "Retomar propietarios post tasación", "Revisar propiedades sin movimiento"],
    executiveKPIs: ["Lead a visita", "Visita a oferta", "Oferta a cierre", "Oportunidades dormidas", "Seguimiento post tasación"],
    workerInputs: ["Compradores contactados", "Visitas agendadas", "Propietarios retomados", "Ofertas emitidas"],
    proofMoment: "La dirección ve qué oficinas tienen leads dormidos, qué corredores necesitan apoyo y qué propiedades requieren plan comercial.",
  },
  {
    industry: "Construcción / Inmobiliaria",
    buyerLanguage: "Para constructoras e inmobiliarias con proyectos, salas de venta, portales, Meta Ads y ciclos largos.",
    installationPromise: "Conectar marketing, proyecto, financiamiento, visita, cotización y reserva en un flujo visible.",
    firstConversation: "No se trata de conseguir más leads: se trata de saber cuáles están listos para visita, financiamiento o reserva.",
    minimumData: ["Leads por proyecto", "Canal", "Visitas", "Cotizaciones", "Financiamiento", "Reservas", "Disponibilidad"],
    rolesToInvite: ["Gerencia comercial", "Ejecutivos", "Marketing", "Administración", "Financiamiento", "Jefatura de proyecto"],
    first72Hours: [
      "Separar leads por proyecto y etapa.",
      "Crear SLA para portales y Meta Ads.",
      "Retomar cotizaciones abiertas.",
      "Actualizar disponibilidad comercial visible.",
    ],
    liveGoals: ["Responder leads de proyecto", "Agendar visitas", "Retomar cotizaciones", "Actualizar disponibilidad"],
    executiveKPIs: ["Lead a visita", "Visita a reserva", "Tiempo de respuesta", "Leads por proyecto", "Cotizaciones retomadas"],
    workerInputs: ["Leads respondidos", "Visitas agendadas", "Cotizaciones retomadas", "Reservas potenciales"],
    proofMoment: "La gerencia ve qué proyecto pierde seguimiento y qué canal genera visitas reales, no solo volumen.",
  },
  {
    industry: "Clínica / salud / estética / dental",
    buyerLanguage: "Para clínicas, consultas, centros estéticos, dentales y equipos con agenda, recepción y especialistas.",
    installationPromise: "Ordenar WhatsApp, agenda, confirmaciones, no-shows, educación previa y seguimiento post atención.",
    firstConversation: "La agenda no se arregla solo con más mensajes. Se arregla con clasificación, confirmación y seguimiento visible.",
    minimumData: ["Consultas nuevas", "Agenda", "Confirmaciones", "No-shows", "Tratamientos", "Seguimiento post consulta"],
    rolesToInvite: ["Dirección", "Recepción", "Especialistas", "Coordinación", "Marketing", "Administración"],
    first72Hours: [
      "Separar pacientes nuevos, confirmaciones, postconsulta y seguimiento pendiente.",
      "Crear protocolo WhatsApp de primera respuesta.",
      "Activar confirmación 24h y recordatorio 3h.",
      "Medir consulta a agenda y no-show.",
    ],
    liveGoals: ["Confirmar pacientes de mañana", "Clasificar consultas nuevas", "Enviar seguimiento postconsulta"],
    executiveKPIs: ["Consulta a agenda", "Agenda a asistencia", "No-show", "Seguimiento postconsulta", "Recompra/control"],
    workerInputs: ["Consultas clasificadas", "Pacientes confirmados", "No-shows recuperados", "Seguimientos enviados"],
    proofMoment: "Recepción ve qué pacientes esperan respuesta y dirección ve dónde se pierde la agenda.",
  },
  {
    industry: "Salón de belleza / estética grande",
    buyerLanguage: "Para salones, centros de belleza, estética avanzada y equipos con agenda por profesional.",
    installationPromise: "Convertir agenda, WhatsApp, recomendaciones, recompra y experiencia en un sistema medible.",
    firstConversation: "Cada clienta debe saber su hora, su servicio, su profesional, su recomendación y su próxima mantención.",
    minimumData: ["Citas", "Servicios", "Profesionales", "No-shows", "Recompras", "Productos recomendados", "WhatsApp"],
    rolesToInvite: ["Dirección", "Recepción", "Profesionales", "Marketing", "Caja/administración"],
    first72Hours: [
      "Crear etiquetas por servicio y etapa.",
      "Confirmar agenda de mañana.",
      "Registrar recomendaciones post servicio.",
      "Detectar clientas antiguas sin retoma.",
    ],
    liveGoals: ["Confirmar citas", "Retomar clientas antiguas", "Registrar recomendación post servicio"],
    executiveKPIs: ["Consulta a reserva", "No-show", "Recompra", "Agenda por profesional", "Ticket promedio"],
    workerInputs: ["Citas confirmadas", "Servicios realizados", "Productos sugeridos", "Clientas para retomar"],
    proofMoment: "La dueña ve agenda, seguimiento y oportunidades de recompra sin depender de memoria de recepción.",
  },
  {
    industry: "Pyme local",
    buyerLanguage: "Para negocios pequeños donde venta, atención, cobro, marketing y operación suelen mezclarse.",
    installationPromise: "Ordenar clientes, consultas, tareas, cobros, promociones y recompra sin crear burocracia.",
    firstConversation: "No necesitas una gran implementación. Necesitas que lo importante no viva en WhatsApp, cuaderno o memoria.",
    minimumData: ["Clientes frecuentes", "Consultas", "Pedidos", "Cobros", "Promociones", "Clientes antiguos"],
    rolesToInvite: ["Dueña/o", "Vendedora", "Administración", "Apoyo operativo"],
    first72Hours: [
      "Crear base mínima de clientes.",
      "Registrar consultas abiertas y próxima acción.",
      "Elegir 3 prioridades del día.",
      "Crear calendario simple de recompra.",
    ],
    liveGoals: ["Responder consultas", "Registrar ventas", "Retomar clientes antiguos", "Cerrar cobros pendientes"],
    executiveKPIs: ["Consultas respondidas", "Recompra", "Ventas por campaña", "Clientes retomados"],
    workerInputs: ["Consultas respondidas", "Ventas del día", "Clientes para retomar", "Cobros pendientes"],
    proofMoment: "La persona dueña ve por primera vez qué clientes debe retomar hoy y qué tarea mueve ventas.",
  },
  {
    industry: "Negocio unipersonal / solopreneur",
    buyerLanguage: "Para una persona que vende, atiende, entrega, publica, cobra y necesita ordenar su negocio con IA.",
    installationPromise: "Usar The Bridge System™ como copiloto operativo para liberar memoria mental y priorizar mejor.",
    firstConversation: "Tu tarea no es hacer más. Es elegir qué mueve el negocio hoy y dejar el resto en sistema.",
    minimumData: ["Clientes activos", "Consultas", "Ofertas", "Cobros", "Contenido", "Ideas", "Bloqueos"],
    rolesToInvite: ["Fundadora/o", "Asistente virtual o apoyo externo si existe"],
    first72Hours: [
      "Crear tablero de clientes activos, pendientes y dormidos.",
      "Definir 3 prioridades diarias.",
      "Crear respuestas base para consultas frecuentes.",
      "Elegir primera automatización mínima viable.",
    ],
    liveGoals: ["Registrar próximas acciones", "Responder clientes clave", "Cerrar tareas de entrega", "Retomar oportunidades dormidas"],
    executiveKPIs: ["Próximas acciones registradas", "Clientes activos", "Cobros pendientes", "Tareas cerradas"],
    workerInputs: ["Prioridades del día", "Clientes a retomar", "Tareas cerradas", "Bloqueo principal"],
    proofMoment: "La persona ve su negocio completo en una sola vista y sabe qué hacer hoy sin sentirse colapsada.",
  },
];

export function getClientPlaybook(industry: DemoIndustry) {
  return clientPlaybooks.find((playbook) => playbook.industry === industry) ?? clientPlaybooks.find((playbook) => playbook.industry === "Pyme local")!;
}
