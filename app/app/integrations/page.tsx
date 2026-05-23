import { IntegrationCard } from "@/components/integration-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { integrationCatalog, whatsappEnterpriseInstall } from "@/lib/integrations";

const categories = ["CRM", "WhatsApp", "Email", "Formularios", "ERP", "Ads", "Analytics", "Calendarios", "E-commerce", "API / Webhooks"];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Integrations"
        title="Capa de inteligencia sobre herramientas actuales"
        description="No reemplaza CRM, WhatsApp, ERP ni Ads. The Bridge System™ lee señales, detecta fugas y activa acciones sobre el stack existente."
      />
      <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-7 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)]">
        <div className="relative grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Enterprise Connector</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.98] lg:text-7xl">{whatsappEnterpriseInstall.title}</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">{whatsappEnterpriseInstall.summary}</p>
          </div>
          <div className="bridge-glass rounded-lg border p-5">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Qué activa</p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-[rgba(245,241,234,0.78)]">
              {whatsappEnterpriseInstall.activates.slice(0, 5).map((item) => <p key={item}>• {item}</p>)}
            </div>
            <Button href="/app/inbox" className="mt-5 border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone">
              Ver Bridge Inbox™
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <InstallPanel title="Requisitos del cliente" items={whatsappEnterpriseInstall.requirements} />
        <InstallPanel title="Datos que leería" items={whatsappEnterpriseInstall.reads} />
        <InstallPanel title="Pasos de implementación" items={whatsappEnterpriseInstall.implementationSteps} />
      </div>

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

function InstallPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{title}</p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
        {items.map((item) => <p key={item}>• {item}</p>)}
      </div>
    </Card>
  );
}
