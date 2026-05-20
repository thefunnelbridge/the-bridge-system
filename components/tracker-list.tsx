"use client";

import type { TrackerStatus, TrackerTask } from "@/lib/types";
import { saveTrackerTasks } from "@/lib/storage";
import { Card } from "./ui/card";

const statuses: TrackerStatus[] = ["Pendiente", "En progreso", "Implementado", "Bloqueado"];

export function TrackerList({ tasks, onChange }: { tasks: TrackerTask[]; onChange: (tasks: TrackerTask[]) => void }) {
  function updateTask(id: string, status: TrackerStatus) {
    const next = tasks.map((task) => (task.id === id ? { ...task, status } : task));
    saveTrackerTasks(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-ink">{task.title}</p>
              <p className="mt-1 text-sm text-fog">{task.area} · {task.owner} · KPI: {task.kpi}</p>
            </div>
            <select
              className="h-10 rounded-md border border-[color:var(--line)] bg-bone px-3 font-mono text-xs uppercase tracking-[0.1em] text-ink outline-none focus:border-copper"
              value={task.status}
              onChange={(event) => updateTask(task.id, event.target.value as TrackerStatus)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </Card>
      ))}
    </div>
  );
}
