"use client";

import { Award, BookOpen, CheckCircle2, Flame, GitBranch, PlayCircle, Target, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { academyCourses } from "@/lib/academy";
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
    if (!company) return academyCourses;
    const industryCourses = getIndustryRules(company.industry).academyLessons.map((title, index) => ({
      id: `industry-${index}-${title.toLowerCase().replace(/\s+/g, "-")}`,
      title,
      level: "Operación" as const,
      duration: `${12 + (index % 4) * 3} min`,
      audience: "Equipo según industria",
      leakFocus: "Fuga crítica detectada por industria",
      objective: "Convertir una práctica recomendada de la industria en hábito visible del equipo.",
      content: [
        "Contexto de la fuga en esta industria.",
        "Estándar mínimo esperado por rol.",
        "Cómo registrar evidencia de avance en The Bridge System™.",
      ],
      exercise: "Tomar 5 casos recientes de la empresa, aplicar la práctica y registrar próxima acción con responsable.",
      checklist: ["Caso real", "Responsable", "Próxima acción", "KPI", "Aprendizaje compartido"],
      outcome: "Mejor consistencia del equipo frente a una fuga propia de la industria.",
    }));
    const byTitle = new Map([...industryCourses, ...academyCourses].map((course) => [course.title, course]));
    return Array.from(byTitle.values());
  }, [company]);
  const progress = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  const featured = lessons.find((lesson) => !completed.includes(lesson.id)) ?? lessons[0];
  const learningPaths = [
    { title: "Ventas y seguimiento", detail: "Respuesta, retoma, priorización y próxima acción.", icon: Target },
    { title: "Servicio y experiencia", detail: "Claridad, cortesía, consistencia y humanidad.", icon: Users },
    { title: "Operación e IA", detail: "Procesos, datos, automatización y revisión humana.", icon: Flame },
  ];

  function complete(courseId: string) {
    const next = Array.from(new Set([...completed, courseId]));
    setCompleted(next);
    localStorage.setItem("bridge-system.academy", JSON.stringify(next));
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-[#10100f] p-6 text-bone shadow-[0_24px_80px_rgba(10,10,10,0.16)] lg:p-8">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(184,117,71,0.24),transparent_34%,rgba(255,59,31,0.12)_72%,transparent)]" />
        <div aria-hidden className="absolute left-0 top-0 h-px w-full animate-bridge-scan bg-gradient-to-r from-transparent via-ember to-transparent" />
        <div className="relative grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-copper">Bridge Academy™ · Adoption Layer</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.96] lg:text-6xl">Entrena al equipo exactamente donde la operación se está fugando.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              No es una biblioteca de cursos. Es microentrenamiento conectado al diagnóstico: cada lección ayuda a cerrar una fuga real y a instalar hábitos visibles en el equipo.
            </p>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Siguiente microlección</p>
            <h2 className="mt-3 text-2xl font-semibold">{featured?.title}</h2>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full rounded-full bg-copper transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-[rgba(245,241,234,0.68)]">{progress}% de avance local en Academy.</p>
          </div>
        </div>
      </div>

      <SectionHeader eyebrow="Bridge Academy™" title="Microentrenamientos por fuga" description="Lecciones cortas para convertir recomendaciones en hábitos de equipo, con foco por industria y progreso local." />
      <Card className="bg-bone-2">
        <div className="grid gap-4 md:grid-cols-4">
          {["Nivel 1 · Claridad", "Nivel 2 · Seguimiento", "Nivel 3 · Estándar", "Nivel 4 · Automatización"].map((level, index) => (
            <div key={level} className={`rounded-lg border p-4 ${progress >= index * 25 ? "border-copper bg-bone" : "border-[color:var(--line)] bg-white/45"}`}>
              <GitBranch className="size-5 text-copper" />
              <p className="mt-3 font-semibold text-ink">{level}</p>
              <p className="mt-2 text-sm leading-6 text-fog">{progress >= index * 25 ? "Disponible" : "Pendiente"}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-mono text-xs text-copper">Lecciones</p><p className="mt-2 text-4xl font-semibold">{lessons.length}</p></div>
            <BookOpen className="size-5 text-copper" />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-mono text-xs text-copper">Completadas</p><p className="mt-2 text-4xl font-semibold">{completed.length}</p></div>
            <CheckCircle2 className="size-5 text-copper" />
          </div>
        </Card>
        <Card>
          <p className="font-mono text-xs text-copper">Foco</p>
          <p className="mt-2 text-lg font-semibold">{company?.industry ?? "Industria demo"}</p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <Card className="bg-bone-2">
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Rutas de aprendizaje</p>
            <div className="mt-4 space-y-3">
              {learningPaths.map((path) => {
                const Icon = path.icon;
                return (
                  <div key={path.title} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-ink text-copper"><Icon className="size-4" /></span>
                      <div>
                        <p className="font-semibold text-ink">{path.title}</p>
                        <p className="mt-1 text-sm leading-6 text-fog">{path.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card>
            <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Cómo usar Academy</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
              <p><strong className="text-ink">1.</strong> Elige una lección conectada con la fuga principal.</p>
              <p><strong className="text-ink">2.</strong> Haz el ejercicio con casos reales de la empresa.</p>
              <p><strong className="text-ink">3.</strong> Marca completada y convierte el aprendizaje en una tarea o estándar.</p>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
        {lessons.map((course, index) => (
          <Card key={course.id} className={`group transition hover:-translate-y-1 hover:border-copper ${completed.includes(course.id) ? "bg-bone-2" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{course.level} · Nivel {index + 1} · {course.duration} · {course.audience}</p>
              <span className="grid size-9 shrink-0 place-items-center rounded-md border border-[color:var(--line)] bg-bone text-copper">
                {completed.includes(course.id) ? <Award className="size-4" /> : <PlayCircle className="size-4" />}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 rounded-md bg-bone-2 px-3 py-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Fuga: {course.leakFocus}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-bone-2">
              <div className="h-full rounded-full bg-ember transition-all" style={{ width: completed.includes(course.id) ? "100%" : `${25 + (index % 4) * 12}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-fog"><strong className="text-ink">Objetivo:</strong> {course.objective}</p>
            <div className="mt-4 rounded-md border border-[color:var(--line)] bg-bone p-3">
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Contenido</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-fog">
                {course.content.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="mt-4 rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">
              <strong className="text-ink">Ejercicio práctico:</strong> {course.exercise}
            </div>
            <div className="mt-4 rounded-md border border-[color:var(--line)] bg-bone p-3">
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Checklist</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {course.checklist.map((item) => (
                  <span key={item} className="rounded-md bg-bone-2 px-2 py-1 text-xs text-fog">{item}</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-fog"><strong className="text-ink">Resultado esperado:</strong> {course.outcome}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-fog">{completed.includes(course.id) ? "Completada" : "Pendiente"}</span>
              <Button variant="secondary" onClick={() => complete(course.id)}>Completar</Button>
            </div>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}
