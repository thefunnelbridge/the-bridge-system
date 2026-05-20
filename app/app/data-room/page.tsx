"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { benchmarks } from "@/lib/benchmarks";
import { getInboxMetrics } from "@/lib/inbox";
import { getCompanyProfile, getDataRoom, getInboxConversations, saveDataRoom } from "@/lib/storage";
import type { CompanyProfile, DataRoom } from "@/lib/types";

const tabs = ["leads", "sales", "communication", "operations", "team", "files", "benchmarks"] as const;
const labels: Record<string, string> = {
  leads: "Clientes y leads",
  sales: "Ventas",
  communication: "Comunicación",
  operations: "Operación",
  team: "Equipo",
  files: "Archivos",
  benchmarks: "Benchmarks",
};

function valueToText(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

export default function DataRoomPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [active, setActive] = useState<(typeof tabs)[number]>("leads");

  useEffect(() => {
    setCompany(getCompanyProfile());
    setDataRoom(getDataRoom());
  }, []);

  if (!company || !dataRoom) return null;
  const isBrokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";

  function update(section: keyof DataRoom, field: string, value: string) {
    if (!dataRoom) return;
    const next = { ...dataRoom, [section]: { ...(dataRoom[section] as object), [field]: value } };
    setDataRoom(next);
    saveDataRoom(next);
  }

  const current = dataRoom[active];
  const inboxMetrics = getInboxMetrics(getInboxConversations());

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Data Room" title="Centro de alimentación del sistema" description="Datos operativos demo para que el diagnóstico entienda leads, ventas, comunicación, operación, equipo y benchmarks." />
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)} className={`rounded-md border px-3 py-2 text-sm ${active === tab ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink"}`}>{labels[tab]}</button>
        ))}
      </div>
      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">{labels[active]}</p>
        {active === "files" ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {dataRoom.files.map((file) => (
              <div key={file.name} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
                <p className="font-semibold">{file.name}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-copper">{file.status}</p>
              </div>
            ))}
          </div>
        ) : active === "benchmarks" ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[...dataRoom.benchmarks, ...benchmarks.slice(0, 3).map((benchmark) => benchmark.productImplication)].map((item) => (
              <div key={item} className="rounded-md border border-[color:var(--line)] bg-bone p-4 text-sm leading-6 text-fog">{item}</div>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(current as Record<string, unknown>).map(([field, value]) => (
              <label key={field} className="grid gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">{field}</span>
                <input className="h-11 rounded-md border border-[color:var(--line)] bg-bone px-3 outline-none focus:border-copper" value={valueToText(value)} onChange={(event) => update(active, field, event.target.value)} />
              </label>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Inbox™</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Conversaciones como datos operativos</h2>
            <p className="mt-3 text-sm leading-7 text-fog">
              Bridge Inbox™ convierte WhatsApp, emails, formularios y chats en señales que alimentan el Data Room: responsables, estados, archivos, tiempos de respuesta, scripts y próximas acciones.
            </p>
            <p className="mt-3 text-sm leading-7 text-fog">No reemplaza WhatsApp. Lo ordena, lo mide y lo conecta con el sistema operativo de la empresa.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniMetric label="Sin próxima acción" value={inboxMetrics.withoutNextAction} />
            <MiniMetric label="Sin responsable" value={inboxMetrics.unassigned} />
            <MiniMetric label="Archivos dispersos" value={inboxMetrics.scatteredFiles} />
            <MiniMetric label="Mensajes sin respuesta" value={inboxMetrics.unansweredMessages} />
          </div>
        </div>
      </Card>

      {isBrokerage && dataRoom.brokerage ? (
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Brokerage Data Room</p>
          <div className="mt-5 grid gap-4 xl:grid-cols-4">
            {Object.entries(dataRoom.brokerage).map(([section, values]) => (
              <div key={section} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
                <h3 className="font-semibold capitalize">{section}</h3>
                <div className="mt-3 space-y-2 text-xs text-fog">
                  {Object.entries(values).map(([key, value]) => <p key={key}>{key}: <strong className="text-ink">{valueToText(value)}</strong></p>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-bone p-4">
      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
