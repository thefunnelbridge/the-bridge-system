import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cards = [
  ["Diagnostica", "Bridge Scan™ por áreas críticas del negocio."],
  ["Prioriza", "Detecta puntos de fuga y urgencias de implementación."],
  ["Visualiza", "Lee el Bridge Score™ y la madurez operativa."],
  ["Implementa", "Convierte hallazgos en tracker y mejora continua."],
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

        <div className="grid gap-10 py-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-copper">Bridge Scan™ + Bridge Flow™</p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.98] text-ink md:text-7xl">
              Inteligencia aplicada para detectar puntos de fuga y transformar procesos en decisiones.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fog">
              Completa un Bridge Scan™, recibe tu Bridge Score™ y visualiza qué debe corregir, automatizar y priorizar tu empresa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/app">Entrar a demo <ArrowRight className="size-4" /></Button>
              <Button href="/app/scan" variant="secondary">Iniciar Bridge Scan™</Button>
            </div>
          </div>

          <Card className="bg-[#10100f] p-6 text-bone">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#d6a27a]">Demo funcional</p>
            <div className="mt-8 grid gap-4">
              {["Score calculado", "Datos persistidos", "Recomendaciones generadas", "Tracker de implementación"].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <CheckCircle2 className="size-5 text-[#FF3B1F]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 pb-5 md:grid-cols-4">
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
