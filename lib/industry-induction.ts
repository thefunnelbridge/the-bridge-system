import type { CompanyProfile, DemoIndustry } from "./types";

export type WorkerPersona = {
  id: string;
  name: string;
  role: string;
  area: string;
  mission: string;
  dailyInputs: string[];
};

export type IndustryInduction = {
  industry: DemoIndustry | "General";
  title: string;
  simpleExplanation: string;
  firstDayGoal: string;
  whatToEnter: string[];
  dailyRitual: string[];
  workerPersonas: WorkerPersona[];
  managerChecklist: string[];
  companionTone: string;
  examples: {
    conversation: string;
    task: string;
    metric: string;
  };
};

const generalPersonas: WorkerPersona[] = [
  {
    id: "commercial",
    name: "María",
    role: "Ejecutiva comercial",
    area: "Ventas y seguimiento",
    mission: "Cerrar oportunidades sin próxima acción y registrar avance visible.",
    dailyInputs: ["Leads respondidos", "Próximas acciones registradas", "Bloqueos comerciales"],
  },
  {
    id: "operations",
    name: "Carlos",
    role: "Coordinador operativo",
    area: "Operación",
    mission: "Ordenar tareas críticas y levantar bloqueos antes de que frenen al equipo.",
    dailyInputs: ["Tareas cerradas", "Procesos bloqueados", "Responsables pendientes"],
  },
  {
    id: "attention",
    name: "Ana",
    role: "Atención / recepción",
    area: "Atención al cliente",
    mission: "Responder conversaciones críticas con claridad, estado y siguiente paso.",
    dailyInputs: ["Conversaciones respondidas", "Documentos recibidos", "Clientes esperando"],
  },
];

