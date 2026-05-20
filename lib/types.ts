export type AreaId =
  | "sales"
  | "marketing"
  | "customer"
  | "operations"
  | "technology"
  | "team";

export type MaturityStatus =
  | "Fuga crítica"
  | "Alto riesgo"
  | "En desarrollo"
  | "Sistema escalable";

export type CompanyProfile = {
  name: string;
  industry: string;
  size: string;
  monthlyRevenue: string;
  channels: string[];
  tools: string[];
  mainProblem: string;
  digitalMaturity: string;
};

export type ScanResponses = Record<AreaId, number[]>;

export type AreaScore = {
  id: AreaId;
  name: string;
  score: number;
};

export type Leak = {
  areaId: AreaId;
  areaName: string;
  title: string;
  description: string;
  impact: string;
  urgency: string;
  score: number;
};

export type Recommendation = {
  id: string;
  leakTitle: string;
  priority: string;
  actionImmediate: string;
  actionSystem: string;
  actionAutomation: string;
  expectedImpact: string;
  difficulty: string;
  firstStep: string;
};

export type TrackerStatus = "Pendiente" | "En progreso" | "Implementado";

export type TrackerTask = {
  id: string;
  title: string;
  status: TrackerStatus;
};
