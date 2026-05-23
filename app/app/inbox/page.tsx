"use client";

import { AlertCircle, Archive, ArrowRight, Clock, FileText, GitBranch, MessageSquare, PanelTop, Tag, UserCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInboxMetrics, getSuggestedInboxTags, type BridgeInboxConversation, type ConversationStatus } from "@/lib/inbox";
import { getCompanyProfile, getInboxConversations, saveInboxConversations } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

const statuses: ConversationStatus[] = [
  "Nuevo lead",
  "En conversación",
  "Cotización enviada",
  "Seguimiento pendiente",
  "Cliente dormido",
  "Documento pendiente",
  "Cerrado",
  "Requiere atención",
];

export default function BridgeInboxPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [conversations, setConversations] = useState<BridgeInboxConversation[]>([]);
  const [filter, setFilter] = useState<"Todas" | ConversationStatus>("Todas");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setCompany(getCompanyProfile());
    setConversations(getInboxConversations());
  }, []);

  const metrics = useMemo(() => getInboxMetrics(conversations), [conversations]);
  const visible = filter === "Todas" ? conversations : conversations.filter((item) => item.status === filter);

  function updateConversation(id: string, patch: Partial<BridgeInboxConversation>) {
    const next = conversations.map((item) => (item.id === id ? { ...item, ...patch } : item));
    setConversations(next);
    saveInboxConversations(next);
  }

  function assignNextAction(conversation: BridgeInboxConversation) {
    updateConversation(conversation.id, {
      responsible: conversation.responsible === "Sin asignar" ? "Coordinación comercial" : conversation.responsible,
      nextAction: conversation.nextAction || "Contactar cliente, confirmar necesidad y registrar siguiente paso.",
      status: conversation.status === "Nuevo lead" ? "Seguimiento pendiente" : conversation.status,
    });
    setNotice("Conversación ordenada con responsable y próxima acción.");
  }

  if (!company) return null;

  return (
    <div className="space-y-8">
      <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-6 text-bone shadow-[0_28px_100px_rgba(10,10,10,0.24)] lg:p-8">
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-copper">Bridge Inbox™ · Conversation Intelligence</p>
            <p className="mt-3 font-display text-5xl font-semibold leading-none text-bone lg:text-7xl">Bridge Inbox™</p>
            <h1 className="mt-5 max-w-5xl font-display text-4xl font-semibold leading-[0.98] text-[rgba(245,241,234,0.95)] lg:text-6xl">Tus conversaciones ya son parte del negocio. Ahora también pueden ser parte del sistema.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.78)]">
              Bridge Inbox™ convierte WhatsApp, emails, formularios y chats en oportunidades con responsable, estado, trazabilidad y próxima acción.
            </p>
          </div>
          <div className="bridge-glass rounded-lg border p-5 backdrop-blur">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Principio operativo</p>
            <p className="mt-3 text-lg leading-7">El cliente no debería perderse dentro de un chat. Los archivos no deberían vivir enterrados en conversaciones.</p>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Bridge Inbox™"
        title="Conversaciones convertidas en oportunidades accionables"
        description="Organiza WhatsApp, emails, formularios y chats como señales operativas: cada conversación debe tener responsable, estado, archivo y próxima acción."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversaciones abiertas" value={metrics.openConversations} detail="Canales activos con oportunidad o atención pendiente." icon={MessageSquare} />
        <StatCard label="Sin responsable" value={metrics.unassigned} detail="Conversaciones que dependen de memoria o buena voluntad." icon={UserCheck} />
        <StatCard label="Sin próxima acción" value={metrics.withoutNextAction} detail="Clientes esperando claridad sobre el siguiente paso." icon={Clock} />
        <StatCard label="Archivos dispersos" value={metrics.scatteredFiles} detail="Documentos, audios o cotizaciones enterradas en chats." icon={Archive} />
      </div>

      <Card className="bg-bone-2">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Conversation Bridge™</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Conversaciones dispersas → Bridge Inbox™ → oportunidad accionable</h2>
            <p className="mt-3 text-sm leading-7 text-fog">Cada mensaje se transforma en una unidad operativa con dueño, estado, archivo, prioridad y próxima acción.</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-2 text-center">
            <BridgeStep label="Mensajes" />
            <span className="h-px bg-copper" />
            <BridgeStep label="Acción" dark />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <InboxStage title="Entrada" value={metrics.openConversations} text="Mensajes que llegaron desde WhatsApp, email, formularios o DM." />
        <InboxStage title="Orden" value={metrics.openConversations - metrics.unassigned} text="Conversaciones con alguien responsable mirando el siguiente paso." />
        <InboxStage title="Acción" value={metrics.openConversations - metrics.withoutNextAction} text="Clientes con próxima acción registrada, no enterrada en el chat." />
        <InboxStage title="Alerta" value={metrics.dormantOpportunities} text="Oportunidades dormidas que el sistema debe levantar antes de perderlas." />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Inbox operativo demo</p>
              <h2 className="mt-2 text-2xl font-semibold">Conversaciones por estado, canal y fuga detectada</h2>
            </div>
            <Button href="/app/pulse" variant="secondary">Ver pulso</Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(["Todas", ...statuses] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                  filter === status ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {notice ? <p className="mt-4 rounded-md bg-bone-2 p-3 text-sm text-fog">{notice}</p> : null}
          <div className="mt-5 space-y-4">
            {visible.map((conversation) => (
              <div key={conversation.id} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-ink">{conversation.customer}</h3>
                      <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-copper">{conversation.channel}</span>
                      <span className="rounded bg-bone-2 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-copper">{conversation.priority}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-fog">{conversation.detectedLeak}</p>
                    <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-fog">Última interacción: {conversation.lastInteraction} · Responsable: {conversation.responsible}</p>
                  </div>
                  <select
                    className="h-10 rounded-md border border-[color:var(--line)] bg-white px-3 text-sm outline-none"
                    value={conversation.status}
                    onChange={(event) => updateConversation(conversation.id, { status: event.target.value as ConversationStatus })}
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <Info label="Próxima acción" value={conversation.nextAction || "Sin próxima acción registrada"} />
                  <Info label="Archivo asociado" value={conversation.associatedFile} />
                  <Info label="Script sugerido" value={conversation.suggestedScript} />
                </div>
                <div className="mt-4 rounded-md border border-copper/30 bg-bone-2 p-3">
                  <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper"><Zap className="size-3" /> Próxima mejor acción</p>
                  <p className="mt-2 text-sm leading-6 text-fog">
                    {conversation.nextAction ? "Confirmar que la acción tenga fecha, responsable y canal." : "Asignar responsable, registrar próxima acción y mover la conversación fuera de la memoria del chat."}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {conversation.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line)] bg-white px-2 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-fog">
                      <Tag className="size-3" /> {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => assignNextAction(conversation)}>Asignar próxima acción</Button>
                  <Button variant="ghost" onClick={() => updateConversation(conversation.id, { unreadMessages: 0 })}>Marcar respondida</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="bg-ink text-bone">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Próxima mejor acción</p>
            <h3 className="mt-3 text-2xl font-semibold">Ordenar conversaciones críticas antes de que se enfríen.</h3>
            <p className="mt-3 text-sm leading-6 text-[rgba(245,241,234,0.76)]">
              Asigna responsable, estado y siguiente paso a las conversaciones sin dueño. Ese es el puente mínimo entre mensaje y oportunidad.
            </p>
            <Button href="/app/flow" className="mt-5 border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone">Convertir en misión <ArrowRight className="size-4" /></Button>
          </Card>
          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Etiquetas sugeridas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {getSuggestedInboxTags(company.industry).map((tag) => (
                <span key={tag} className="rounded-md bg-bone-2 px-3 py-2 text-sm text-ink">{tag}</span>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Señales críticas</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
              <Signal icon={AlertCircle} text={`${metrics.unansweredMessages} mensajes sin respuesta visible.`} />
              <Signal icon={FileText} text={`${metrics.pendingDocuments} conversaciones con documento pendiente.`} />
              <Signal icon={Clock} text={`${metrics.dormantOpportunities} oportunidades dormidas.`} />
              <Signal icon={MessageSquare} text={`${metrics.internalMixedWithSales} conversaciones mezclan ventas con coordinación interna.`} />
            </div>
          </Card>

          <Card className="bg-bone-2">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">For Dummies</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Qué significa ordenar conversaciones</h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
              <GuideLine text="Un chat sin responsable es una oportunidad sin dueño." />
              <GuideLine text="Un cliente sin próxima acción queda esperando que alguien se acuerde." />
              <GuideLine text="Un archivo dentro de WhatsApp no es trazabilidad." />
              <GuideLine text="Bridge Inbox™ convierte cada conversación en una unidad de operación." />
            </div>
            <Button href="/app/flow" variant="secondary" className="mt-5">Enviar a Bridge Flow™ <ArrowRight className="size-4" /></Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BridgeStep({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${dark ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink"}`}>
      <GitBranch className={`mx-auto size-5 ${dark ? "text-ember" : "text-copper"}`} />
      <p className="mt-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em]">{label}</p>
    </div>
  );
}

function InboxStage({ title, value, text }: { title: string; value: number; text: string }) {
  return (
    <Card className="group hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-md bg-ink text-bone transition group-hover:bg-ember">
          <PanelTop className="size-5" />
        </span>
        <p className="font-mono text-3xl font-bold text-ink">{value}</p>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-fog">{text}</p>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--line)] bg-white p-3">
      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{label}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{value}</p>
    </div>
  );
}

function Signal({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-bone p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-ember" />
      <p>{text}</p>
    </div>
  );
}

function GuideLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
      <p>{text}</p>
    </div>
  );
}