const playbooks: Record<string, IndustryInduction> = {
  "Corredores de propiedades / Brokerage inmobiliario": {
    industry: "Corredores de propiedades / Brokerage inmobiliario",
    title: "Inducción para corredores, oficinas y redes inmobiliarias",
    simpleExplanation:
      "Aquí cada comprador, propietario, visita y oferta debe tener responsable, etapa y próxima acción. La meta es convertir hábitos individuales de corredores en un sistema visible sin quitar humanidad.",
    firstDayGoal: "Revisar compradores sin próxima acción y propietarios sin seguimiento post tasación.",
    whatToEnter: ["Compradores nuevos", "Propietarios captados", "Visitas realizadas", "Ofertas emitidas", "Propiedades sin movimiento", "Próxima acción por corredor"],
    dailyRitual: ["Revisar leads sin respuesta", "Clasificar compradores por intención", "Registrar seguimiento post visita", "Escalar propiedades sin movimiento", "Cerrar día con próxima acción visible"],
    workerPersonas: [
      {
        id: "broker-agent",
        name: "María",
        role: "Corredora",
        area: "Compradores y propietarios",
        mission: "Registrar próxima acción en compradores abiertos y retomar propietarios post tasación.",
        dailyInputs: ["Compradores contactados", "Visitas agendadas", "Propietarios retomados", "Ofertas emitidas"],
      },
      {
        id: "office-leader",
        name: "Diego",
        role: "Líder de oficina",
        area: "Pipeline de oficina",
        mission: "Revisar leads dormidos, visitas sin seguimiento y propiedades sin movimiento.",
        dailyInputs: ["Corredores con bloqueo", "Leads sin dueño", "Propiedades sin movimiento"],
      },
      {
        id: "broker-assistant",
        name: "Ana",
        role: "Asistente comercial",
        area: "Documentos y agenda",
        mission: "Ordenar documentos pendientes y confirmar visitas del día.",
        dailyInputs: ["Documentos recibidos", "Visitas confirmadas", "Agenda actualizada"],
      },
    ],
    managerChecklist: ["Definir SLA 15 minutos", "Crear tablero por oficina", "Revisar oportunidades dormidas 7/14/30 días", "Asignar microlección por corredor"],
    companionTone: "Revisa compradores sin próxima acción. Cada lead sin fecha de seguimiento se convierte en oportunidad dormida.",
    examples: {
      conversation: "Comprador de portal consulta por departamento en Ñuñoa y queda sin clasificación.",
      task: "Clasificar últimos 30 compradores por presupuesto, comuna y urgencia.",
      metric: "Lead comprador a visita.",
    },
  },
  "Construcción / Inmobiliaria": {
    industry: "Construcción / Inmobiliaria",
    title: "Inducción para constructoras e inmobiliarias",
    simpleExplanation:
      "El foco es conectar marketing, proyecto, financiamiento, visita, cotización y reserva. El sistema ayuda a que cada lead tenga etapa, proyecto y seguimiento real.",
    firstDayGoal: "Separar leads por proyecto y detectar cuáles no recibieron seguimiento.",
    whatToEnter: ["Leads por proyecto", "Visitas agendadas", "Cotizaciones enviadas", "Estado de financiamiento", "Reservas", "Disponibilidad actualizada"],
    dailyRitual: ["Revisar leads Meta Ads y portales", "Actualizar etapa por proyecto", "Retomar cotizaciones", "Escalar dudas de financiamiento", "Medir visitas agendadas"],
    workerPersonas: [
      {
        id: "real-estate-exec",
        name: "María",
        role: "Ejecutiva de ventas",
        area: "Proyecto y reservas",
        mission: "Priorizar leads por proyecto y registrar seguimiento de financiamiento, visita o cotización.",
        dailyInputs: ["Leads respondidos", "Visitas agendadas", "Cotizaciones retomadas", "Reservas potenciales"],
      },
      {
        id: "marketing-project",
        name: "Paula",
        role: "Marketing",
        area: "Campañas y portales",
        mission: "Conectar campañas con oportunidades reales y mensajes por proyecto.",
        dailyInputs: ["Leads por canal", "Campañas activas", "Mensajes que convierten"],
      },
    ],
    managerChecklist: ["Crear SLA por canal", "Revisar lead a visita", "Actualizar disponibilidad", "Estandarizar mensajes por proyecto"],
    companionTone: "Hoy el foco es que ningún lead de proyecto quede sin etapa ni responsable.",
    examples: {
      conversation: "Lead de portal pregunta por disponibilidad, pero nadie registra si agenda visita.",
      task: "Mapear últimos 50 leads por proyecto, canal, etapa y responsable.",
      metric: "Visita agendada por canal.",
    },
  },
  "Clínica / salud / estética / dental": {
    industry: "Clínica / salud / estética / dental",
    title: "Inducción para clínicas, salud, estética y dental",
    simpleExplanation:
      "El foco es ordenar WhatsApp, agenda, confirmaciones, no-shows, educación previa y seguimiento post atención. El sistema ayuda a que recepción y especialistas trabajen con el mismo estándar.",
    firstDayGoal: "Confirmar pacientes del día siguiente y clasificar consultas nuevas antes de las 17:00.",
    whatToEnter: ["Consultas nuevas", "Pacientes agendados", "Confirmaciones", "No-shows", "Tratamiento consultado", "Seguimiento post consulta"],
    dailyRitual: ["Clasificar consultas", "Confirmar agenda", "Enviar recordatorios", "Registrar objeciones", "Retomar pacientes post consulta"],
    workerPersonas: [
      {
        id: "clinic-reception",
        name: "Ana",
        role: "Recepción",
        area: "Agenda y WhatsApp",
        mission: "Clasificar consultas, confirmar pacientes y registrar seguimiento post atención.",
        dailyInputs: ["Consultas clasificadas", "Pacientes confirmados", "No-shows recuperados", "Seguimientos enviados"],
      },
      {
        id: "clinic-director",
        name: "Camila",
        role: "Dirección clínica",
        area: "Experiencia paciente",
        mission: "Revisar fricciones de agenda, no-shows y consistencia del mensaje.",
        dailyInputs: ["Bloqueos recepción", "Motivos de no-show", "Preguntas frecuentes"],
      },
    ],
    managerChecklist: ["Protocolo primera respuesta", "Confirmación 24h", "Recordatorio 3h", "Seguimiento post consulta"],
    companionTone: "Hoy recepción debe separar consultas nuevas, confirmaciones y postconsulta. La agenda necesita claridad antes de velocidad.",
    examples: {
      conversation: "Paciente pregunta precio por WhatsApp, pero no recibe educación ni siguiente paso.",
      task: "Crear mensajes de confirmación, recordatorio y post consulta.",
      metric: "Consulta a agenda y no-show.",
    },
  },
  Automotora: {
    industry: "Automotora",
    title: "Inducción para automotoras y concesionarios",
    simpleExplanation:
      "El foco es separar intención: cotización, financiamiento, permuta, test drive, flota o servicio. Cada lead necesita vendedor, SLA y siguiente paso distinto.",
    firstDayGoal: "Asignar leads nuevos en menos de 10 minutos y separar intención antes de responder.",
    whatToEnter: ["Modelo consultado", "Intención", "Vendedor asignado", "Financiamiento", "Permuta", "Test drive", "Estado de cierre"],
    dailyRitual: ["Asignar leads", "Separar intención", "Agendar test drive", "Retomar financiamiento", "Medir vendedor por próxima acción"],
    workerPersonas: [
      {
        id: "auto-sales",
        name: "Carlos",
        role: "Vendedor",
        area: "Leads y test drive",
        mission: "Responder leads por intención y registrar próxima acción de test drive, financiamiento o cotización.",
        dailyInputs: ["Leads asignados", "Cotizaciones enviadas", "Test drives agendados", "Financiamientos retomados"],
      },
      {
        id: "finance",
        name: "Valentina",
        role: "Financiamiento",
        area: "Crédito y cierre",
        mission: "Acelerar leads con intención financiera y reducir espera de documentación.",
        dailyInputs: ["Solicitudes recibidas", "Documentos pendientes", "Aprobaciones"],
      },
    ],
    managerChecklist: ["SLA 10 minutos", "Script por intención", "Tablero por modelo", "Secuencia 7 días"],
    companionTone: "Los leads de financiamiento no deben recibir el mismo mensaje que los de cotización. Primero clasifica intención.",
    examples: {
      conversation: "Cliente pregunta por financiamiento de SUV, pero recibe respuesta genérica de precio.",
      task: "Crear scripts separados por cotización, financiamiento, permuta y test drive.",
      metric: "Cotización a test drive.",
    },
  },
  "Salón de belleza / estética grande": {
    industry: "Salón de belleza / estética grande",
    title: "Inducción para salones, estética y belleza con equipo",
    simpleExplanation:
      "El foco es agenda, confirmación, experiencia, venta consultiva y recompra. El sistema ayuda a que cada clienta tenga estado, servicio, profesional y próxima visita recomendada.",
    firstDayGoal: "Confirmar agenda de mañana y detectar clientas sin seguimiento post servicio.",
    whatToEnter: ["Consultas por servicio", "Citas confirmadas", "No-shows", "Profesional asignada", "Servicio realizado", "Próxima mantención"],
    dailyRitual: ["Confirmar citas", "Clasificar consultas", "Registrar recomendaciones", "Retomar clientas antiguas", "Revisar agenda por profesional"],
    workerPersonas: [
      {
        id: "beauty-reception",
        name: "Sofía",
        role: "Coordinadora de agenda",
        area: "Recepción y WhatsApp",
        mission: "Confirmar citas, ordenar consultas y dejar próxima mantención sugerida.",
        dailyInputs: ["Citas confirmadas", "Consultas respondidas", "No-shows recuperados"],
      },
      {
        id: "beauty-professional",
        name: "Isidora",
        role: "Profesional senior",
        area: "Servicio y recomendación",
        mission: "Registrar recomendación post servicio y oportunidad de recompra.",
        dailyInputs: ["Servicios realizados", "Recomendaciones", "Productos sugeridos"],
      },
    ],
    managerChecklist: ["Protocolos por servicio", "Recordatorios", "Post atención", "Agenda por profesional"],
    companionTone: "Hoy el foco es que cada clienta sepa su hora, su siguiente paso y su recomendación de mantención.",
    examples: {
      conversation: "Clienta pregunta por disponibilidad y precio, pero no queda asociada a servicio ni profesional.",
      task: "Crear etiquetas por servicio, confirmación y post atención.",
      metric: "Consulta a reserva y recompra.",
    },
  },
  "Pyme local": {
    industry: "Pyme local",
    title: "Inducción para pymes pequeñas",
    simpleExplanation:
      "El foco es simple: registrar clientes, responder consultas, ordenar tareas y activar recompra. No se trata de llenar pantallas, sino de dejar de depender de memoria.",
    firstDayGoal: "Crear base mínima de clientes y registrar próximas acciones de las consultas abiertas.",
    whatToEnter: ["Clientes frecuentes", "Consultas WhatsApp", "Pedidos pendientes", "Promociones", "Cobros", "Clientes antiguos"],
    dailyRitual: ["Responder consultas", "Registrar ventas", "Retomar clientes", "Revisar cobros", "Definir 3 prioridades del día"],
    workerPersonas: [
      {
        id: "pyme-owner",
        name: "Paula",
        role: "Dueña / operación",
        area: "Ventas, atención y administración",
        mission: "Cerrar tres prioridades del día y registrar clientes que necesitan seguimiento.",
        dailyInputs: ["Consultas respondidas", "Ventas del día", "Clientes para retomar", "Cobros pendientes"],
      },
      {
        id: "pyme-helper",
        name: "Antonia",
        role: "Vendedora",
        area: "Atención y caja",
        mission: "Registrar pedidos, preguntas frecuentes y oportunidades de recompra.",
        dailyInputs: ["Pedidos", "Preguntas frecuentes", "Clientes recurrentes"],
      },
    ],
    managerChecklist: ["Base simple de clientes", "Calendario de promoción", "Retoma semanal", "Mensajes aprobados"],
    companionTone: "Hoy no necesitas hacer todo. Necesitas cerrar tres prioridades y dejar las consultas importantes con próxima acción.",
    examples: {
      conversation: "Cliente pregunta por producto en WhatsApp y no queda guardado para retoma.",
      task: "Crear lista de 30 clientes frecuentes y enviar mensaje de reactivación.",
      metric: "Recompra y consultas respondidas.",
    },
  },
  "Negocio unipersonal / solopreneur": {
    industry: "Negocio unipersonal / solopreneur",
    title: "Inducción para una persona que quiere ordenar su negocio con IA",
    simpleExplanation:
      "Aquí The Bridge System™ funciona como copiloto operativo: te ayuda a ordenar clientes, tareas, mensajes, ventas, contenido y seguimiento sin crear burocracia.",
    firstDayGoal: "Definir tus 3 prioridades del día y convertir cada conversación importante en próxima acción.",
    whatToEnter: ["Clientes activos", "Consultas pendientes", "Ofertas", "Cobros", "Contenido", "Ideas", "Bloqueos"],
    dailyRitual: ["Elegir 3 prioridades", "Responder conversaciones clave", "Registrar próxima acción", "Bloquear tiempo para entrega", "Cerrar día con aprendizaje"],
    workerPersonas: [
      {
        id: "solo-founder",
        name: "Tú",
        role: "Fundadora / especialista",
        area: "Todo el negocio",
        mission: "Usar IA y sistema para liberar memoria mental, no para agregar más ruido.",
        dailyInputs: ["Prioridades del día", "Clientes a retomar", "Tareas cerradas", "Bloqueo principal"],
      },
    ],
    managerChecklist: ["Lista simple de clientes", "Plantillas de respuesta", "Rutina de cierre diario", "Automatización mínima viable"],
    companionTone: "Tu tarea no es hacer más. Es elegir lo que mueve el negocio hoy y dejar lo demás en sistema.",
    examples: {
      conversation: "Cliente pide información, respondes rápido, pero no queda fecha de seguimiento.",
      task: "Crear tablero de clientes activos, pendientes y dormidos.",
      metric: "Próximas acciones registradas.",
    },
  },
};

