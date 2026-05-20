"use client";

import { Bell, BookOpen, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { getDailyMissions, leadershipSignals, operatingPlaybooks } from "@/lib/operating-intelligence";
import { getCompanyProfile } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function OperatingIntelligencePanel({ compact = false }: { compact?: boolean }) {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [notificationStatus, setNotificationStatus] = useState("Demo");

  useEffect(() => {
    setCompany(getCompanyProfile());
    setNotificationStatus("Simulado");
  }, []);

  if (!company) return null;
  const missions = getDailyMissions(company);
  const playbooks = compact ? operatingPlaybooks.slice(0, 3) : operatingPlaybooks;

  function requestNotifications() {
    setNotificationStatus("Push próximamente");
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Operating Intelligence™</p>
            <h2 className="mt-2 text-2xl font-semibold">Aprender de los mejores sistemas y convertirlo en operación diaria</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-fog">
              Esta capa traduce prácticas públicas de excelencia operacional, servicio, cultura, respuesta comercial y mejora continua en metas visibles para el equipo.
            </p>
          </div>
          <Button variant="secondary" onClick={requestNotifications}>
            <Bell className="size-4" /> Notificaciones: {notificationStatus}
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {missions.map((mission) => (
          <Card key={mission.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ember/10 text-ember"><Target className="size-4" /></span>
              <div>
                <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.13em] text-copper">{mission.owner}</p>
                <h3 className="mt-2 text-lg font-semibold">{mission.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fog">Meta: {mission.target}</p>
                <p className="mt-2 text-sm leading-6 text-fog">Notificación: {mission.notification}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {playbooks.map((playbook) => (
          <Card key={playbook.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-bone-2 text-copper"><BookOpen className="size-4" /></span>
              <div>
                <p className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.13em] text-copper">{playbook.origin}</p>
                <h3 className="mt-2 text-lg font-semibold">{playbook.name}</h3>
                <p className="mt-2 text-sm leading-6 text-fog">{playbook.bridgeTranslation}</p>
                <p className="mt-3 text-sm leading-6 text-fog"><strong className="text-ink">Meta viva:</strong> {playbook.liveMetric}</p>
                <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">Pregunta de líder:</strong> {playbook.managerPrompt}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!compact ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {leadershipSignals.map((signal) => (
            <Card key={signal.text}>
              <p className="font-display text-2xl leading-tight text-ink">{signal.text}</p>
              <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.13em] text-copper">{signal.attribution}</p>
              <p className="mt-3 text-sm leading-6 text-fog">{signal.bridgeUse}</p>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
