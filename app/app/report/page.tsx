"use client";

import { Clipboard, Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { ReportPreview } from "@/components/report-preview";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { generateRecommendations } from "@/lib/recommendations";
import { calculateAdvancedScores, createImpactUrgencyMatrix, getExecutiveDiagnosis, getTopLeaks } from "@/lib/scoring";
import { exportDemoData, getCompanyProfile, getDataRoom, getInboxConversations, getScanResponses, getTrackerTasks } from "@/lib/storage";
import type { AdvancedScores, CompanyProfile } from "@/lib/types";

export default function ReportPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AdvancedScores | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setScores(calculateAdvancedScores(getScanResponses()));
  }, []);

  if (!company || !scores) return null;

  const dataRoom = getDataRoom();
  const leaks = getTopLeaks(scores.areaScores, 5);
  const matrix = createImpactUrgencyMatrix(leaks);
  const recommendations = generateRecommendations(leaks, company);
  const insight = getExecutiveDiagnosis(company, scores, dataRoom);
  const tasks = getTrackerTasks();
  const inboxConversations = getInboxConversations();

  function copySummary() {
    navigator.clipboard.writeText(insight);
    setCopied(true);
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(exportDemoData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bridge-system-executive-report-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <SectionHeader eyebrow="Executive Report" title="Informe ejecutivo exportable" description="Reporte listo para dirección, equipos comerciales, comités operativos y clientes enterprise." />
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => window.print()}><Printer className="size-4" /> Imprimir / Exportar PDF</Button>
          <Button variant="secondary" onClick={copySummary}><Clipboard className="size-4" /> Copiar resumen ejecutivo</Button>
          <Button variant="secondary" onClick={downloadJson}><Download className="size-4" /> Descargar JSON demo</Button>
          {copied ? <span className="self-center text-sm text-fog">Resumen copiado.</span> : null}
        </div>
      </div>
      <ReportPreview company={company} scores={scores} leaks={leaks} matrix={matrix} recommendations={recommendations} insight={insight} tasks={tasks} dataRoom={dataRoom} inboxConversations={inboxConversations} />
    </div>
  );
}
