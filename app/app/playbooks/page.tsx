"use client";

import { ArrowRight, BadgeCheck, Clock, Database, PlayCircle, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clientPlaybooks, getClientPlaybook } from "@/lib/client-playbooks";
import { getIndustryInduction } from "@/lib/industry-induction";
import { getCompanyProfile } from "@/lib/storage";
import type { CompanyProfile, DemoIndustry } from "@/lib/types";

export default function PlaybooksPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(clientPlaybooks[0].industry);

  useEffect(() => {
    const current = getCompanyProfile();
    setCompany(current);
    setSelectedIndustry(current.industry);
  }, []);

  const playbook = useMemo(() => {
    if (selectedIndustry === "Empresa con sucursales") return clientPlaybooks[0];
    return getClientPlaybook(selectedIndustry);
  }, [selectedIndustry]);
  const inductionIndustry: DemoIndustry | null = company
    ? playbook.industry === "Empresa con sucursales"
      ? company.industry
      : playbook.industry
    : null;
  const induction = company && inductionIndustry ? getIndustryInduction({ ...company, industry: inductionIndustry }) : null;

  return (
    <div className="space-y-8">
      <div className="bridge-dark-wave overflow-hidden rounded-xl border border-[rgba(245,241,234,0.12)] p-7 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)]">
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Industry Playbooks™</p>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-semibold leading-[0.96] lg:text-7xl">La forma simple de vender e instalar The Bridge System™ por industria.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Cada playbook traduce la plataforma a lenguaje real de negocio: qué duele, qué datos pedir, quién entra, qué se activa en 72 horas y cuál es el momento “esto lo necesito”.
            </p>
          </div>
          <Card className="border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.08)] text-bone">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Playbook activo</p>
            <h2 className="mt-3 text-2xl font-semibold">{playbook.industry}</h2>
            <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.72)]">{playbook.proofMoment}</p>
          </Card>
        </div>
      </div>

      <SectionHeader
        eyebrow="Venta consultiva"
        title="Qué mostrar según el tipo de empresa"
        description="Esto ayuda a que un cliente no sienta que está mirando una demo genérica, sino una versión pensada para su operación."
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {clientPlaybooks.map((item) => (
          <button
            key={item.industry}
            onClick={() => setSelectedIndustry(item.industry)}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] transition ${
              selectedIndustry === item.industry ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"
            }`}
          >
            {item.industry}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Lenguaje para vender</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{playbook.buyerLanguage}</h2>
          <p className="mt-4 text-lg leading-8 text-fog">{playbook.installationPromise}</p>
          <div className="mt-6 rounded-xl bg-ink p-5 text-bone">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Primera conversación</p>
            <p className="mt-3 text-2xl font-semibold leading-tight">{playbook.firstConversation}</p>
          </div>
        </Card>

        <Card className="bg-bone-2">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Momento de prueba</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Cómo hacer que el cliente lo entienda rápido</h2>
          <p className="mt-3 text-sm leading-7 text-fog">{playbook.proofMoment}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button href="/app/setup" variant="secondary"><PlayCircle className="size-4" /> Activar setup</Button>
            <Button href="/app/workers/today"><ArrowRight className="size-4" /> Ver trabajador</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <PlaybookSection icon={Database} title="Datos mínimos" items={playbook.minimumData} />
        <PlaybookSection icon={Users} title="Roles a invitar" items={playbook.rolesToInvite} />
        <PlaybookSection icon={Clock} title="Primeras 72 horas" items={playbook.first72Hours} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Live Goals™ sugeridas</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {playbook.liveGoals.map((goal) => (
              <div key={goal} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <Target className="size-5 text-ember" />
                <p className="mt-3 text-sm font-semibold leading-6 text-ink">{goal}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Indicadores ejecutivos</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {playbook.executiveKPIs.map((kpi) => (
              <div key={kpi} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <BadgeCheck className="size-5 text-copper" />
                <p className="mt-3 text-sm font-semibold leading-6 text-ink">{kpi}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Card className="bg-ink text-bone">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Vista trabajador</p>
          <h2 className="mt-3 text-3xl font-semibold">Qué debe ingresar el equipo</h2>
          <div className="mt-5 space-y-3">
            {playbook.workerInputs.map((input) => (
              <div key={input} className="rounded-md border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-3">
                <p className="text-sm leading-6 text-[rgba(245,241,234,0.76)]">{input}</p>
              </div>
            ))}
          </div>
        </Card>

        {induction ? (
          <Card className="bg-bone-2">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Inducción conectada</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">{induction.title}</h2>
            <p className="mt-3 text-sm leading-7 text-fog">{induction.simpleExplanation}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {induction.managerChecklist.map((item) => (
                <div key={item} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                  <p className="font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function PlaybookSection({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-ink text-copper">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">{title}</p>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item} className="rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
