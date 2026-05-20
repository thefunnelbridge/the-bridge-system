"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Compass, MousePointer2, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bridgeLayerGuides, introNarrative, onboardingSteps } from "@/lib/onboarding";

const completedKey = "bridge-system.onboarding.completed";

function readCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(completedKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export default function IntroPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => setCompleted(readCompleted()), []);

  function toggle(id: string) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next);
    window.localStorage.setItem(completedKey, JSON.stringify(next));
  }

  const progress = Math.round((completed.length / onboardingSteps.length) * 100);
  const nextStep = onboardingSteps.find((step) => !completed.includes(step.id)) ?? onboardingSteps[0];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#10100f] p-6 text-bone shadow-[0_24px_80px_rgba(10,10,10,0.16)] lg:p-8">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(184,117,71,0.22),transparent_35%,rgba(255,59,31,0.12)_70%,transparent)]" />
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-copper">Empieza aquí</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-7xl">Aprende a usar The Bridge System™ sin perderte.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(245,241,234,0.78)]">
              Esta es la guía simple: qué es cada capa, por qué existe, qué debes hacer primero y cómo se convierte en acciones para tu empresa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={nextStep.route}><Play className="size-4" /> Continuar ruta</Button>
              <Button href="/app" variant="secondary"><Compass className="size-4" /> Ir al Command Center</Button>
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Progreso de activación</p>
                <p className="mt-2 text-4xl font-semibold">{progress}%</p>
              </div>
              <span className="grid size-12 place-items-center rounded-md bg-[rgba(255,59,31,0.12)] text-ember">
                <Sparkles className="size-6" />
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full bg-copper transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[rgba(245,241,234,0.72)]">Siguiente paso sugerido: {nextStep.title}</p>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="For Dummies, pero premium"
        title="La versión simple"
        description="Si una persona entra sin contexto, debe entender esto: el sistema observa la operación, interpreta señales y activa decisiones diarias."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {introNarrative.map((item) => (
          <Card key={item.title} className="group overflow-hidden">
            <div className="mb-5 h-1 w-16 rounded-full bg-copper transition-all group-hover:w-28" />
            <h2 className="text-2xl font-semibold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-fog">{item.text}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Card className="h-fit">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Ruta de activación</p>
          <h2 className="mt-2 text-2xl font-semibold">Qué hacer primero</h2>
          <div className="mt-5 space-y-3">
            {onboardingSteps.map((step, index) => {
              const done = completed.includes(step.id);
              return (
                <div key={step.id} className="rounded-md border border-[color:var(--line)] bg-bone p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(step.id)}
                      className={`grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs ${done ? "border-copper bg-copper text-white" : "border-[color:var(--line)] text-copper"}`}
                      aria-label={`Marcar ${step.title}`}
                    >
                      {done ? <CheckCircle2 className="size-4" /> : index + 1}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-ink">{step.title}</p>
                        <span className="inline-flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-copper"><Clock className="size-3" /> {step.duration}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-fog">{step.description}</p>
                      <Link href={step.route} className="mt-3 inline-flex items-center gap-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-ink">
                        Abrir paso <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {bridgeLayerGuides.map((layer) => {
            const Icon = layer.icon;
            return (
              <Link href={layer.route} key={layer.id} className="group rounded-lg border border-[color:var(--line)] bg-white/45 p-5 shadow-[0_16px_45px_rgba(10,10,10,0.035)] transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-md border border-[color:var(--line)] bg-bone text-copper transition group-hover:border-copper group-hover:bg-copper group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <MousePointer2 className="size-4 text-fog opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-ink">{layer.name}</h3>
                <p className="mt-2 text-sm leading-6 text-fog">{layer.simple}</p>
                <div className="mt-4 space-y-2 text-sm leading-6 text-fog">
                  <p><strong className="text-ink">Para qué sirve:</strong> {layer.whyItMatters}</p>
                  <p><strong className="text-ink">Qué haces:</strong> {layer.whatToDo}</p>
                  <p><strong className="text-ink">Qué entrega:</strong> {layer.output}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
