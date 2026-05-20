export type AreaId =
  | "sales"
  | "marketing"
  | "customer"
  | "operations"
  | "technology"
  | "team"
  | "leadership"
  | "experience"
  | "aiReadiness"
  | "continuousImprovement";

export type MaturityStatus =
  | "Fuga crítica"
  | "Alto riesgo"
  | "Sistema en desarrollo"
  | "Sistema escalable"
  | "Organización inteligente";

export type DemoIndustry =
  | "Construcción / Inmobiliaria"
  | "Clínica / salud / estética / dental"
  | "Automotora"
  | "Legal"
  | "Pyme local"
  | "Corredores de propiedades / Brokerage inmobiliario"
  | "Educación"
  | "Municipalidad / institución pública"
  | "Retail / e-commerce"
  | "Logística"
  | "Hotelería / turismo"
  | "Gimnasio / wellness"
  | "Energía / estaciones de servicio / conveniencia";

export type CompanyProfile = {
  id: string;
  name: string;
  industry: DemoIndustry;
  city: string;
  size: string;
  monthlyRevenue?: string;
  model?: string;
  channels: string[];
  tools: string[];
  team: string[];
  mainProblem: string;
  digitalMaturity: string;
  metrics: Record<string, string | number>;
};

export type ScanResponses = Record<AreaId, number[]>;

export type AreaScore = {
  id: AreaId;
  name: string;
  score: number;
  microcopy: string;
};

export type Leak = {
  id: string;
  areaId: AreaId;
  areaName: string;
  title: string;
  description: string;
  impact: "Alto" | "Medio/Alto" | "Medio";
  urgency: "Inmediata" | "Alta" | "Media/Alta" | "Media";
  score: number;
  whyItMatters: string;
  riskOfInaction: string;
};

export type AdvancedScores = {
  areaScores: AreaScore[];
  overallScore: number;
  maturityLevel: MaturityStatus;
  commercialLeakIndex: number;
  communicationLeakIndex: number;
  operationalLeakIndex: number;
  customerExperienceRisk: number;
  aiReadinessIndex: number;
  dataMaturityIndex: number;
  humanDependencyIndex: number;
  strategicClarityIndex: number;
  implementationUrgency: number;
  automationPotential: number;
  teamTrainingNeed: number;
};

export type MatrixItem = {
  id: string;
  title: string;
  area: string;
  impact: number;
  urgency: number;
  quadrant: "Quick wins" | "High impact / high urgency" | "System fixes" | "Later optimizations";
};

export type Recommendation = {
  id: string;
  leakTitle: string;
  area: string;
  priority: string;
  whyItMatters: string;
  actionImmediate: string;
  action72Hours: string;
  action7Days: string;
  action30Days: string;
  automation: string;
  script: string;
  kpi: string;
  owner: string;
  difficulty: string;
  impact: string;
  riskOfInaction: string;
};

export type TrackerStatus = "Pendiente" | "En progreso" | "Implementado" | "Bloqueado";

export type TrackerTask = {
  id: string;
  title: string;
  description: string;
  area: string;
  origin: string;
  priority: string;
  owner: string;
  status: TrackerStatus;
  suggestedDate: string;
  kpi: string;
  expectedImpact: string;
  difficulty: string;
  createdAt: string;
};

export type DataRoom = {
  leads: Record<string, string | number | string[]>;
  sales: Record<string, string | number | string[]>;
  communication: Record<string, string | number | string[]>;
  operations: Record<string, string | number | string[]>;
  team: Record<string, string | number | string[]>;
  files: { name: string; status: "Pendiente" | "Cargado" | "Analizado demo" }[];
  benchmarks: string[];
  brokerage?: {
    buyers: Record<string, string | number | string[]>;
    owners: Record<string, string | number | string[]>;
    agents: Record<string, string | number | string[]>;
    offices: Record<string, string | number | string[]>;
  };
};

export type IndustryRules = {
  benchmarkWarnings: string[];
  typicalLeaks: string[];
  kpisToWatch: string[];
  recommendedAutomations: string[];
  recommendedScripts: string[];
  academyLessons: string[];
  executiveLanguage: string;
  riskSignals: string[];
  opportunitySignals: string[];
};

export type IntegrationStatus = "Conectado demo" | "Disponible" | "Próximamente" | "Requiere configuración";

export type IntegrationItem = {
  name: string;
  category: string;
  status: IntegrationStatus;
  reads: string[];
  actions: string[];
  expectedImpact: string;
  difficulty: string;
  nextAction: string;
};
