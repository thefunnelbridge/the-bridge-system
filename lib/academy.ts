export type AcademyCourse = {
  id: string;
  title: string;
  level: "Fundación" | "Operación" | "Liderazgo" | "IA aplicada";
  duration: string;
  audience: string;
  leakFocus: string;
  objective: string;
  content: string[];
  exercise: string;
  checklist: string[];
  outcome: string;
};

export const academyCourses: AcademyCourse[] = [
  {
    id: "lead-response-clarity",
    title: "Responder leads con claridad",
    level: "Fundación",
    duration: "12 min",
    audience: "Ventas, atención y recepción",
    leakFocus: "Tiempo de respuesta y primera impresión comercial",
    objective: "Instalar una primera respuesta clara, humana y orientada al siguiente paso.",
    content: [
      "Qué información necesita recibir un lead en el primer contacto.",
      "Cómo evitar respuestas genéricas que enfrían oportunidades.",
      "Cómo cerrar cada conversación con una próxima acción verificable.",
    ],
    exercise: "Tomar 5 leads recientes y reescribir la primera respuesta con saludo, contexto, pregunta de intención y siguiente paso.",
    checklist: ["Saludo humano", "Contexto del motivo de consulta", "Pregunta de calificación", "Siguiente paso", "Responsable visible"],
    outcome: "Menos leads perdidos por respuestas tardías o confusas.",
  },
  {
    id: "follow-up-without-pressure",
    title: "Seguimiento sin parecer insistente",
    level: "Operación",
    duration: "15 min",
    audience: "Ejecutivos comerciales, corredores y vendedores",
    leakFocus: "Oportunidades dormidas y falta de retoma",
    objective: "Convertir seguimiento en servicio útil, no presión comercial.",
    content: [
      "Por qué el seguimiento debe aportar contexto nuevo.",
      "Secuencia simple 1, 3, 7, 14 y 30 días.",
      "Cómo registrar intención, objeción y próxima acción.",
    ],
    exercise: "Elegir 10 oportunidades dormidas y enviar una retoma con motivo claro, alternativa concreta y fecha de seguimiento.",
    checklist: ["Motivo de retoma", "Información nueva", "Pregunta simple", "Fecha de próxima acción", "Estado actualizado"],
    outcome: "Más oportunidades reactivadas sin deteriorar la experiencia del cliente.",
  },
  {
    id: "prioritize-opportunities",
    title: "Cómo priorizar oportunidades",
    level: "Operación",
    duration: "14 min",
    audience: "Ventas, líderes de oficina y gerencia comercial",
    leakFocus: "Leads tratados igual aunque tengan intención distinta",
    objective: "Separar oportunidades por intención, urgencia, valor y probabilidad de avance.",
    content: [
      "Diferencia entre lead curioso, interesado y listo para avanzar.",
      "Señales de intención: presupuesto, urgencia, problema, autoridad y timing.",
      "Cómo elegir qué se responde primero sin depender de intuición.",
    ],
    exercise: "Clasificar los últimos 30 leads en caliente, tibio, frío y dormido; asignar próxima acción por grupo.",
    checklist: ["Intención", "Urgencia", "Valor potencial", "Canal de origen", "Próximo paso"],
    outcome: "Menos energía desperdiciada y mejor foco comercial.",
  },
  {
    id: "whatsapp-operating-system",
    title: "WhatsApp ordenado: del chat al sistema",
    level: "Fundación",
    duration: "18 min",
    audience: "Atención, ventas, recepción y coordinación",
    leakFocus: "Conversaciones sin responsable, estado o archivo asociado",
    objective: "Convertir WhatsApp en una fuente ordenada de oportunidades y tareas.",
    content: [
      "Qué datos mínimos debe tener cada conversación comercial.",
      "Cómo separar venta, soporte, coordinación interna y documentos.",
      "Etiquetas base: nuevo lead, cotización enviada, seguimiento pendiente, documento pendiente y cliente dormido.",
    ],
    exercise: "Revisar 20 conversaciones abiertas y asignar responsable, estado, archivo asociado y próxima acción.",
    checklist: ["Responsable", "Estado", "Próxima acción", "Archivo fuera del chat", "Etiqueta de prioridad"],
    outcome: "Mayor trazabilidad y menos clientes perdidos dentro de conversaciones.",
  },
  {
    id: "objection-handling",
    title: "Manejo de objeciones con criterio",
    level: "Operación",
    duration: "16 min",
    audience: "Ventas, atención y dirección comercial",
    leakFocus: "Objeciones respondidas distinto por cada persona",
    objective: "Estandarizar respuestas sin perder humanidad ni criterio comercial.",
    content: [
      "Cómo escuchar antes de responder.",
      "Objeciones de precio, tiempo, confianza, comparación y urgencia.",
      "Cómo convertir una objeción en información para mejorar el proceso.",
    ],
    exercise: "Crear una biblioteca de 10 objeciones frecuentes con respuesta base, pregunta de seguimiento y acción sugerida.",
    checklist: ["Objeción identificada", "Validación humana", "Respuesta base", "Pregunta abierta", "Acción siguiente"],
    outcome: "Más consistencia comercial y menos dependencia del estilo individual.",
  },
  {
    id: "document-simple-process",
    title: "Documentar un proceso simple",
    level: "Liderazgo",
    duration: "20 min",
    audience: "Líderes, operaciones, administración y gerencias",
    leakFocus: "Procesos dependientes de memoria humana",
    objective: "Transformar una tarea repetida en un estándar visible y entrenable.",
    content: [
      "Qué proceso conviene documentar primero.",
      "Cómo escribir pasos mínimos sin crear burocracia.",
      "Cómo definir dueño, entrada, salida, criterio de éxito y bloqueo frecuente.",
    ],
    exercise: "Documentar un proceso crítico en 7 pasos y convertirlo en tarea recurrente de Bridge Flow™.",
    checklist: ["Nombre del proceso", "Dueño", "Entrada", "Pasos", "Salida", "KPI", "Bloqueos"],
    outcome: "Menos dependencia de personas clave y mejor escalabilidad operativa.",
  },
  {
    id: "ai-with-humanity",
    title: "Usar IA sin perder humanidad",
    level: "IA aplicada",
    duration: "22 min",
    audience: "Dirección, líderes, marketing, ventas y atención",
    leakFocus: "IA aplicada sin datos claros, límites ni revisión humana",
    objective: "Entender cuándo automatizar, cuándo asistir y cuándo mantener criterio humano.",
    content: [
      "Datos y procesos antes de automatizar.",
      "Casos de uso seguros: resumen, clasificación, scripts, alertas y capacitación.",
      "Revisión humana, privacidad y límites operativos.",
    ],
    exercise: "Elegir 3 casos de uso de IA y evaluarlos por impacto, riesgo, datos disponibles y responsable humano.",
    checklist: ["Proceso claro", "Datos disponibles", "Riesgo bajo/controlado", "Responsable humano", "Métrica de éxito"],
    outcome: "IA aplicada con más criterio, menos moda y mejor adopción del equipo.",
  },
  {
    id: "reduce-no-shows",
    title: "Reducir no-shows y ausencias",
    level: "Operación",
    duration: "14 min",
    audience: "Clínicas, salud, estética, educación y servicios agendados",
    leakFocus: "Clientes o pacientes que agendan y no llegan",
    objective: "Instalar confirmación, recordatorio y seguimiento post atención.",
    content: [
      "Por qué un no-show suele ser una falla del flujo, no solo del cliente.",
      "Confirmación 24 horas antes y recordatorio 3 horas antes.",
      "Cómo recuperar una ausencia sin castigar la relación.",
    ],
    exercise: "Crear tres mensajes: confirmación, recordatorio y recuperación de agenda perdida.",
    checklist: ["Confirmación", "Recordatorio", "Canal correcto", "Reagendamiento", "Registro de motivo"],
    outcome: "Menos agenda perdida y mejor experiencia de atención.",
  },
  {
    id: "brokerage-pipeline-ritual",
    title: "Ritual semanal de pipeline inmobiliario",
    level: "Liderazgo",
    duration: "24 min",
    audience: "Corredores, líderes de oficina y redes de brokerage",
    leakFocus: "Compradores, propietarios y propiedades sin movimiento visible",
    objective: "Instalar una reunión breve para revisar leads dormidos, visitas, ofertas y propiedades sin movimiento.",
    content: [
      "Qué debe revisar un líder de oficina cada semana.",
      "Cómo medir hábitos sin generar competencia tóxica.",
      "Cómo convertir una oportunidad dormida en acción del corredor.",
    ],
    exercise: "Crear tablero semanal con leads sin próxima acción, visitas sin seguimiento, propietarios post tasación y propiedades sin movimiento.",
    checklist: ["Leads dormidos", "Visitas sin seguimiento", "Propietarios post tasación", "Ofertas abiertas", "Próxima acción por corredor"],
    outcome: "Más visibilidad de desempeño sin quitar humanidad al agente.",
  },
  {
    id: "measure-campaign",
    title: "Medir una campaña comercial sin engañarse",
    level: "Liderazgo",
    duration: "18 min",
    audience: "Marketing, ventas y dirección",
    leakFocus: "Campañas medidas por leads, no por avance comercial real",
    objective: "Conectar inversión, canal, mensaje, seguimiento y conversión.",
    content: [
      "Diferencia entre lead, conversación, visita/reunión, cotización y cierre.",
      "Por qué marketing y ventas deben compartir datos.",
      "Cómo detectar mensajes que generan volumen pero no oportunidad real.",
    ],
    exercise: "Tomar una campaña reciente y mapear leads, respuestas, reuniones, cotizaciones y cierres.",
    checklist: ["Canal", "Mensaje", "Costo", "Respuesta", "Conversión", "Motivos de pérdida"],
    outcome: "Mejor inversión comercial y menos campañas desconectadas del proceso real.",
  },
];

export const academyLessons = academyCourses.map((course) => course.title);
