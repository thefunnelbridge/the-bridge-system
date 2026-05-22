import { academyLessons } from "@/lib/academy";
import { BridgeSignalSvg } from "./bridge-visuals";
import { generateActivityFeed, getRecentActivity } from "@/lib/activity-feed";
import { calculateBridgeExcellenceScore, getContinuousImprovementLoop, getServiceStandardScore, getStrategicScorecard } from "@/lib/excellence-library";
import { getDemoInboxConversations, getInboxFlowRecommendation, getInboxMetrics, type BridgeInboxConversation } from "@/lib/inbox";
import { integrationCatalog } from "@/lib/integrations";
import { generateInternalComms } from "@/lib/internal-comms";
import { getLiveGoals } from "@/lib/live-goals";
import { generateNotifications, getCriticalNotifications } from "@/lib/notification-engine";
import { getTrendsForCompany } from "@/lib/trends";
import type { AdvancedScores, CompanyProfile, DataRoom, Leak, MatrixItem, Recommendation, TrackerTask } from "@/lib/types";

export function ReportPreview({
  company,
  scores,
  leaks,
  matrix,
  recommendations,
  insight,
  tasks,
  dataRoom,
  inboxConversations,
}: {
  company: CompanyProfile;
  scores: AdvancedScores;
  leaks: Leak[];
  matrix: MatrixItem[];
  recommendations: Recommendation[];
  insight: string;
  tasks: TrackerTask[];
  dataRoom: DataRoom;
  inboxConversations?: BridgeInboxConversation[];
}) {
  const isBrokerage = company.industry === "Corredores de propiedades / Brokerage inmobiliario";
  const excellence = calculateBridgeExcellenceScore(scores);
  const service = getServiceStandardScore(scores);
  const scorecard = getStrategicScorecard(scores);
  const loop = getContinuousImprovementLoop(company, tasks);
  const goals = getLiveGoals(company, scores, tasks, dataRoom);
  const notifications = generateNotifications({
    company,
    scores,
    dataRoom,
    tasks,
    goals,
  });
  const activity = getRecentActivity(generateActivityFeed(company, company.industry, tasks, goals), 4);
  const criticalNotifications = getCriticalNotifications(notifications);
  const comms = generateInternalComms(company, scores, tasks);
  const trends = getTrendsForCompany(company);
  const inboxMetrics = getInboxMetrics(inboxConversations ?? getDemoInboxConversations(company));
  const inboxFlow = getInboxFlowRecommendation();

  return (
    <article className="rounded-lg border border-[color:var(--line)] bg-[#fbf8f2] p-6 shadow-[0_22px_70px_rgba(10,10,10,.06)] print:border-0 print:bg-white print:p-0 print:shadow-none">
      <section className="break-after-page border-b border-[color:var(--line)] pb-10">
        <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-copper">Executive Report</p>
        <h2 className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-none text-ink">The Bridge System™</h2>
        <p className="mt-4 text-lg text-fog">Bridge Insight™ para {company.name}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div><p className="font-mono text-xs text-fog">Empresa</p><p className="font-semibold">{company.name}</p></div>
          <div><p className="font-mono text-xs text-fog">Industria</p><p className="font-semibold">{company.industry}</p></div>
          <div><p className="font-mono text-xs text-fog">Fecha</p><p className="font-semibold">{new Date().toLocaleDateString("es-CL")}</p></div>
          <div><p className="font-mono text-xs text-fog">Versión</p><p className="font-semibold">0.3 Research-driven</p></div>
        </div>
        <div className="mt-12 max-w-3xl rounded-lg bg-bone-2 p-6">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Tesis operativa</p>
          <p className="mt-3 text-xl leading-8 text-ink">
            The Bridge System™ es una capa viva de inteligencia operativa: conecta datos internos, tendencias externas y ejecución diaria para que la empresa decida y actúe más rápido.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-lg border border-[color:var(--line)] bg-bone-2 p-4 text-copper">
          <BridgeSignalSvg className="h-24 w-full" />
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Lectura de madurez</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">Score</p><p className="mt-2 text-4xl font-semibold">{scores.overallScore}</p></div>
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">Madurez</p><p className="mt-2 text-xl font-semibold">{scores.maturityLevel}</p></div>
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">Excellence</p><p className="mt-2 text-4xl font-semibold">{excellence.overall}</p></div>
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">Service Standard</p><p className="mt-2 text-4xl font-semibold">{service.overall}</p></div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">AI Readiness</p><p className="mt-2 text-4xl font-semibold">{scores.aiReadinessIndex}%</p></div>
          <div className="rounded-lg bg-bone-2 p-5"><p className="font-mono text-xs text-copper">Dependencia humana</p><p className="mt-2 text-4xl font-semibold">{scores.humanDependencyIndex}%</p></div>
        </div>
        <h3 className="mt-8 text-2xl font-semibold">Resumen ejecutivo</h3>
        <p className="mt-3 leading-8 text-fog">{insight}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">Mayor riesgo</p>
            <p className="mt-2 text-sm leading-6 text-fog">{leaks[0]?.riskOfInaction}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">Oportunidad inmediata</p>
            <p className="mt-2 text-sm leading-6 text-fog">{recommendations[0]?.action72Hours}</p>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">Sistema a instalar</p>
            <p className="mt-2 text-sm leading-6 text-fog">Responsables, próxima acción, seguimiento visible y ritual semanal de mejora.</p>
          </div>
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Strategic Scorecard™</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">Inspirado en principios públicos de medición balanceada del desempeño: el sistema no mira solo ventas, sino clientes, procesos, aprendizaje, datos e IA.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {scorecard.map((item) => (
            <div key={item.name} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">{item.name}</p>
              <p className="mt-2 text-3xl font-semibold">{item.score}</p>
              <p className="mt-2 text-sm leading-6 text-fog">{item.priorityAction}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Bridge Trends™</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">Señales externas aplicadas a la operación: tendencias de industria, cambios de comportamiento, herramientas, benchmarks y prioridades que el equipo puede convertir en acción.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {trends.slice(0, 4).map((trend) => (
            <div key={trend.id} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">{trend.urgency} · impacto {trend.impact}</p>
              <h4 className="mt-2 text-xl font-semibold">{trend.title}</h4>
              <p className="mt-2 text-sm leading-6 text-fog">{trend.meaning}</p>
              <p className="mt-3 text-sm leading-6 text-fog"><strong className="text-ink">Acción:</strong> {trend.recommendedAction}</p>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">KPI:</strong> {trend.kpi}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Bridge Service Standard™</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {service.dimensions.map((item) => (
            <div key={item.name} className="rounded-lg bg-bone-2 p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold">{item.score}</p>
              <p className="mt-2 text-xs leading-5 text-fog">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Continuous Improvement Loop™</h3>
        <p className="mt-3 text-sm leading-7 text-fog">Detectar → Estandarizar → Implementar → Medir → Aprender → Mejorar.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-bone-2 p-4"><strong>Proceso a estandarizar</strong><p className="mt-2 text-sm text-fog">{loop.processToStandardize}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><strong>Bloqueo recurrente</strong><p className="mt-2 text-sm text-fog">{loop.recurringBlocker}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><strong>Microacción</strong><p className="mt-2 text-sm text-fog">{loop.suggestedMicroAction}</p></div>
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Bridge Pulse™ y uso diario</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">El sistema está diseñado para instalarse como capa diaria de operación: metas, alertas, tareas, feedback, aprendizaje y próxima mejor acción.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-bone-2 p-4"><strong>Metas vivas</strong><p className="mt-2 text-sm text-fog">{goals.length} metas activas entre día y semana.</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><strong>Notificaciones críticas</strong><p className="mt-2 text-sm text-fog">{criticalNotifications.length} alertas requieren decisión o seguimiento.</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><strong>Worker adoption</strong><p className="mt-2 text-sm text-fog">Vista móvil activa para revisar metas, tareas y microlecciones.</p></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <h4 className="text-xl font-semibold">Metas diarias y semanales</h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-fog">
              {goals.slice(0, 5).map((goal) => <li key={goal.id}>{goal.title} · {goal.progress}% · {goal.status}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
            <h4 className="text-xl font-semibold">Actividad reciente</h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-fog">
              {activity.map((item) => <li key={item.id}>{item.area}: {item.event}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-bone-2 p-5">
          <h4 className="text-xl font-semibold">Plan de uso diario</h4>
          <p className="mt-3 text-sm leading-7 text-fog">Instalar la vista móvil en equipos clave, revisar Bridge Pulse™ cada mañana, cerrar bloqueos antes de las 17:00 y usar Academy para entrenar la fuga prioritaria de la semana.</p>
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Orden de conversaciones y WhatsApp</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">
          Bridge Inbox™ convierte conversaciones comerciales en parte del sistema: cada intercambio debe tener responsable, estado, archivo asociado y próxima acción.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-bone-2 p-4"><p className="font-mono text-xs text-copper">Sin próxima acción</p><p className="mt-2 text-3xl font-semibold">{inboxMetrics.withoutNextAction}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><p className="font-mono text-xs text-copper">Sin responsable</p><p className="mt-2 text-3xl font-semibold">{inboxMetrics.unassigned}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><p className="font-mono text-xs text-copper">Archivos dispersos</p><p className="mt-2 text-3xl font-semibold">{inboxMetrics.scatteredFiles}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><p className="font-mono text-xs text-copper">Mensajes sin respuesta</p><p className="mt-2 text-3xl font-semibold">{inboxMetrics.unansweredMessages}</p></div>
          <div className="rounded-lg bg-bone-2 p-4"><p className="font-mono text-xs text-copper">Clientes dormidos</p><p className="mt-2 text-3xl font-semibold">{inboxMetrics.dormantOpportunities}</p></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-5">
            <h4 className="text-xl font-semibold">Riesgo ejecutivo</h4>
            <p className="mt-3 text-sm leading-7 text-fog">El cliente no debería perderse dentro de un chat. Los archivos no deberían vivir enterrados en conversaciones, y el seguimiento no debería depender de memoria personal.</p>
          </div>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-5">
            <h4 className="text-xl font-semibold">Plan de orden en 7 días</h4>
            <p className="mt-3 text-sm leading-7 text-fog">{inboxFlow.immediate} Luego: {inboxFlow.action72Hours} Finalmente: {inboxFlow.action7Days}</p>
          </div>
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Internal Comms™</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">Mensajes sugeridos para alinear dirección, líderes y equipo sin instalar una cultura de presión. La comunicación convierte el diagnóstico en acción diaria.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {comms.map((item) => (
            <div key={item.title} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">{item.audience} · {item.tone}</p>
              <h4 className="mt-2 text-xl font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-fog">{item.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Principales puntos de fuga</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {leaks.map((leak) => (
            <div key={leak.id} className="rounded-lg border border-[color:var(--line)] bg-bone p-5">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">{leak.areaName} · {leak.score}/100</p>
              <h4 className="mt-2 text-xl font-semibold">{leak.title}</h4>
              <p className="mt-2 text-sm leading-6 text-fog">{leak.description}</p>
              <p className="mt-3 text-sm leading-6 text-fog"><strong className="text-ink">Riesgo:</strong> {leak.riskOfInaction}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Matriz impacto / urgencia</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {matrix.map((item) => (
            <div key={item.id} className="rounded-lg bg-bone-2 p-4">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-copper">{item.quadrant}</p>
              <p className="mt-2 text-sm text-fog">Impacto {item.impact} · Urgencia {item.urgency}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Índices ejecutivos</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Fuga comercial", scores.commercialLeakIndex],
            ["Fuga operativa", scores.operationalLeakIndex],
            ["Data maturity", scores.dataMaturityIndex],
            ["Claridad estratégica", scores.strategicClarityIndex],
            ["Potencial automatización", scores.automationPotential],
            ["Necesidad entrenamiento", scores.teamTrainingNeed],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-copper">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="break-after-page py-8">
        <h3 className="font-display text-4xl font-semibold">Plan 72 horas / 7 días / 30 días</h3>
        <div className="mt-5 space-y-4">
          {recommendations.slice(0, 3).map((rec) => (
            <div key={rec.id} className="rounded-lg bg-bone-2 p-5">
              <h4 className="text-xl font-semibold">{rec.leakTitle}</h4>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">72 horas:</strong> {rec.action72Hours}</p>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">7 días:</strong> {rec.action7Days}</p>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">30 días:</strong> {rec.action30Days}</p>
              <p className="mt-2 text-sm leading-6 text-fog"><strong className="text-ink">Script:</strong> {rec.script}</p>
            </div>
          ))}
        </div>
      </section>

      {isBrokerage ? (
        <section className="break-after-page py-8">
          <h3 className="font-display text-4xl font-semibold">Diagnóstico para red de corredores</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["score por oficina", "score por hábitos comerciales", "fugas de captación", "fugas de seguimiento comprador", "fugas de seguimiento propietario", "oportunidades dormidas", "acciones para líderes de oficina", "plan 30 días para estandarizar desempeño"].map((item) => (
              <div key={item} className="rounded-lg bg-bone-2 p-4 text-sm font-semibold">{item}</div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="py-8">
        <h3 className="font-display text-4xl font-semibold">Capas de implementación</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <h4 className="text-xl font-semibold">Bridge Academy™</h4>
            <ul className="mt-3 space-y-2 text-sm text-fog">{academyLessons.slice(0, 5).map((lesson) => <li key={lesson}>{lesson}</li>)}</ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Bridge Integrations™</h4>
            <ul className="mt-3 space-y-2 text-sm text-fog">{integrationCatalog.slice(0, 5).map((integration) => <li key={integration.name}>{integration.name}: {integration.nextAction}</li>)}</ul>
          </div>
        </div>
        <div className="mt-8 rounded-lg border border-[color:var(--line)] bg-bone p-5">
          <h4 className="text-xl font-semibold">Próximo paso recomendado</h4>
          <p className="mt-3 text-sm leading-7 text-fog">
            Convertir este diagnóstico en una rutina semanal: revisar fugas, decidir responsables, medir próxima acción y entrenar al equipo con casos reales. The Bridge System™ no busca agregar complejidad; busca que la operación deje de depender de memoria humana.
          </p>
        </div>
      </section>
    </article>
  );
}
