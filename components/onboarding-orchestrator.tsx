"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, ChevronRight, Compass, HelpCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { bridgeLayerGuides, getLayerByRoute, onboardingSteps } from "@/lib/onboarding";
import { Button } from "./ui/button";

const seenKey = "bridge-system.onboarding.seen";
const completedKey = "bridge-system.onboarding.completed";

function readCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(completedKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function OnboardingOrchestrator() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const currentLayer = useMemo(() => getLayerByRoute(pathname), [pathname]);
  const nextStep = onboardingSteps.find((step) => !completed.includes(step.id)) ?? onboardingSteps[0];

  useEffect(() => {
    setCompleted(readCompleted());
    const hasSeen = window.localStorage.getItem(seenKey) === "true";
    if (!hasSeen) {
      const timer = window.setTimeout(() => {
        setOpen(true);
        setToastOpen(true);
        window.localStorage.setItem(seenKey, "true");
      }, 800);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setToastOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleStep(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    window.localStorage.setItem(completedKey, JSON.stringify(next));
  }

  return (
    <>
      {toastOpen ? (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm animate-bridge-slide-up rounded-lg border border-[color:var(--line)] bg-[#10100f] p-4 text-bone shadow-[0_24px_80px_rgba(10,10,10,0.22)] lg:right-[400px]">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[rgba(255,59,31,0.14)] text-ember">
              <Bell className="size-4" />
            </span>
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Companion™</p>
              <p className="mt-1 text-sm leading-6 text-[rgba(245,241,234,0.82)]">
                {currentLayer ? `Estás en ${currentLayer.name}: ${currentLayer.simple}` : "Empieza por la introducción para entender el sistema completo."}
              </p>
              <button onClick={() => setOpen(true)} className="mt-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-bone">
                Ver guía rápida
              </button>
            </div>
            <button onClick={() => setToastOpen(false)} aria-label="Cerrar notificación" className="text-[rgba(245,241,234,0.72)] hover:text-bone">
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full border border-[color:var(--line)] bg-bone px-4 py-3 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink shadow-[0_18px_50px_rgba(10,10,10,0.12)] transition hover:-translate-y-0.5 hover:border-copper md:inline-flex"
      >
        <HelpCircle className="size-4 text-copper" /> Empieza aquí
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[rgba(10,10,10,0.34)] p-4 backdrop-blur-sm">
          <div className="mx-auto flex max-h-[92vh] max-w-6xl flex-col overflow-hidden rounded-xl border border-[color:var(--line)] bg-bone shadow-[0_30px_100px_rgba(10,10,10,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] p-5">
              <div>
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-copper">Introducción guiada</p>
                <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink">Empieza aquí: entiende qué hace cada capa</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-fog">The Bridge System™ funciona como una capa viva: primero entiende la empresa, luego detecta señales, recomienda acciones y guía al equipo.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar guía" className="grid size-10 shrink-0 place-items-center rounded-md border border-[color:var(--line)] bg-bone-2 text-ink">
                <X className="size-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
                <section className="space-y-4">
                  <div className="rounded-lg bg-[#10100f] p-5 text-bone">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-md bg-[rgba(255,59,31,0.14)] text-ember"><Compass className="size-5" /></span>
                      <div>
                        <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Ruta recomendada</p>
                        <h3 className="mt-1 text-xl font-semibold">No navegues al azar</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[rgba(245,241,234,0.76)]">Si es tu primera vez, sigue esta secuencia. Marca cada paso cuando lo entiendas o lo completes.</p>
                  </div>
                  {onboardingSteps.map((step, index) => {
                    const done = completed.includes(step.id);
                    return (
                      <button
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`w-full rounded-lg border p-4 text-left transition ${done ? "border-copper bg-bone-2" : "border-[color:var(--line)] bg-white/45 hover:border-copper"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${done ? "border-copper bg-copper text-white" : "border-[color:var(--line)] text-copper"}`}>
                            {done ? <CheckCircle2 className="size-4" /> : index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-ink">{step.title}</p>
                            <p className="mt-1 text-sm leading-6 text-fog">{step.description}</p>
                            <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-copper">{step.duration}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <Button href={nextStep.route} className="w-full justify-center" onClick={() => setOpen(false)}>
                    Continuar: {nextStep.title} <ChevronRight className="size-4" />
                  </Button>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  {bridgeLayerGuides.map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <Link
                        href={layer.route}
                        key={layer.id}
                        onClick={() => setOpen(false)}
                        className="group rounded-lg border border-[color:var(--line)] bg-white/45 p-5 transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2"
                      >
                        <div className="flex items-start gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-md border border-[color:var(--line)] bg-bone text-copper transition group-hover:border-copper">
                            <Icon className="size-5" />
                          </span>
                          <div>
                            <h3 className="font-semibold text-ink">{layer.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-fog">{layer.simple}</p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm leading-6 text-fog">
                          <p><strong className="text-ink">Para qué sirve:</strong> {layer.whyItMatters}</p>
                          <p><strong className="text-ink">Qué haces:</strong> {layer.whatToDo}</p>
                          <p><strong className="text-ink">Qué entrega:</strong> {layer.output}</p>
                        </div>
                      </Link>
                    );
                  })}
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div aria-hidden className="pointer-events-none fixed inset-x-72 top-0 z-0 hidden h-px bg-gradient-to-r from-transparent via-copper to-transparent opacity-40 md:block" />
      <Sparkles className="pointer-events-none fixed right-8 top-24 z-0 hidden size-4 animate-bridge-float text-copper opacity-70 lg:block" />
    </>
  );
}