export function getIndustryInduction(company: CompanyProfile): IndustryInduction {
  return (
    playbooks[company.industry] ??
    (company.size.includes("1-10") ? playbooks["Pyme local"] : null) ??
    {
      industry: "General",
      title: "Inducción operativa general",
      simpleExplanation:
        "The Bridge System™ convierte datos, conversaciones y tareas en decisiones diarias para que el equipo sepa qué hacer, qué medir y qué mejorar.",
      firstDayGoal: "Detectar conversaciones sin próxima acción y tareas críticas sin responsable.",
      whatToEnter: ["Canales", "Herramientas", "Tareas", "Clientes", "Responsables", "Bloqueos"],
      dailyRitual: ["Revisar Pulse", "Cerrar alertas críticas", "Actualizar tareas", "Completar una microlección", "Registrar aprendizaje"],
      workerPersonas: generalPersonas,
      managerChecklist: ["Definir responsables", "Completar Data Room", "Ejecutar Scan", "Activar Flow"],
      companionTone: "Hoy no buscamos hacer más por hacer más. Buscamos cerrar una fuga concreta y dejar el siguiente paso visible.",
      examples: {
        conversation: "Cliente pide información y queda sin responsable.",
        task: "Asignar responsable y próxima acción a conversaciones abiertas.",
        metric: "Tiempo de respuesta y tareas críticas cerradas.",
      },
    }
  );
}
