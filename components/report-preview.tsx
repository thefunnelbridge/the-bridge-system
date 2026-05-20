import type { AreaScore, CompanyProfile, Leak, Recommendation } from "@/lib/types";
import { getMaturityStatus } from "@/lib/scoring";

export function ReportPreview({
  company,
  score,
  areaScores,
  leaks,
  recommendations,
  insight,
}: {
  company: CompanyProfile;
  score: number;
  areaScores: AreaScore[];
  leaks: Leak[];
  recommendations: Recommendation[];
  insight: string;
}) {
  return (
    <article className="rounded-lg border border-[color:var(--line)] bg-[#fbf8f2] p-6 shadow-[0_22px_70px_rgba(10,10,10,.06)] print:border-0 print:shadow-none">
      <div className="border-b border-[color:var(--line)] pb-8">
        <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-copper">Informe ejecutivo</p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-none text-ink">The Bridge System™</h2>
        <p className="mt-3 text-fog">Bridge Insight™ para {company.name}</p>
      </div>
      <div className="grid gap-4 border-b border-[color:var(--line)] py-6 md:grid-cols-4">
        <div><p className="font-mono text-xs text-fog">Empresa</p><p className="font-semibold">{company.name}</p></div>
        <div><p className="font-mono text-xs text-fog">Fecha</p><p className="font-semibold">{new Date().toLocaleDateString("es-CL")}</p></div>
        <div><p className="font-mono text-xs text-fog">Bridge Score™</p><p className="font-semibold">{score}/100</p></div>
        <div><p className="font-mono text-xs text-fog">Estado</p><p className="font-semibold">{getMaturityStatus(score)}</p></div>
      </div>
      <section className="py-6">
        <h3 className="text-xl font-semibold">Resumen ejecutivo</h3>
        <p className="mt-3 leading-7 text-fog">{insight}</p>
      </section>
      <section className="grid gap-5 py-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">Áreas críticas</h3>
          <ul className="mt-3 space-y-2 text-sm text-fog">
            {areaScores.slice().sort((a, b) => a.score - b.score).slice(0, 3).map((area) => (
              <li key={area.id}>{area.name}: <strong className="text-ink">{area.score}/100</strong></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Top 3 fugas</h3>
          <ul className="mt-3 space-y-2 text-sm text-fog">
            {leaks.map((leak) => <li key={leak.areaId}>{leak.title}</li>)}
          </ul>
        </div>
      </section>
      <section className="py-6">
        <h3 className="text-xl font-semibold">Recomendaciones principales</h3>
        <div className="mt-3 space-y-3 text-sm leading-6 text-fog">
          {recommendations.map((rec) => <p key={rec.id}><strong className="text-ink">{rec.leakTitle}:</strong> {rec.firstStep}</p>)}
        </div>
      </section>
      <section className="border-t border-[color:var(--line)] pt-6">
        <h3 className="text-xl font-semibold">Próximos pasos</h3>
        <p className="mt-3 text-sm leading-6 text-fog">Priorizar correcciones visibles, convertirlas en sistema y preparar la capa Bridge Brain™ para inteligencia aplicada, automatización y mejora continua.</p>
      </section>
    </article>
  );
}
