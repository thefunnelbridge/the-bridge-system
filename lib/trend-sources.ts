export type TrendSource = {
  id: string;
  name: string;
  category: string;
  signal: string;
  productUse: string;
  sourceLabel: string;
  sourceUrl: string;
  refreshCadence: string;
};

export const trendSources: TrendSource[] = [
  {
    id: "metricool-social-benchmark",
    name: "Metricool Social Media Benchmark",
    category: "Social media / contenido",
    signal: "Benchmark público de rendimiento por plataforma, formatos, alcance, engagement y cambios de algoritmo.",
    productUse: "Bridge Trends™ lo usa para sugerir canales, mensajes, cadencia, contenidos y KPIs de comunicación.",
    sourceLabel: "Metricool 2025 Social Media Benchmark Report",
    sourceUrl: "https://metricool.com/press-release-metricool-2025-social-media-benchmark-report/",
    refreshCadence: "Anual / estudios por plataforma",
  },
  {
    id: "datareportal-digital",
    name: "DataReportal Digital Global Reports",
    category: "Comportamiento digital",
    signal: "Reportes públicos sobre uso de internet, redes sociales, ecommerce, mobile, video y descubrimiento de marcas.",
    productUse: "Sirve para contextualizar si los canales de una empresa están alineados con hábitos digitales reales.",
    sourceLabel: "DataReportal Digital 2025 Global Overview Report",
    sourceUrl: "https://datareportal.com/reports/digital-2025-global-overview-report",
    refreshCadence: "Global anual + reportes locales",
  },
  {
    id: "hubspot-state-marketing",
    name: "HubSpot State of Marketing",
    category: "Marketing / ventas / IA",
    signal: "Encuestas públicas sobre adopción de IA, automatización, cambios SEO/AEO, personalización y alineación comercial.",
    productUse: "Alimenta AI Readiness, automatización recomendada y entrenamiento de equipos comerciales/marketing.",
    sourceLabel: "HubSpot State of Marketing 2026",
    sourceUrl: "https://blog.hubspot.com/marketing/hubspot-blog-marketing-industry-trends-report",
    refreshCadence: "Anual",
  },
  {
    id: "think-with-google-retail",
    name: "Think with Google / Consumer Journey",
    category: "Customer journey / retail",
    signal: "Señales públicas sobre recorridos de compra complejos, múltiples touchpoints y rol de búsqueda/video.",
    productUse: "Ayuda a detectar fricción entre canales, mensajes, campañas y seguimiento comercial.",
    sourceLabel: "Think with Google / Think Retail 2025",
    sourceUrl: "https://business.google.com/us/think/ai-excellence/holiday-marketing-tips-think-retail/",
    refreshCadence: "Publicaciones periódicas",
  },
  {
    id: "google-trends",
    name: "Google Trends",
    category: "Demanda / intención",
    signal: "Interés de búsqueda por temas, categorías, temporadas, servicios, ciudades y problemas del cliente.",
    productUse: "Puede alimentar Bridge Trends™ con señales por industria, ciudad y campaña.",
    sourceLabel: "Google Trends",
    sourceUrl: "https://trends.google.com/trends/",
    refreshCadence: "Continuo",
  },
];
