"use client";

import { FileDown, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompanyProfile } from "@/lib/storage";
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
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-bone/90 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-copper">The Bridge System™</p>
          <p className="mt-1 text-sm text-fog">{company?.name ?? "Empresa demo"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/app/report" variant="secondary"><FileDown className="size-4" /> Exportar informe</Button>
          <Button href="/app/scan"><RotateCcw className="size-4" /> Nuevo Scan</Button>
        </div>
      </div>
    </header>
  );
}
