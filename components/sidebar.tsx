"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  GitBranch,
  Home,
  Plug,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  { href: "/app", label: "Resumen", icon: Home },
  { href: "/app/profile", label: "Perfil", icon: Building2 },
  { href: "/app/scan", label: "Bridge Scan™", icon: ClipboardList },
  { href: "/app/results", label: "Bridge Insight™", icon: BarChart3 },
  { href: "/app/flow", label: "Bridge Flow™", icon: GitBranch },
  { href: "/app/tracker", label: "Tracker", icon: Sparkles },
  { href: "/app/report", label: "Informe", icon: FileText },
  { href: "/app/integrations", label: "Integraciones", icon: Plug },
  { href: "/app/settings", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[color:var(--line)] bg-bone-2/70 md:fixed md:inset-y-0 md:left-0 md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col p-4">
        <Link href="/app" className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-copper">THE BRIDGE SYSTEM™</p>
          <p className="mt-2 text-sm text-fog">by THE FUNNEL BRIDGE™</p>
        </Link>
        <nav className="mt-5 grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-ink text-bone" : "text-ink hover:bg-bone"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden rounded-lg border border-[color:var(--line)] bg-bone p-4 md:block">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Bridge Brain™</p>
          <p className="mt-2 text-sm leading-6 text-fog">AI layer ready para la próxima versión con inteligencia aplicada.</p>
        </div>
      </div>
    </aside>
  );
}
