"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { areaIds, areaLabels, areaMicrocopy, scaleLabels, scanQuestions } from "@/lib/scan-questions";
import { getScanResponses, saveScanResponses } from "@/lib/storage";
import type { AreaId, ScanResponses } from "@/lib/types";

export default function ScanPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<ScanResponses>(() => Object.fromEntries(areaIds.map((id) => [id, Array(scanQuestions[id].length).fill(3)])) as ScanResponses);
  const [currentArea, setCurrentArea] = useState<AreaId>("sales");

  useEffect(() => setResponses(getScanResponses()), []);

  const answered = useMemo(() => areaIds.reduce((sum, id) => sum + (responses[id] ?? []).filter(Boolean).length, 0), [responses]);
  const total = areaIds.reduce((sum, id) => sum + scanQuestions[id].length, 0);
  const progress = Math.round((answered / total) * 100);

  function setAnswer(area: AreaId, index: number, value: number) {
    setResponses((current) => ({
      ...current,
      [area]: current[area].map((answer, answerIndex) => (answerIndex === index ? value : answer)),
    }));
  }

  function finish() {
    saveScanResponses(responses);
    router.push("/app/insight");
  }

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Bridge Scan™" title="Diagnóstico por áreas" description="Evalúa ventas, operación, cultura, IA y Bridge Inbox™ con escala 1 a 5. El Bridge Score™ se recalcula desde las respuestas guardadas." />
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bone-2">
            <div className="h-full bg-copper transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-fog">{progress}% completo</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {areaIds.map((area) => (
            <button key={area} onClick={() => setCurrentArea(area)} className={`rounded-md border px-3 py-2 text-sm transition ${currentArea === area ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"}`}>
              {areaLabels[area]}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">{areaLabels[currentArea]}</p>
        <p className="mt-2 text-sm leading-6 text-fog">{areaMicrocopy[currentArea]}</p>
        <div className="mt-5 space-y-6">
          {scanQuestions[currentArea].map((question, index) => (
            <div key={question} className="border-b border-[color:var(--line)] pb-5 last:border-b-0">
              <p className="font-medium text-ink">{index + 1}. {question}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} onClick={() => setAnswer(currentArea, index, value)} className={`rounded-md border p-3 text-left transition ${responses[currentArea][index] === value ? "border-copper bg-copper text-white" : "border-[color:var(--line)] bg-bone hover:border-copper"}`}>
                    <span className="font-mono text-xs font-bold">{value}</span>
                    <span className="mt-1 block text-xs leading-5">{scaleLabels[value - 1]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={finish}>Finalizar y ver resultados</Button>
      </div>
    </div>
  );
}
