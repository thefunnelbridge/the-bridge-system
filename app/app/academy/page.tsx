"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { academyLessons } from "@/lib/academy";
import { getIndustryRules } from "@/lib/industry-rules";
import { getCompanyProfile } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

export default function AcademyPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setCompleted(JSON.parse(localStorage.getItem("bridge-system.academy") ?? "[]"));
  }, []);

  const lessons = useMemo(() => {
    if (!company) return academyLessons;
    return Array.from(new Set([...getIndustryRules(company.industry).academyLessons, ...academyLessons]));
  }, [company]);

  function complete(title: string) {
    const next = Array.from(new Set([...completed, title]));
    setCompleted(next);
    localStorage.setItem("bridge-system.academy", JSON.stringify(next));
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Bridge Academy™" title="Microentrenamientos por fuga" description="Lecciones cortas para convertir recomendaciones en hábitos de equipo, con foco por industria y progreso local." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="font-mono text-xs text-copper">Lecciones</p><p className="mt-2 text-3xl font-semibold">{lessons.length}</p></Card>
        <Card><p className="font-mono text-xs text-copper">Completadas</p><p className="mt-2 text-3xl font-semibold">{completed.length}</p></Card>
        <Card><p className="font-mono text-xs text-copper">Foco</p><p className="mt-2 text-lg font-semibold">{company?.industry ?? "Industria demo"}</p></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {lessons.map((title, index) => (
          <Card key={title}>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{12 + (index % 5) * 3} min · {index % 2 === 0 ? "equipo comercial" : "dirección y operación"}</p>
            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-fog">Objetivo: instalar un estándar simple, humano y medible. Contenido: contexto, ejemplo, checklist y práctica en un caso real del negocio.</p>
            <div className="mt-4 rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">
              Ejercicio práctico: tomar 5 oportunidades recientes, aplicar el criterio de la lección y registrar una próxima acción verificable.
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-fog">{completed.includes(title) ? "Completada" : "Pendiente"}</span>
              <Button variant="secondary" onClick={() => complete(title)}>Completar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
