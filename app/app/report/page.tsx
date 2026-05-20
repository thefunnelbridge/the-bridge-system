"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { ReportPreview } from "@/components/report-preview";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { generateRecommendations } from "@/lib/recommendations";
import { calculateAreaScores, calculateOverallScore, generateExecutiveInsight, getTopLeaks } from "@/lib/scoring";
import { getCompanyProfile, getScanResponses } from "@/lib/storage";
import type { AreaScore, CompanyProfile } from "@/lib/types";

export default function ReportPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [scores, setScores] = useState<AreaScore[]>([]);

  useEffect(() => {
    setCompany(getCompanyProfile());
    setScores(calculateAreaScores(getScanResponses()));
  }, []);

  const score = calculateOverallScore(scores);
  const leaks = getTopLeaks(scores);
  const recommendations = generateRecommendations(leaks);

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <SectionHeader eyebrow="Informe ejecutivo" title="Bridge Insight™ exportable" description="Vista lista para imprimir o exportar a PDF desde el navegador." />
        <div className="mt-5">
          <Button onClick={() => window.print()}><Printer className="size-4" /> Imprimir / Exportar PDF</Button>
        </div>
      </div>
      {company ? (
        <ReportPreview company={company} score={score} areaScores={scores} leaks={leaks} recommendations={recommendations} insight={generateExecutiveInsight()} />
      ) : null}
    </div>
  );
}
