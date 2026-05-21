"use client";

import { Compass, FileDown, Radio, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { demoCompanies } from "@/lib/demo-data";
import { getCompanyProfile, setSelectedCompanyId } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";
import { Button } from "./ui/button";

export function Topbar() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const syncCompany = () => setCompany(getCompanyProfile());
    syncCompany();
    window.addEventListener("bridge-system:storage", syncCompany);
    return () => window.removeEventListener("bridge-system:storage", syncCompany);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[rgba(245,241,234,0.9)] px-4 py-4 backdrop-blur-xl md:px-8">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember to-transparent opacity-60" />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative grid size-16 place-items-center rounded-xl bg-ink text-ember shadow-[0_18px_45px_rgba(10,10,10,0.18)]">
            <Radio className="size-7 animate-pulse" />
            <span className="absolute -right-1 -top-1 rounded-full bg-ember px-1.5 py-0.5 font-mono text-[0.48rem] font-bold uppercase tracking-[0.08em] text-bone">live</span>
          </span>
          <div>
            <p className="font-display text-4xl font-semibold leading-none text-ink lg:text-[2.6rem]">The Bridge System™</p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fog">{company?.name ?? "Empresa demo"} · Operational Intelligence Layer</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={company?.id ?? ""}
            onChange={(event) => {
              setSelectedCompanyId(event.target.value);
              setCompany(getCompanyProfile());
            }}
            className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3 font-mono text-xs uppercase tracking-[0.1em] text-ink"
          >
            {demoCompanies.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <Button href="/app/intro" variant="secondary"><Compass className="size-4" /> Empieza aquí</Button>
          <Button href="/app/report" variant="secondary"><FileDown className="size-4" /> Exportar informe</Button>
          <Button href="/app/scan"><RotateCcw className="size-4" /> Nuevo Scan</Button>
        </div>
      </div>
    </header>
  );
}
