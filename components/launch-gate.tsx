"use client";

import { ArrowRight, Radio, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const launchKey = "bridge-system.launch.seen";

export function LaunchGate() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem(launchKey) === "true";
    if (!seen) {
      const timer = window.setTimeout(() => setVisible(true), 180);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function enter() {
    window.localStorage.setItem(launchKey, "true");
    setVisible(false);
  }

  function goIntro() {
    enter();
    router.push("/app/intro");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-[#0A0A0A] text-bone">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(110deg,rgba(184,117,71,0.32),transparent_32%,rgba(255,59,31,0.18)_68%,transparent)]" />
      <div aria-hidden className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(245,241,234,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,234,0.55)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">THE FUNNEL BRIDGE™</p>
            <p className="mt-2 text-sm text-[rgba(245,241,234,0.68)]">Operational intelligence layer</p>
          </div>
          <button onClick={enter} className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[rgba(245,241,234,0.68)] hover:text-bone">
            Saltar
          </button>
        </header>

        <main className="grid gap-10 py-12 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(245,241,234,0.16)] bg-[rgba(245,241,234,0.06)] px-4 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">
              <Radio className="size-4 animate-pulse text-ember" /> Sistema vivo inicializando
            </div>
            <h1 className="mt-6 max-w-5xl font-display text-6xl font-semibold leading-[0.88] lg:text-8xl">
              The Bridge System™
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[rgba(245,241,234,0.78)]">
              La capa viva que convierte datos, tendencias y fricción interna en acciones diarias para el equipo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={enter} className="border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone">
                Entrar al sistema <ArrowRight className="size-4" />
              </Button>
              <Button onClick={goIntro} className="border-[rgba(245,241,234,0.22)] bg-transparent text-bone hover:border-ember hover:bg-ember hover:text-bone">
                Ver introducción
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Live layers</p>
                <p className="mt-2 text-2xl font-semibold">Data → Signals → Action</p>
              </div>
              <Sparkles className="size-5 animate-bridge-float text-ember" />
            </div>
            <div className="mt-5 space-y-3">
              {["Data Room conectado", "Bridge Pulse activo", "Inbox ordenando conversaciones", "Trends leyendo señales", "Companion listo para guiar"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-[rgba(245,241,234,0.1)] bg-[rgba(10,10,10,0.22)] px-4 py-3">
                  <span className="text-sm text-[rgba(245,241,234,0.78)]">{item}</span>
                  <span className="size-2 rounded-full bg-ember shadow-[0_0_18px_rgba(255,59,31,0.75)]" />
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[rgba(245,241,234,0.48)]">
          No muestra solo datos. Traduce señales en acción.
        </footer>
      </div>
    </div>
  );
}
