import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cards = [
  ["Se alimenta de la empresa", "Datos, ventas, procesos, canales, comunicación, equipo, tareas, cultura y fricciones internas."],
  ["Se alimenta del mundo", "Tendencias de industria, cambios de comportamiento, nuevas herramientas, benchmarks y señales de mercado."],
  ["Interpreta lo que pasa", "Detecta puntos de fuga, oportunidades dormidas, procesos débiles, riesgos y prioridades."],
  ["Traduce en acción", "No solo muestra dashboards. Dice qué hacer hoy, esta semana y en los próximos 30 días."],
  ["Activa al equipo", "Envía metas, alertas, notificaciones, microentrenamientos y mensajes internos."],
  ["Mejora con cada uso", "Mientras más datos, tareas y feedback recibe, más preciso se vuelve el sistema."],
];

const liveSystemItems = [
  "Se alimenta de la empresa",
  "Se alimenta del mundo",
  "Detecta fugas activas",
  "Interpreta señales",
  "Recomienda acciones diarias",
  "Notifica al equipo",
  "Entrena colaboradores",
  "Mejora con cada uso",
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-bone text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-5 py-8 md:px-10">
        <header className="flex items-center justify-between border-b border-[color:var(--line)] pb-5">
          <div>
            <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-copper">THE BRIDGE SYSTEM™</p>
            <p className="mt-1 text-sm text-fog">by THE FUNNEL BRIDGE™</p>
          </div>
          <Button href="/app" variant="secondary">Entrar</Button>
        </header>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-copper">OPERATIONAL INTELLIGENCE LAYER</p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.98] text-ink md:text-7xl">
              Convierte datos, tendencias y fricción interna en acciones diarias para tu equipo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fog">
              The Bridge System™ es una capa viva de inteligencia operativa para empresas que necesitan ver qué está pasando, entender qué significa y saber qué hacer hoy.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-fog">
              No reemplaza tus herramientas. Las conecta, las interpreta y las traduce en decisiones, alertas, metas, microentrenamientos y acciones concretas para líderes y trabajadores.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/app">Entrar a demo <ArrowRight className="size-4" /></Button>
              <Button href="/the-bridge-system#como-funciona" variant="secondary">Ver cómo funciona</Button>
            </div>
            <p className="mt-8 max-w-2xl border-l-2 border-copper pl-4 font-mono text-[0.78rem] uppercase leading-6 tracking-[0.12em] text-ink">
              The Bridge System™ no responde preguntas. Observa la operación, interpreta señales y activa decisiones.
            </p>
          </div>

          <Card className="bg-[#10100f] p-6 text-bone lg:-translate-y-8">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#d6a27a]">Sistema vivo en funcionamiento</p>
            <div className="mt-8 grid gap-4">
              {liveSystemItems.map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <CheckCircle2 className="size-5 text-[#FF3B1F]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 pb-5 md:grid-cols-3 xl:grid-cols-6">
          {cards.map(([title, text]) => (
            <Card key={title}>
              <h2 className="text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-fog">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
