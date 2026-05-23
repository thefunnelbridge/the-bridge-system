"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ClipboardList,
  Compass,
  Database,
  FileText,
  GitBranch,
  Home,
  Inbox,
  Library,
  CreditCard,
  Plug,
  Rocket,
  Radio,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

const groups = [
  {
    label: "Operación",
    items: [
      { href: "/app/intro", label: "Empieza aquí", icon: Compass },
      { href: "/app/setup", label: "Activation Setup", icon: Rocket },
      { href: "/app/playbooks", label: "Industry Playbooks", icon: ClipboardList },
      { href: "/app", label: "Command Center", icon: Home },
      { href: "/app/pulse", label: "Bridge Pulse™", icon: Radio },
      { href: "/app/live-goals", label: "Live Goals™", icon: Target },
      { href: "/app/inbox", label: "Bridge Inbox™", icon: Inbox },
    ],
  },
  {
    label: "Inteligencia",
    items: [
      { href: "/app/company", label: "Empresa", icon: Building2 },
      { href: "/app/data-room", label: "Data Room", icon: Database },
      { href: "/app/trends", label: "Bridge Trends™", icon: TrendingUp },
      { href: "/app/scan", label: "Bridge Scan™", icon: ClipboardList },
      { href: "/app/insight", label: "Bridge Insight™", icon: BarChart3 },
      { href: "/app/paula-engine", label: "Paula Engine™", icon: Sparkles },
    ],
  },
  {
    label: "Ejecución",
    items: [
      { href: "/app/flow", label: "Bridge Flow™", icon: GitBranch },
      { href: "/app/workers/today", label: "Workers", icon: Target },
      { href: "/app/team", label: "Bridge Culture™", icon: Users },
      { href: "/app/academy", label: "Bridge Academy™", icon: Library },
    ],
  },
  {
    label: "Dirección",
    items: [
      { href: "/app/implementation", label: "Implementation", icon: Rocket },
      { href: "/app/billing", label: "Billing", icon: CreditCard },
      { href: "/app/integrations", label: "Integrations", icon: Plug },
      { href: "/app/report", label: "Executive Report", icon: FileText },
      { href: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[color:var(--line)] bg-[rgba(239,232,219,0.88)] backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:w-80 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col p-4">
        <Link href="/app" className="bridge-dark-wave group rounded-xl border border-[rgba(245,241,234,0.14)] p-5 text-bone shadow-[0_24px_70px_rgba(10,10,10,0.16)]">
          <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
          <div className="relative">
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-copper">THE BRIDGE SYSTEM™</p>
            <p className="mt-3 font-display text-4xl font-semibold leading-[0.9]">Bridge System</p>
            <p className="mt-2 text-sm text-[rgba(245,241,234,0.68)]">by THE FUNNEL BRIDGE™</p>
          </div>
        </Link>
        <nav className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em] text-copper">{group.label}</p>
              <div className="grid gap-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/app" && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-ink text-bone shadow-[0_12px_28px_rgba(10,10,10,0.14)]"
                          : "text-ink hover:bg-bone hover:shadow-[0_10px_30px_rgba(10,10,10,0.05)]"
                      }`}
                    >
                      {active ? <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-1 rounded-r-full bg-ember" /> : null}
                      <Icon className={`size-4 transition ${active ? "text-ember" : "text-ink group-hover:text-copper"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-auto hidden rounded-xl border border-[color:var(--line)] bg-bone p-4 shadow-[0_12px_36px_rgba(10,10,10,0.04)] md:block">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Brain™</p>
          <p className="mt-2 text-sm leading-6 text-fog">AI layer ready · datos, trends, inbox y acción diaria.</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bone-2">
            <div className="h-full w-[72%] rounded-full bg-copper" />
          </div>
        </div>
      </div>
    </aside>
  );
}
