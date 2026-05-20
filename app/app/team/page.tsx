"use client";

import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { BridgeCompanionPanel } from "@/components/bridge-companion-panel";
import { ExcellenceScorePanel } from "@/components/excellence-score-panel";
import { Card } from "@/components/ui/card";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses } from "@/lib/storage";
import { brokerageOffices, getTeamRoles } from "@/lib/team-culture";
import type { AdvancedScores, CompanyProfile } from "@/lib/types";

export default function TeamPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setScores(calculateAdvancedScores(getScanResponses()));
  }, []);

  const roles = useMemo(() => (company ? getTeamRoles(company) : []), [company]);

  if (!company || !scores) return null;
  const brokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const overloaded = roles.filter((role) => role.operationalLoad === "Alta" || role.operationalLoad === "Crítica").length;
  const withoutSystem = roles.filter((role) => role.status === "Sin sistema" || role.status === "Sobrecarga").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Team & Culture"
        title="Bridge Culture™"
        description="Vista de roles, carga operativa, riesgos culturales y entrenamientos para convertir esfuerzo individual en sistema compartido."
      />

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

      <ExcellenceScorePanel scores={scores} />

      <BridgeCompanionPanel compact />

      <div className="grid gap-4 xl:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.role}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{role.status}</p>
                <h2 className="mt-2 text-xl font-semibold">{role.role}</h2>
              </div>
              <span className="w-fit rounded bg-bone-2 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fog">
                Carga {role.operationalLoad}
              </span>
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
