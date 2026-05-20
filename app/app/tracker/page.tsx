"use client";

import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { TrackerList } from "@/components/tracker-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoTrackerTasks } from "@/lib/demo-data";
import { getTrackerTasks, saveTrackerTasks } from "@/lib/storage";
import type { TrackerTask } from "@/lib/types";

const emptyTask = {
  title: "",
  area: "Ventas",
  priority: "Media",
  owner: "Responsable de área",
};

export default function TrackerPage() {
  const [tasks, setTasks] = useState<TrackerTask[]>([]);
  const [filters, setFilters] = useState({ area: "Todas", priority: "Todas", owner: "Todos", status: "Todos", origin: "Todos" });
  const [manual, setManual] = useState(emptyTask);

  useEffect(() => setTasks(getTrackerTasks()), []);

  const implemented = tasks.filter((task) => task.status === "Implementado").length;
  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      return (
        (filters.area === "Todas" || task.area === filters.area) &&
        (filters.priority === "Todas" || task.priority === filters.priority) &&
        (filters.owner === "Todos" || task.owner === filters.owner) &&
        (filters.status === "Todos" || task.status === filters.status) &&
        (filters.origin === "Todos" || task.origin === filters.origin)
      );
    });
  }, [tasks, filters]);

  const values = {
    area: ["Todas", ...Array.from(new Set(tasks.map((task) => task.area)))],
    priority: ["Todas", ...Array.from(new Set(tasks.map((task) => task.priority)))],
    owner: ["Todos", ...Array.from(new Set(tasks.map((task) => task.owner)))],
    status: ["Todos", ...Array.from(new Set(tasks.map((task) => task.status)))],
    origin: ["Todos", ...Array.from(new Set(tasks.map((task) => task.origin)))],
  };

  function sync(next: TrackerTask[]) {
    setTasks(next);
    saveTrackerTasks(next);
  }

  function addTask() {
    if (!manual.title.trim()) return;
    sync([
      ...tasks,
      {
        id: `manual-${Date.now()}`,
        title: manual.title,
        description: "Tarea agregada manualmente desde Tracker.",
        area: manual.area,
        origin: "Manual",
        priority: manual.priority,
        owner: manual.owner,
        status: "Pendiente",
        suggestedDate: "Esta semana",
        kpi: "avance de implementación",
        expectedImpact: "mejora operacional visible",
        difficulty: "Media",
        createdAt: new Date().toISOString(),
      },
    ]);
    setManual(emptyTask);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bridge-tracker-tasks.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Tracker" title="Implementación y mejora continua" description="Sistema de acciones con origen, prioridad, responsable, KPI, dificultad y estado." />
      <div className="grid gap-4 lg:grid-cols-4">
        <Card><p className="font-mono text-xs text-copper">Implementadas</p><p className="mt-2 text-3xl font-semibold">{implemented}/{tasks.length}</p></Card>
        <Card><p className="font-mono text-xs text-copper">Bloqueadas</p><p className="mt-2 text-3xl font-semibold">{tasks.filter((task) => task.status === "Bloqueado").length}</p></Card>
        <Card><p className="font-mono text-xs text-copper">Alta prioridad</p><p className="mt-2 text-3xl font-semibold">{tasks.filter((task) => task.priority.includes("Alta")).length}</p></Card>
        <Card><p className="font-mono text-xs text-copper">Origen Bridge Flow™</p><p className="mt-2 text-3xl font-semibold">{tasks.filter((task) => task.origin === "Bridge Flow™").length}</p></Card>
      </div>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Filtros</p>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {Object.entries(values).map(([key, options]) => (
            <select key={key} className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3 text-sm" value={filters[key as keyof typeof filters]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}>
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ))}
        </div>
      </Card>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Agregar tarea manual</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_180px_180px_220px_auto]">
          <input className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3" placeholder="Título de tarea" value={manual.title} onChange={(event) => setManual({ ...manual, title: event.target.value })} />
          <input className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3" value={manual.area} onChange={(event) => setManual({ ...manual, area: event.target.value })} />
          <input className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3" value={manual.priority} onChange={(event) => setManual({ ...manual, priority: event.target.value })} />
          <input className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3" value={manual.owner} onChange={(event) => setManual({ ...manual, owner: event.target.value })} />
          <Button onClick={addTask}><Plus className="size-4" /> Agregar</Button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={exportJson}><Download className="size-4" /> Exportar JSON</Button>
        <Button variant="secondary" onClick={() => sync(demoTrackerTasks)}><Trash2 className="size-4" /> Limpiar tareas demo</Button>
      </div>
      <TrackerList tasks={filtered} onChange={(nextFiltered) => {
        const map = new Map(nextFiltered.map((task) => [task.id, task]));
        sync(tasks.map((task) => map.get(task.id) ?? task));
      }} />
    </div>
  );
}
