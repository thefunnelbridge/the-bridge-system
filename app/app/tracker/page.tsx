"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { TrackerList } from "@/components/tracker-list";
import { Card } from "@/components/ui/card";
import { getTrackerTasks } from "@/lib/storage";
import type { TrackerTask } from "@/lib/types";

export default function TrackerPage() {
  const [tasks, setTasks] = useState<TrackerTask[]>([]);

  useEffect(() => setTasks(getTrackerTasks()), []);

  const implemented = tasks.filter((task) => task.status === "Implementado").length;

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Tracker" title="Implementación y mejora continua" description="Checklist operativo para convertir recomendaciones en cambios visibles y medibles." />
      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold">{implemented} de {tasks.length} tareas implementadas</p>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-fog">Guardado en localStorage</p>
        </div>
      </Card>
      <TrackerList tasks={tasks} onChange={setTasks} />
    </div>
  );
}
