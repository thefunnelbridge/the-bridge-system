import { IntegrationCard } from "@/components/integration-card";
import { SectionHeader } from "@/components/section-header";

const integrations = [
  ["CRM y ventas", "Disponible", "HubSpot, Pipedrive, Zoho CRM, tableros de oportunidades."],
  ["Comunicación y atención", "Disponible", "WhatsApp Business, Gmail, Outlook, formularios web."],
  ["Marketing y publicidad", "Próximamente", "Meta Ads, Google Ads, audiencias y campañas conectadas."],
  ["Productividad", "Disponible", "Google Workspace, Microsoft 365, calendarios y documentos."],
  ["Pagos y comercio", "Próximamente", "Webpay, Mercado Pago, Shopify y comercio digital."],
  ["ERP y operaciones", "Requiere configuración", "Defontana, Nubox, Bsale, Odoo y sistemas internos."],
  ["Datos y analítica", "Disponible", "Looker Studio, planillas, fuentes CSV y paneles ejecutivos."],
  ["API y webhooks", "Requiere configuración", "Endpoints, webhooks y eventos para arquitectura agéntica."],
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Integraciones" title="Conexiones preparadas para escalar" description="Estados demo para visualizar el roadmap de integración. No ejecutan conexiones reales todavía." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {integrations.map(([category, status, tools]) => (
          <IntegrationCard key={category} category={category} status={status} tools={tools} />
        ))}
      </div>
    </div>
  );
}
