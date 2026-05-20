import type { CompanyProfile, ScanResponses, TrackerTask } from "./types";

export const demoCompany: CompanyProfile = {
  name: "Constructora del Sur SpA",
  industry: "Construcción e inmobiliaria",
  size: "51 - 200 colaboradores",
  monthlyRevenue: "$80M - $250M CLP",
  channels: ["Web", "WhatsApp", "Meta Ads", "Referidos", "Email"],
  tools: ["WhatsApp Business", "Google Workspace", "Planillas", "Meta Ads"],
  mainProblem:
    "Muchos leads llegan, pero no existe seguimiento consistente ni claridad de prioridades comerciales.",
  digitalMaturity: "En desarrollo",
};

export const demoResponses: ScanResponses = {
  sales: [2, 2, 3, 2, 2],
  marketing: [3, 2, 3, 2, 2],
  customer: [3, 2, 2, 2, 3],
  operations: [2, 3, 2, 3, 2],
  technology: [2, 2, 2, 1, 2],
  team: [3, 2, 2, 2, 2],
};

export const demoTrackerTasks: TrackerTask[] = [
  { id: "task-1", title: "Crear protocolo de respuesta a leads.", status: "Pendiente" },
  { id: "task-2", title: "Revisar últimos 30 leads.", status: "En progreso" },
  { id: "task-3", title: "Unificar mensajes comerciales por canal.", status: "Pendiente" },
  { id: "task-4", title: "Definir responsable de seguimiento.", status: "Pendiente" },
  { id: "task-5", title: "Crear tablero de oportunidades.", status: "Pendiente" },
  { id: "task-6", title: "Identificar primera automatización posible.", status: "Pendiente" },
];
