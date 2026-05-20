import { IntegrationCard } from "@/components/integration-card";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { integrationCatalog } from "@/lib/integrations";

const categories = ["CRM", "WhatsApp", "Email", "Formularios", "ERP", "Ads", "Analytics", "Calendarios", "E-commerce", "API / Webhooks"];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Integrations"
        title="Capa de inteligencia sobre herramientas actuales"
        description="No reemplaza CRM, WhatsApp, ERP ni Ads. The Bridge System™ lee señales, detecta fugas y activa acciones sobre el stack existente."
      />
      <div className="grid gap-3 md:grid-cols-5">
        {categories.map((category) => (
          <Card key={category} className="p-4">
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.13em] text-copper">{category}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrationCatalog.map((integration) => (
          <IntegrationCard key={integration.name} integration={integration} />
        ))}
      </div>
    </div>
  );
}
