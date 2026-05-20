"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { getIndustryRules } from "@/lib/industry-rules";
import { getPaulaEngineDecisions } from "@/lib/paula-engine";
import { calculateAdvancedScores, getExecutiveDiagnosis } from "@/lib/scoring";
import { getCompanyProfile, getDataRoom, getScanResponses } from "@/lib/storage";
import type { CompanyProfile } from "@/lib/types";

export default function PaulaEnginePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const c = getCompanyProfile();
    setCompany(c);
    setInsight(getExecutiveDiagnosis(c, calculateAdvancedScores(getScanResponses()), getDataRoom()));
  }, []);

  if (!company) return null;
  const rules = getIndustryRules(company.industry);
  const decisions = getPaulaEngineDecisions(company);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Paula Engine™" title="Rules + Data + AI-ready" description="Motor estratégico demo que separa síntoma de causa y traduce diagnóstico en decisiones." />
      <Card><p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Insight estratégico</p><p className="mt-3 text-base leading-8 text-fog">{insight}</p></Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Cómo piensa el Paula Engine™</h2>
          <div className="mt-4 grid gap-2 text-sm text-fog">
            {["detecta patrones invisibles", "separa síntoma de causa", "prioriza por impacto", "traduce estrategia en acciones", "protege la humanidad del equipo", "convierte memoria en sistema"].map((item) => <p key={item}>· {item}</p>)}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Decisiones recomendadas esta semana</h2>
          <div className="mt-4 space-y-3 text-sm text-fog">{decisions.map((item) => <p key={item}>{item}</p>)}</div>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Entradas usadas</p>
          <div className="mt-4 space-y-2 text-sm text-fog">
            {["empresa", "industria", "Data Room", "Bridge Scan™", "team", "integraciones"].map((item) => <p key={item}>{item}</p>)}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Capas del motor</p>
          <div className="mt-4 space-y-2 text-sm text-fog">
            {["Rule-based layer", "Data layer", "Decision engine", "AI-ready layer", "Human validation layer"].map((item) => <p key={item}>{item}</p>)}
          </div>
        </Card>
        <Card>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Salidas</p>
          <div className="mt-4 space-y-2 text-sm text-fog">
            {["diagnóstico estratégico", "decisiones recomendadas", "scripts", "microlecciones", "riesgos", "plan 72h"].map((item) => <p key={item}>{item}</p>)}
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">Scripts sugeridos</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {rules.recommendedScripts.slice(0, 3).map((script) => <div key={script} className="rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">{script}</div>)}
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Preguntas que dirección debería responder</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "¿Qué oportunidad estamos perdiendo cada semana?",
            "¿Qué proceso depende demasiado de una persona?",
            "¿Qué indicador no estamos mirando?",
            "¿Qué acción debe tener dueño antes del viernes?",
            "¿Qué podemos automatizar solo después de ordenar?",
          ].map((question) => <div key={question} className="rounded-md bg-bone-2 p-4 text-sm leading-6 text-fog">{question}</div>)}
        </div>
      </Card>
      <Card><p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">OpenAI connection pending</p><p className="mt-2 text-sm text-fog">Este módulo está preparado para conectarse a una API server-side y generar insights personalizados.</p></Card>
    </div>
  );
}
