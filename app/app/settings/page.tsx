"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoCompanies } from "@/lib/demo-data";
import { exportDemoData, getCompanyProfile, resetDemo, setSelectedCompanyId } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

const nextFeatures = [
  "Supabase Auth",
  "Multiempresa",
  "Usuarios por equipo",
  "OpenAI / Bridge Brain™",
  "Integraciones reales",
  "Reportes PDF avanzados",
];

const systemStatus = [
  ["Bridge Inbox™", "active demo"],
  ["Bridge Trends™", "active demo"],
  ["Bridge Pulse™", "active demo"],
  ["Live Goals™", "active"],
  ["Notification Engine", "simulated"],
  ["Worker Mobile View", "active"],
  ["PWA", "ready"],
  ["Push Notifications", "planned"],
  ["Real-time Integrations", "planned"],
  ["Learning Loop", "active"],
  ["Bridge Excellence Library", "active"],
  ["Bridge Companion™", "active"],
  ["Bridge Service Standard™", "active"],
  ["Strategic Scorecard™", "active"],
];

const differentiators = [
  "Se alimenta de la empresa.",
  "Se alimenta del mundo.",
  "Traduce todo a acción.",
  "Notifica al equipo.",
  "Tiene capa humana.",
  "Mejora con cada empresa.",
];

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => setCompany(getCompanyProfile()), []);

  function handleReset() {
    resetDemo();
    setCompany(getCompanyProfile());
    setNotice("Demo restaurada.");
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(exportDemoData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bridge-system-demo-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Configuración demo" title="Estado de la primera versión" description="La app opera sin backend obligatorio y queda preparada para conectar Supabase, OpenAI e integraciones reales." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Modo demo activado</p>
          <h2 className="mt-3 text-2xl font-semibold">{company?.name ?? "Empresa actual"}</h2>
          <p className="mt-3 text-sm leading-6 text-fog">Persistencia inicial con localStorage. Ideal para demo funcional y despliegue inmediato en Vercel.</p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="secondary" onClick={handleReset}><RotateCcw className="size-4" /> Resetear demo</Button>
            <Button variant="secondary" onClick={downloadJson}>Exportar data JSON</Button>
            {notice ? <span className="text-sm text-fog">{notice}</span> : null}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Empresa demo seleccionada</p>
          <select
            className="mt-4 h-11 w-full rounded-md border border-[color:var(--line)] bg-bone px-3"
            value={company?.id ?? ""}
            onChange={(event) => {
              setSelectedCompanyId(event.target.value);
              setCompany(getCompanyProfile());
            }}
          >
            {demoCompanies.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="mt-4 space-y-2 text-sm text-fog">
            <p>Estado almacenamiento: localStorage</p>
            <p>Estado Supabase: pendiente</p>
            <p>Estado OpenAI: pendiente</p>
            <p>Estado integraciones reales: demo</p>
            <p>Versión: 0.3 Research-driven</p>
            <p>Licencia: Demo privada · The Funnel Bridge SpA · Todos los derechos reservados</p>
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Uso diario y mobile</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {systemStatus.map(([label, status]) => (
              <div key={label} className="rounded-md border border-[color:var(--line)] bg-bone p-3">
                <p className="font-semibold text-ink">{label}</p>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-copper">{status}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">
            The Bridge System™ está preparado para funcionar como app instalable. En esta demo las notificaciones son simuladas; en producción se activarán mediante servicios push y roles por usuario.
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Posicionamiento operativo</p>
          <p className="mt-3 text-sm leading-7 text-fog">
            The Bridge System™ es una capa de inteligencia operativa para empresas que necesitan decidir y actuar más rápido. No se completa una vez: se instala como capa viva sobre la operación diaria. Cada dato, tendencia, tarea y feedback alimenta la próxima decisión.
          </p>
          <p className="mt-4 rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">
            No es inteligencia artificial por moda. Es inteligencia aplicada al momento exacto en que una empresa necesita decidir, actuar y mejorar.
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Qué hace distinto a The Bridge System™</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item} className="rounded-md border border-[color:var(--line)] bg-bone p-3 text-sm font-semibold text-ink">{item}</div>
            ))}
          </div>
          <div className="mt-5 space-y-2 text-sm leading-6 text-fog">
            <p>No muestra solo datos. Traduce señales en acción.</p>
            <p>El sistema no reemplaza al equipo. Le devuelve foco.</p>
            <p>Antes de automatizar, hacemos visible la operación.</p>
            <p>La próxima mejor acción no debería depender de memoria humana.</p>
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Próximas funciones</p>
          <ul className="mt-4 space-y-3 text-sm text-fog">
            {nextFeatures.map((feature) => <li key={feature} className="border-b border-[color:var(--line)] pb-2 last:border-0">{feature}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
