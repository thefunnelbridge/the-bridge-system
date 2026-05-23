"use client";

import { AlertTriangle, CheckCircle2, Clock, Flame, Target, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { BridgeCompanionPanel } from "@/components/bridge-companion-panel";
import { ExcellenceScorePanel } from "@/components/excellence-score-panel";
import { InternalCommsPanel } from "@/components/internal-comms-panel";
import { ServiceStandardPanel } from "@/components/service-standard-panel";
import { Card } from "@/components/ui/card";
import { getIndustryInduction } from "@/lib/industry-induction";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses, getTrackerTasks } from "@/lib/storage";
import { brokerageOffices, getTeamRoles } from "@/lib/team-culture";
import type { AdvancedScores, CompanyProfile, TrackerTask } from "@/lib/types";

export default function TeamPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);
  const [tasks, setTasks] = useState<TrackerTask[]>([]);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setScores(calculateAdvancedScores(getScanResponses()));
    setTasks(getTrackerTasks());
  }, []);

  const roles = useMemo(() => (company ? getTeamRoles(company) : []), [company]);

  if (!company || !scores) return null;
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const induction = getIndustryInduction(company);
  const overloaded = roles.filter((role) => role.operationalLoad === "Alta" || role.operationalLoad === "Crítica").length;
  const withoutSystem = roles.filter((role) => role.status === "Sin sistema" || role.status === "Sobrecarga").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Team & Culture"
        title="Tablero humano de ejecución"
        description="Vista de roles, carga operativa, riesgos culturales y entrenamientos para convertir esfuerzo individual en sistema compartido."
      />

      <Card className="bg-ink text-bone">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Hoy para el equipo</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">Dar foco sin vigilar. Convertir carga en claridad.</h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              The Bridge System™ no controla personas: ayuda a que cada rol sepa su misión, bloqueo, microlección y siguiente avance.
            </p>
          </div>
          <div className="grid gap-3">
            <TeamToday label="Trabajadores bloqueados" value={withoutSystem} />
            <TeamToday label="Tareas críticas" value={tasks.filter((task) => task.priority === "Alta" && task.status !== "Implementado").length} />
            <TeamToday label="Microlecciones pendientes" value={roles.length} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Roles observados" value={roles.length} detail="Funciones críticas conectadas al diagnóstico." icon={Users} />
        <StatCard label="Sobrecarga operativa" value={overloaded} detail="Roles con carga alta o crítica." icon={AlertTriangle} />
        <StatCard label="Riesgo cultural" value={withoutSystem} detail="Roles con hábitos sin sistema visible." icon={Clock} />
        <StatCard label="Training need" value={`${scores.teamTrainingNeed}%`} detail="Necesidad de entrenamiento derivada del scan." icon={CheckCircle2} />
      </div>

      <Card>
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Ritual semanal sugerido</p>
            <h2 className="mt-2 text-2xl font-semibold">Reunión Bridge de 25 minutos</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">
              Revisar score, 3 fugas, 3 tareas y 1 aprendizaje. La meta no es controlar al equipo: es quitarle peso mental, hacer visibles los compromisos y convertir la mejora continua en un hábito liviano.
            </p>
          </div>
          <div className="rounded-lg bg-bone-2 p-4">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Feedback recomendado</p>
            <p className="mt-3 text-sm leading-6 text-fog">
              “Esta semana no buscamos hacer más cosas. Buscamos que ninguna oportunidad crítica quede sin próxima acción clara.”
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-copper/40 bg-bone-2">
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Inducción personalizada</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{induction.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">{induction.simpleExplanation}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {induction.whatToEnter.map((item) => (
                <div key={item} className="rounded-md border border-[color:var(--line)] bg-bone p-3">
                  <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Dato a ingresar</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-5">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Checklist del líder</p>
            <div className="mt-4 space-y-3">
              {induction.managerChecklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-md bg-bone-2 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ember" />
                  <p className="text-sm leading-6 text-fog">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-md bg-ink p-4 text-sm leading-6 text-bone">{induction.companionTone}</p>
          </div>
        </div>
      </Card>

      <ExcellenceScorePanel scores={scores} />

      <ServiceStandardPanel scores={scores} />

      <InternalCommsPanel company={company} scores={scores} tasks={tasks} compact />

      <BridgeCompanionPanel compact />

      <div className="grid gap-4 xl:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.role} className="group overflow-hidden transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{role.status}</p>
                <h2 className="mt-2 text-xl font-semibold">{role.role}</h2>
              </div>
              <span className="w-fit rounded bg-bone-2 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fog">
                Carga {role.operationalLoad}
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-bone-2">
              <div className="h-full rounded-full bg-ember transition-all group-hover:w-[78%]" style={{ width: role.operationalLoad === "Crítica" ? "34%" : role.operationalLoad === "Alta" ? "48%" : "68%" }} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-bone p-3">
                <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper"><Target className="size-3" /> Misión asignada</p>
                <p className="mt-2 text-sm leading-6 text-fog">{role.assignedTasks[0]}</p>
              </div>
              <div className="rounded-md bg-bone p-3">
                <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper"><Flame className="size-3" /> Bloqueo</p>
                <p className="mt-2 text-sm leading-6 text-fog">{role.associatedLeaks[0]}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-ink">Responsabilidades</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-fog">
                  {role.responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Fugas asociadas</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-fog">
                  {role.associatedLeaks.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-5 rounded-md bg-bone-2 p-4">
              <p className="text-sm leading-6 text-fog"><strong className="text-ink">Microlección:</strong> {role.recommendedLesson}</p>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">Riesgo cultural:</strong> {role.culturalRisk}</p>
            </div>
          </Card>
        ))}
      </div>

      {brokerage ? (
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Brokerage Performance View</p>
          <h2 className="mt-2 text-2xl font-semibold">Oficinas, corredores y oportunidades dormidas</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--line)] font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fog">
                  <th className="py-3 pr-4">Oficina</th>
                  <th className="py-3 pr-4">Corredores</th>
                  <th className="py-3 pr-4">Leads</th>
                  <th className="py-3 pr-4">Respuesta</th>
                  <th className="py-3 pr-4">Sin seguimiento</th>
                  <th className="py-3 pr-4">Visitas</th>
                  <th className="py-3 pr-4">Ofertas</th>
                  <th className="py-3 pr-4">Alerta</th>
                  <th className="py-3 pr-4">Entrenamiento</th>
                </tr>
              </thead>
              <tbody>
                {brokerageOffices.map((office) => (
                  <tr key={office.office} className="border-b border-[color:var(--line)] last:border-0">
                    <td className="py-4 pr-4 font-semibold">{office.office}</td>
                    <td className="py-4 pr-4">{office.agents}</td>
                    <td className="py-4 pr-4">{office.leads}</td>
                    <td className="py-4 pr-4">{office.responseTime}</td>
                    <td className="py-4 pr-4">{office.unfollowed}</td>
                    <td className="py-4 pr-4">{office.visits}</td>
                    <td className="py-4 pr-4">{office.offers}</td>
                    <td className="py-4 pr-4 text-copper">{office.alert}</td>
                    <td className="py-4 pr-4">{office.recommendedTraining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function TeamToday({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-4">
      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-bone">{value}</p>
    </div>
  );
}
