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
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[rgba(245,241,234,0.86)] px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-lg bg-ink text-copper shadow-[0_12px_30px_rgba(10,10,10,0.12)]">
            <Radio className="size-5 animate-pulse" />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold leading-none text-ink">The Bridge System™</p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fog">{company?.name ?? "Empresa demo"} · Operational Intelligence Layer</p>
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
