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
  Plug,
  Radio,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const items = [
  { href: "/app/intro", label: "Empieza aquí", icon: Compass },
  { href: "/app", label: "Command Center", icon: Home },
  { href: "/app/company", label: "Empresa", icon: Building2 },
  { href: "/app/data-room", label: "Data Room", icon: Database },
  { href: "/app/inbox", label: "Bridge Inbox™", icon: Inbox },
  { href: "/app/trends", label: "Bridge Trends™", icon: TrendingUp },
  { href: "/app/pulse", label: "Bridge Pulse™", icon: Radio },
  { href: "/app/scan", label: "Bridge Scan™", icon: ClipboardList },
  { href: "/app/insight", label: "Bridge Insight™", icon: BarChart3 },
  { href: "/app/flow", label: "Bridge Flow™", icon: GitBranch },
  { href: "/app/paula-engine", label: "Paula Engine™", icon: Sparkles },
  { href: "/app/team", label: "Team & Culture", icon: Users },
  { href: "/app/academy", label: "Bridge Academy™", icon: Library },
  { href: "/app/integrations", label: "Integrations", icon: Plug },
  { href: "/app/report", label: "Executive Report", icon: FileText },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[color:var(--line)] bg-[rgba(239,232,219,0.82)] backdrop-blur md:fixed md:inset-y-0 md:left-0 md:w-80 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col p-4">
        <Link href="/app" className="group relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#10100f] p-5 text-bone shadow-[0_24px_70px_rgba(10,10,10,0.16)]">
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(125deg,rgba(184,117,71,0.22),transparent_46%,rgba(255,59,31,0.12))]" />
          <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
          <div className="relative">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-copper">THE BRIDGE SYSTEM™</p>
            <p className="mt-3 font-display text-3xl font-semibold leading-none">Bridge OS</p>
            <p className="mt-2 text-sm text-[rgba(245,241,234,0.68)]">by THE FUNNEL BRIDGE™</p>
          </div>
        </Link>
        <nav className="mt-5 grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-ink text-bone shadow-[0_12px_28px_rgba(10,10,10,0.14)]" : "text-ink hover:bg-bone hover:shadow-[0_10px_30px_rgba(10,10,10,0.05)]"
                }`}
              >
                <Icon className={`size-4 transition ${active ? "text-copper" : "text-ink group-hover:text-copper"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
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
