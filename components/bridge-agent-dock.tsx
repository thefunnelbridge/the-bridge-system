"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BrainCircuit, MessageCircle, Radio, Sparkles, X, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLayerByRoute } from "@/lib/onboarding";
import { getBridgeCompanion } from "@/lib/bridge-companion";
import { calculateAdvancedScores } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getScanResponses, getTrackerTasks } from "@/lib/storage";

export function BridgeAgentDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [companion, setCompanion] = useState<ReturnType<typeof getBridgeCompanion> | null>(null);

  const currentLayer = useMemo(() => getLayerByRoute(pathname), [pathname]);

  useEffect(() => {
    const sync = () => {
      const company = getCompanyProfile();
      setCompanion(getBridgeCompanion(company, calculateAdvancedScores(getScanResponses()), getDataRoom(), getTrackerTasks()));
    };
    sync();
    window.addEventListener("bridge-system:storage", sync);
    return () => window.removeEventListener("bridge-system:storage", sync);
  }, []);

  const messages = useMemo(() => {
    const layerMessage = currentLayer
      ? `Estás en ${currentLayer.name}. Mi trabajo aquí es traducir esta capa en una acción clara.`
      : "Estoy mirando la operación completa para sugerir el siguiente paso.";
    return [
      layerMessage,
      companion?.nextBestAction ?? "Si haces una sola cosa hoy, registra próxima acción en las oportunidades abiertas.",
      companion?.dailyFocus ?? "Foco del día: convertir señales dispersas en tareas con responsable.",
      companion?.automationReadinessAdvice ?? "Antes de automatizar, hagamos visible el proceso.",
    ];
  }, [companion, currentLayer]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="fixed bottom-5 right-5 z-50 hidden w-[360px] max-w-[calc(100vw-2rem)] lg:block">
      {open ? (
        <div className="animate-bridge-slide-up overflow-hidden rounded-xl border border-[rgba(255,59,31,0.36)] bg-[#10100f] text-bone shadow-[0_28px_90px_rgba(10,10,10,0.28)]">
          <div className="relative p-4">
            <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
            <div className="flex items-start gap-3">
              <span className="relative grid size-12 shrink-0 place-items-center rounded-lg bg-ember text-bone shadow-[0_0_32px_rgba(255,59,31,0.32)]">
                <BrainCircuit className="size-6" />
                <span className="absolute -right-1 -top-1 size-3 rounded-full bg-copper ring-4 ring-[#10100f]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-copper">Bridge Agent™</p>
                    <h3 className="mt-1 text-lg font-semibold leading-tight">Operational AI layer active</h3>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Ocultar Bridge Agent" className="text-[rgba(245,241,234,0.62)] hover:text-bone">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[rgba(245,241,234,0.8)]">{messages[messageIndex]}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <AgentLink href="/app/pulse" icon={Radio} label="Pulse" />
              <AgentLink href="/app/flow" icon={Zap} label="Action" />
              <AgentLink href="/app/intro" icon={BrainCircuit} label="Guide" />
            </div>
            <Link href="/app/paula-engine" className="mt-3 flex items-center justify-between rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.06)] px-3 py-3 text-sm font-semibold transition hover:border-ember hover:bg-[rgba(255,59,31,0.12)]">
              Abrir Paula Engine™ <ArrowRight className="size-4 text-copper" />
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="ml-auto flex animate-bridge-float items-center gap-3 rounded-full border border-[rgba(255,59,31,0.38)] bg-[#10100f] px-4 py-3 text-bone shadow-[0_20px_70px_rgba(10,10,10,0.25)] transition hover:-translate-y-1"
        >
          <span className="grid size-9 place-items-center rounded-full bg-ember">
            <MessageCircle className="size-4" />
          </span>
          <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Agent activo</span>
          <Sparkles className="size-4 text-ember" />
        </button>
      )}
    </div>
  );
}

function AgentLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} className="group rounded-md border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.06)] p-3 text-center transition hover:border-ember hover:bg-[rgba(255,59,31,0.12)]">
      <Icon className="mx-auto size-4 text-copper transition group-hover:text-ember" />
      <span className="mt-2 block font-mono text-[0.56rem] font-bold uppercase tracking-[0.1em] text-[rgba(245,241,234,0.78)]">{label}</span>
    </Link>
  );
}
