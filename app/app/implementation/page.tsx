"use client";

import { Building2, CheckCircle2, Database, LockKeyhole, Rocket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  clientAccessRequestList,
  connectorAccessMatrix,
  mondayEnterpriseKickoffList,
  productionEnvironmentChecklist,
} from "@/lib/enterprise-activation";
import { enterpriseInstallationSteps } from "@/lib/saas-config";
import { getCompanyProfile } from "@/lib/storage";

const readiness = [
  ["Login y usuarios", "Supabase Auth preparado", "ready"],
  ["Multiempresa", "Schema con organizations y members", "ready"],
  ["Roles", "Owner, admin, manager, worker", "ready"],
  ["Billing", "Stripe Checkout preparado", "stripe"],
  ["Datos reales", "Data Room, scan, inbox, tasks y goals", "ready"],
  ["AI", "OpenAI server-side pendiente", "planned"],
];

export default function ImplementationPage() {
  const company = getCompanyProfile();

  return (
    <div className="space-y-8">
      <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-7 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)]">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Enterprise Installation</p>
        <h1 className="mt-4 max-w-5xl font-display text-5xl font-semibold leading-[0.98] lg:text-7xl">Instalar The Bridge System™ dentro de una operación real.</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
          Implementación para empresas con equipos, sucursales, datos dispersos, procesos críticos y necesidad de decidir más rápido sin depender de memoria humana.
        </p>
      </div>

      <SectionHeader
        eyebrow="Implementation"
        title="Plan de instalación para cliente enterprise"
        description={`Base lista para convertir ${company.name} en una organización real con usuarios, roles, datos, metas, reportes y billing.`}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            {enterpriseInstallationSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Paso {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fog">{step.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="bg-ink text-bone">
            <Rocket className="size-7 text-ember" />
            <h2 className="mt-4 text-2xl font-semibold">Modo instalable</h2>
            <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.76)]">
              Para instalarlo en una empresa grande, el primer día debe cargar contexto, crear usuarios, ejecutar Scan y dejar Pulse/Flow con metas visibles.
            </p>
            <Button href="/app/billing" className="mt-5 border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone">
              Activar billing
            </Button>
          </Card>

          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Production readiness</p>
            <div className="mt-4 space-y-3">
              {readiness.map(([label, detail, status]) => (
                <div key={label} className="flex items-start gap-3 rounded-md border border-[color:var(--line)] bg-bone p-3">
                  <CheckCircle2 className={`mt-0.5 size-4 ${status === "planned" ? "text-copper" : "text-ember"}`} />
                  <div>
                    <p className="font-semibold text-ink">{label}</p>
                    <p className="text-sm leading-6 text-fog">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <InstallMetric icon={Building2} label="Organización" value="1+" detail="Empresa, unidades y sucursales." />
        <InstallMetric icon={Users} label="Usuarios" value="Roles" detail="Dirección, managers y workers." />
        <InstallMetric icon={Database} label="Datos" value="Live" detail="Data Room, Inbox, Scan y Flow." />
        <InstallMetric icon={LockKeyhole} label="Seguridad" value="RLS" detail="Separación por organización." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card className="bg-ink text-bone">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Lista exacta para una reunión enterprise</p>
          <h2 className="mt-3 text-3xl font-semibold">Qué pedirle al cliente el primer día</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {clientAccessRequestList.map((item) => (
              <div key={item} className="rounded-lg border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-4">
                <p className="text-sm leading-6 text-[rgba(245,241,234,0.76)]">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-bone-2">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Kickoff lunes</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Secuencia mínima para instalarlo sin improvisar</h2>
          <div className="mt-5 space-y-3">
            {mondayEnterpriseKickoffList.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-md border border-[color:var(--line)] bg-bone p-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-[0.58rem] font-bold text-bone">{index + 1}</span>
                <p className="text-sm leading-6 text-fog">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Accesos por integración</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {connectorAccessMatrix.map((item) => (
            <div key={item.connector} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <h3 className="text-xl font-semibold text-ink">{item.connector}</h3>
              <p className="mt-2 text-sm leading-6 text-fog">{item.access}</p>
              <p className="mt-3 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Responsable: {item.owner}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-bone-2">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Checklist producción</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {productionEnvironmentChecklist.map((item) => (
            <div key={item} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <CheckCircle2 className="size-5 text-ember" />
              <p className="mt-3 text-sm font-semibold leading-6 text-ink">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InstallMetric({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <Card>
      <Icon className="size-5 text-ember" />
      <p className="mt-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{detail}</p>
    </Card>
  );
}
