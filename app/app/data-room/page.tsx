"use client";

import { ArrowRight, CheckCircle2, Database, FileStack, MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
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

const tabGuides: Record<(typeof tabs)[number], { title: string; why: string; action: string }> = {
  leads: {
    title: "Demanda y velocidad comercial",
    why: "Aquí vive la señal de entrada: leads, consultas, canales, objeciones y dónde se pierden.",
    action: "Actualiza volumen, tiempo de respuesta y porcentaje sin seguimiento.",
  },
  sales: {
    title: "Pipeline y conversión",
    why: "Ventas muestra si existe proceso comercial o solo esfuerzo individual.",
    action: "Revisa ticket, ciclo, cierre, vendedores, etapas y KPI principal.",
  },
  communication: {
    title: "Mensaje y confianza",
    why: "Si cada persona responde distinto, el cliente siente fricción aunque la empresa tenga demanda.",
    action: "Ordena tono, mensajes, preguntas frecuentes, scripts y canales.",
  },
  operations: {
    title: "Sistema interno",
    why: "La operación revela si el crecimiento escala o solo aumenta caos.",
    action: "Identifica tareas repetitivas, responsables, herramientas y cuellos de botella.",
  },
  team: {
    title: "Equipo y adopción",
    why: "El sistema solo funciona si las personas entienden foco, carga, roles y rituales.",
    action: "Revisa entrenamiento, reuniones, coordinación y responsables.",
  },
  files: {
    title: "Archivos como evidencia",
    why: "Los documentos convierten conversaciones dispersas en datos que el sistema puede interpretar.",
    action: "Simula CSV, WhatsApp, reportes, guiones y bases de clientes.",
  },
  benchmarks: {
    title: "Señales de comparación",
    why: "Los benchmarks ayudan a entender si una métrica representa una fuga o una oportunidad.",
    action: "Lee alertas y señales públicas antes de priorizar acciones.",
  },
};

function valueToText(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

function fieldToLabel(field: string) {
  const knownLabels: Record<string, string> = {
    leadsMensuales: "Leads mensuales",
    consultasMensuales: "Consultas mensuales",
    tiempoPromedioRespuesta: "Tiempo promedio de respuesta",
    porcentajeSinSeguimiento: "Porcentaje sin seguimiento",
    canalesPrincipales: "Canales principales",
    objecionesFrecuentes: "Objeciones frecuentes",
    etapaDondeMasSePierden: "Etapa donde más se pierden",
    ventasMensuales: "Ventas mensuales",
    ticketPromedio: "Ticket promedio",
    cicloDeVenta: "Ciclo de venta",
    tasaDeCierre: "Tasa de cierre",
    cantidadDeVendedores: "Cantidad de vendedores",
    etapasPipeline: "Etapas del pipeline",
    kpiPrincipal: "KPI principal",
    tonoMarca: "Tono de marca",
    mensajesFrecuentes: "Mensajes frecuentes",
    preguntasFrecuentes: "Preguntas frecuentes",
    scriptsExistentes: "Scripts existentes",
    canalesAtencion: "Canales de atención",
    consistenciaMensaje: "Consistencia del mensaje",
    procesosCriticos: "Procesos críticos",
    tareasRepetitivas: "Tareas repetitivas",
    herramientasUsadas: "Herramientas usadas",
    responsables: "Responsables",
    cuellosDeBotella: "Cuellos de botella",
    dependenciaPersonaClave: "Dependencia de persona clave",
    roles: "Roles",
    nivelEntrenamiento: "Nivel de entrenamiento",
    reunionesSeguimiento: "Reuniones de seguimiento",
    cargaOperativa: "Carga operativa",
    problemasCoordinacion: "Problemas de coordinación",
    compradoresClasificados: "Compradores clasificados",
    presupuestoPromedio: "Presupuesto promedio",
    comunasMasSolicitadas: "Comunas más solicitadas",
    urgenciaCompra: "Urgencia de compra",
    visitasAgendadas: "Visitas agendadas",
    visitasRealizadas: "Visitas realizadas",
    ofertasEmitidas: "Ofertas emitidas",
    propietariosContactados: "Propietarios contactados",
    tasacionesRealizadas: "Tasaciones realizadas",
    propiedadesCaptadas: "Propiedades captadas",
    propiedadesPublicadas: "Propiedades publicadas",
    propiedadesSinMovimiento: "Propiedades sin movimiento",
    seguimientoPostTasacion: "Seguimiento post tasación",
    numeroCorredores: "Número de corredores",
    leadsPorCorredor: "Leads por corredor",
    respuestaPromedioCorredor: "Respuesta promedio por corredor",
    proximasAccionesRegistradas: "Próximas acciones registradas",
    oportunidadesDormidas: "Oportunidades dormidas",
    reunionesPipeline: "Reuniones de pipeline",
    numeroOficinas: "Número de oficinas",
    leadsPorOficina: "Leads por oficina",
    conversionPorOficina: "Conversión por oficina",
    lideresOficina: "Líderes de oficina",
    alertasPorOficina: "Alertas por oficina",
  };
  if (knownLabels[field]) return knownLabels[field];
  return field
    .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-záéíóúñ])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
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
  const completionItems = [
    dataRoom.leads.tiempoPromedioRespuesta,
    dataRoom.leads.porcentajeSinSeguimiento,
    dataRoom.sales.kpiPrincipal,
    dataRoom.communication.mensajesFrecuentes,
    dataRoom.operations.cuellosDeBotella,
    dataRoom.team.roles,
  ].filter(Boolean).length;
  const completion = Math.round((completionItems / 6) * 100);
  const activeGuide = tabGuides[active];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#10100f] p-6 text-bone shadow-[0_24px_80px_rgba(10,10,10,0.16)] lg:p-8">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(184,117,71,0.24),transparent_34%,rgba(255,59,31,0.12)_72%,transparent)]" />
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-copper">Data Room · Intelligence Fuel</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-6xl">Alimenta el sistema con la verdad operativa de la empresa.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Esta pantalla no es un formulario. Es la sala de contexto: aquí entran leads, ventas, WhatsApp, procesos, equipo, archivos y benchmarks para que Bridge Scan™, Insight, Pulse y Flow no trabajen a ciegas.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/app/scan" className="border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone"><Sparkles className="size-4" /> Usar en Bridge Scan™</Button>
              <Button href="/app/inbox" className="border-[rgba(245,241,234,0.22)] bg-transparent text-bone hover:border-ember hover:bg-ember hover:text-bone"><MessageSquare className="size-4" /> Ordenar conversaciones</Button>
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Contexto cargado</p>
                <p className="mt-2 text-4xl font-semibold">{completion}%</p>
              </div>
              <Database className="size-7 text-ember" />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full rounded-full bg-copper transition-all" style={{ width: `${completion}%` }} />
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[rgba(245,241,234,0.76)]">
              <p>Empresa: <strong className="text-bone">{company.name}</strong></p>
              <p>Industria: <strong className="text-bone">{company.industry}</strong></p>
              <p>Estado: <strong className="text-bone">localStorage demo activo</strong></p>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader eyebrow="Data Room" title="Centro de alimentación del sistema" description="Edita la información base que alimenta diagnóstico, tendencias, Pulse, Inbox, recomendaciones y reporte ejecutivo." />

      <div className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
        <Card className="h-fit">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Fuentes internas</p>
          <div className="mt-4 grid gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`group flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition ${
                  active === tab ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"
                }`}
              >
                <span>{labels[tab]}</span>
                <ArrowRight className={`size-4 ${active === tab ? "text-copper" : "text-fog group-hover:text-copper"}`} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[color:var(--line)] pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">{labels[active]}</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{activeGuide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-fog">{activeGuide.why}</p>
          </div>
          <span className="rounded-md bg-bone-2 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-copper">{activeGuide.action}</span>
        </div>
        {active === "files" ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {dataRoom.files.map((file) => (
              <div key={file.name} className="group rounded-lg border border-[color:var(--line)] bg-bone p-4 transition hover:-translate-y-1 hover:border-copper">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{file.name}</p>
                  <FileStack className="size-4 text-copper" />
                </div>
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
                <span className="break-words text-sm font-semibold text-copper">{fieldToLabel(field)}</span>
                <textarea
                  className="min-h-12 resize-y rounded-md border border-[color:var(--line)] bg-bone px-3 py-3 text-sm leading-6 outline-none focus:border-copper"
                  value={valueToText(value)}
                  onChange={(event) => update(active, field, event.target.value)}
                />
              </label>
            ))}
          </div>
        )}
        </Card>

        <div className="space-y-5">
          <Card className="bg-bone-2">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Qué mira el sistema</p>
            <div className="mt-4 space-y-3">
              {[
                ["Velocidad", "Tiempo de respuesta y oportunidades sin seguimiento."],
                ["Consistencia", "Mensajes, scripts, tono y experiencia por canal."],
                ["Dependencia", "Procesos que viven en memoria humana."],
                ["Datos", "Herramientas, archivos y trazabilidad disponible."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-md border border-[color:var(--line)] bg-bone p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-copper" />
                    <p className="font-semibold text-ink">{title}</p>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-fog">{text}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Data Health</p>
            <div className="mt-4 grid gap-3">
              <MiniMetric label="Contexto cargado" value={`${completion}%`} />
              <MiniMetric label="Archivos demo" value={dataRoom.files.length} />
              <MiniMetric label="Benchmarks activos" value={dataRoom.benchmarks.length + 3} />
              <MiniMetric label="Señales Inbox" value={inboxMetrics.openConversations} />
            </div>
          </Card>
        </div>
      </div>

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
                  {Object.entries(values).map(([key, value]) => <p key={key} className="leading-5">{fieldToLabel(key)}: <strong className="text-ink">{valueToText(value)}</strong></p>)}
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
