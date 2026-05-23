"use client";

import Link from "next/link";
import { Award, CheckCircle2, Circle, Clock, Flame, GitBranch, Radio, ShieldAlert, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ActivityEvent } from "@/lib/activity-feed";
import { BridgeSignalSvg } from "./bridge-visuals";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export type MapNodeStatus = "Completo" | "En progreso" | "En riesgo" | "Pendiente";

export function MissionControl({
  mission,
  nextAction,
  risk,
  owner,
  deadline,
  progress,
}: {
  mission: string;
  nextAction: string;
  risk: string;
  owner: string;
  deadline: string;
  progress: number;
}) {
  return (
    <section className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-5 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)] lg:p-7">
      <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
      <BridgeSignalSvg className="pointer-events-none absolute -right-12 top-0 h-44 w-[54%] text-copper opacity-40" />
      <div className="grid gap-7 xl:grid-cols-[1fr_380px] xl:items-end">
        <div>
          <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-copper">Mission Control · Operational Intelligence Layer</p>
          <p className="mt-4 font-display text-4xl font-semibold leading-none text-bone lg:text-6xl">The Bridge System™</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[0.98] text-[rgba(245,241,234,0.94)] lg:text-6xl">{mission}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">{nextAction}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/app/flow" className="border-bone bg-bone text-ink hover:border-ember hover:bg-ember hover:text-bone">
              <Zap className="size-4" /> Activar misión
            </Button>
            <Button href="/app/pulse" className="border-[rgba(245,241,234,0.22)] bg-transparent text-bone hover:border-ember hover:bg-ember hover:text-bone">
              <Radio className="size-4" /> Ver Pulse
            </Button>
          </div>
        </div>
        <div className="bridge-glass relative rounded-lg border p-5 backdrop-blur">
          <div className="grid gap-3">
            <MissionMeta icon={ShieldAlert} label="Riesgo principal" value={risk} />
            <MissionMeta icon={Target} label="Responsable sugerido" value={owner} />
            <MissionMeta icon={Clock} label="Deadline" value={deadline} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-copper">Progreso misión</p>
              <p className="font-mono text-sm font-bold text-bone">{progress}%</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full rounded-full bg-ember transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionMeta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-3">
      <div className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">
        <Icon className="size-3.5 text-ember" /> {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-[rgba(245,241,234,0.78)]">{value}</p>
    </div>
  );
}

export function BridgeMap({ nodes }: { nodes: { label: string; href: string; status: MapNodeStatus }[] }) {
  const statusStyles: Record<MapNodeStatus, string> = {
    Completo: "border-copper bg-bone-2 text-ink",
    "En progreso": "border-ember bg-[rgba(255,59,31,0.08)] text-ink",
    "En riesgo": "border-ember bg-ink text-bone",
    Pendiente: "border-[color:var(--line)] bg-white/45 text-fog",
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Map™</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Mapa vivo del sistema</h2>
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog">Data → Diagnosis → Action → People → Learning</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {nodes.map((node, index) => (
          <Link key={node.label} href={node.href} className={`group relative min-h-32 rounded-lg border p-4 transition hover:-translate-y-1 hover:border-copper ${statusStyles[node.status]}`}>
            {index < nodes.length - 1 ? <span aria-hidden className="absolute -right-3 top-1/2 hidden h-px w-6 bg-copper/50 xl:block" /> : null}
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-8 place-items-center rounded-md bg-bone text-copper ring-1 ring-[color:var(--line)]">
                <GitBranch className="size-4" />
              </span>
              <span className="font-mono text-[0.56rem] uppercase tracking-[0.1em]">{node.status}</span>
            </div>
            <p className="mt-5 text-sm font-semibold leading-5">{node.label}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function AchievementBadges({ badges }: { badges: { label: string; active: boolean }[] }) {
  return (
    <Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Achievement Badges</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Avances visibles del sistema</h2>
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog">{badges.filter((badge) => badge.active).length}/{badges.length} activos</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.label} className={`rounded-lg border p-4 transition hover:-translate-y-1 ${badge.active ? "border-copper bg-bone-2" : "border-[color:var(--line)] bg-white/45 opacity-70"}`}>
            <div className="flex items-center gap-3">
              <span className={`grid size-10 place-items-center rounded-md ${badge.active ? "bg-ember text-bone" : "bg-bone text-fog"}`}>
                {badge.active ? <Award className="size-5" /> : <Circle className="size-5" />}
              </span>
              <p className="font-semibold text-ink">{badge.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function LiveFeedPanel({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Live Feed™</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Actividad operativa reciente</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-bone-2 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-copper">
          <Flame className="size-3.5 text-ember" /> Simulación live
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="grid gap-3 rounded-lg border border-[color:var(--line)] bg-bone p-4 transition hover:-translate-y-0.5 hover:border-copper md:grid-cols-[82px_1fr_120px] md:items-center">
            <p className="font-mono text-sm text-copper">{new Date(event.time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</p>
            <div>
              <p className="font-semibold text-ink">{event.area} · {event.event}</p>
              <p className="mt-1 text-sm leading-6 text-fog">{event.suggestedAction}</p>
            </div>
            <span className="rounded-md bg-bone-2 px-3 py-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.1em] text-fog">{event.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ScoreDeck({ scores }: { scores: { label: string; value: number; detail: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {scores.map((score) => (
        <div key={score.label} className="group rounded-xl border border-[color:var(--line)] bg-white/50 p-4 shadow-[0_16px_45px_rgba(10,10,10,0.04)] transition hover:-translate-y-1 hover:border-copper hover:bg-bone-2">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.1em] text-copper">{score.label}</p>
            <CheckCircle2 className="size-4 text-ember" />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
            <div className="h-full rounded-full bg-ember transition-all duration-700" style={{ width: `${score.value}%` }} />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-ink">{score.value}%</p>
          <p className="mt-1 text-xs leading-5 text-fog">{score.detail}</p>
        </div>
      ))}
    </div>
  );
}
