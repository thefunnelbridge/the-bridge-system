import Link from "next/link";
import { BridgeImage } from "./BridgeImage";
import { EditorialQuote, Kicker, PillNumber, SectionHeader } from "./SectionPrimitives";
import {
  audienceItems,
  benefits,
  comparisonRows,
  deliverables,
  industries,
  integrationGroups,
  modules,
  navLinks,
  problemCards,
  steps,
  visionCards,
  workModels,
} from "./bridgeSystemData";

function CTAButtons({
  secondary = "Detectar mis puntos de fuga",
}: {
  secondary?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="#demo" className="tfb-button">
        Solicitar una demo <span aria-hidden>◢</span>
      </Link>
      <Link href="#como-funciona" className="tfb-button tfb-button-secondary">
        {secondary}
      </Link>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[rgba(245,241,234,0.82)] backdrop-blur-xl">
      <nav className="tfb-container flex min-h-20 items-center justify-between gap-5">
        <Link href="/the-bridge-system" className="shrink-0 leading-none">
          <span className="block font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink">
            THE BRIDGE SYSTEM™
          </span>
          <span className="mt-1 block font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-fog">
            by THE FUNNEL BRIDGE™
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[rgba(10,10,10,0.65)] transition hover:text-ember"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="#demo" className="tfb-button hidden px-4 py-2.5 lg:inline-flex">
          Solicitar demo
        </Link>
      </nav>
    </header>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--line)] bg-bone pt-16 sm:pt-20 lg:pt-24">
      <div className="tfb-container grid items-center gap-12 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:pb-24">
        <div className="tfb-reveal space-y-8">
          <div className="space-y-3">
            <Kicker>
              ◢ THE BRIDGE SYSTEM™
              <br />
              INTELIGENCIA APLICADA · DECISIONES REALES
            </Kicker>
            <h1 className="max-w-5xl font-display text-[3.2rem] font-semibold leading-[0.88] text-ink sm:text-[5.2rem] lg:text-[6.1rem]">
              La plataforma de inteligencia aplicada que detecta dónde tu
              empresa pierde ventas, tiempo y claridad.
            </h1>
          </div>
          <div className="max-w-2xl space-y-5 text-lg leading-8 text-[rgba(10,10,10,0.75)] sm:text-xl">
            <p>Tu empresa no necesita otra herramienta desconectada.</p>
            <p>No necesita otro chatbot.</p>
            <p>No necesita más datos que nadie interpreta.</p>
            <p>
              Necesita un sistema que observe su operación completa, encuentre
              sus puntos de fuga y convierta la inteligencia artificial en
              decisiones concretas.
            </p>
            <p>
              The Bridge System™ diagnostica ventas, comunicación, atención,
              operación, tecnología y equipo para entregar un mapa claro de
              fugas, acciones priorizadas, flujos de mejora y seguimiento
              continuo.
            </p>
          </div>
          <CTAButtons />
          <p className="max-w-2xl border-t border-[color:var(--line)] pt-5 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.12em] text-fog">
            Una plataforma creada por The Funnel Bridge SpA para empresas que
            quieren operar con más inteligencia, menos improvisación y más
            libertad operativa.
          </p>
        </div>
        <BridgeImage
          src="/images/bridge-system/hero-devices-light.png"
          alt="Mockup de The Bridge System en múltiples dispositivos"
          label="Hero devices light"
          priority
          className="tfb-reveal tfb-reveal-delay-2 min-h-[420px] sm:min-h-[560px] lg:min-h-[680px]"
        />
      </div>
    </section>
  );
}

export function ThesisSection() {
  return (
    <section className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-10 lg:grid-cols-[0.78fr_1fr]">
        <SectionHeader
          kicker="◢ LA TESIS"
          title="La transformación digital no falló por falta de herramientas. Falló por falta de sistema."
        />
        <div className="space-y-6 text-lg leading-8 text-[rgba(10,10,10,0.75)] sm:text-xl">
          <p>
            Durante años, las empresas compraron plataformas, contrataron
            agencias, instalaron CRMs, abrieron canales digitales,
            automatizaron mensajes y acumularon datos.
          </p>
          <p>Pero algo siguió pasando.</p>
          <p>
            Los leads se seguían perdiendo. Los equipos seguían respondiendo
            distinto. Las campañas seguían sin conectarse con ventas. Los
            procesos seguían viviendo en WhatsApp, Excel o en la memoria de
            alguien. Y la dirección seguía tomando decisiones con información
            incompleta.
          </p>
          <p>El problema nunca fue solo la tecnología.</p>
          <p>
            El problema era que nadie estaba mirando la arquitectura completa.
          </p>
          <p>
            The Bridge System™ nace para detectar los puntos de fuga invisibles
            que frenan el crecimiento de una empresa y convertirlos en claridad,
            prioridad y acción.
          </p>
          <EditorialQuote>
            Una empresa puede estar llena de herramientas y seguir operando a
            ciegas.
          </EditorialQuote>
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="tfb-section bg-bone">
      <div className="tfb-container space-y-12">
        <SectionHeader
          kicker="◢ EL PROBLEMA INVISIBLE"
          title="Tu empresa no pierde oportunidades de un solo golpe. Las pierde por pequeñas fugas que nadie está midiendo."
        >
          <p>Una cotización que nadie retomó.</p>
          <p>Un mensaje que llegó tarde.</p>
          <p>Una respuesta que no siguió el tono correcto.</p>
          <p>Una campaña que atrajo leads, pero no generó seguimiento.</p>
          <p>Un vendedor que olvidó volver a escribir.</p>
          <p>Un cliente que quedó esperando.</p>
          <p>Un equipo que improvisó porque nadie le mostró qué hacer.</p>
          <p>A eso lo llamamos punto de fuga.</p>
          <p>
            Un punto de fuga es el lugar exacto donde una empresa pierde tiempo,
            dinero, energía, clientes o claridad sin notarlo a simple vista.
          </p>
          <p>The Bridge System™ fue creado para encontrarlos.</p>
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problemCards.map((card) => (
            <article key={card.title} className="tfb-card tfb-card-hover">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {card.title}
              </h3>
              <p className="mt-4 leading-7 text-[rgba(10,10,10,0.7)]">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSection() {
  return (
    <section id="sistema" className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-8">
          <SectionHeader
            kicker="◢ EL SISTEMA"
            title="Un puente inteligente entre diagnóstico, acción y mejora continua."
          >
            <p>
              The Bridge System™ es una plataforma de inteligencia aplicada que
              analiza el estado comercial, comunicacional y operativo de una
              empresa, identifica sus principales puntos de fuga y propone rutas
              de mejora priorizadas.
            </p>
            <p>No entrega solo reportes.</p>
            <p>No entrega solo respuestas.</p>
            <p>No entrega solo automatizaciones.</p>
            <p>Entrega una arquitectura de mejora.</p>
          </SectionHeader>
          <div className="rounded-lg border border-[color:var(--line)] bg-bone p-6">
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-copper">
              El sistema ayuda a responder preguntas críticas:
            </p>
            <div className="mt-5 grid gap-3 text-lg leading-7 text-[rgba(10,10,10,0.75)] sm:grid-cols-2">
              {[
                "¿Dónde estamos perdiendo oportunidades?",
                "¿Qué proceso está frenando la venta?",
                "¿Qué canal necesita atención inmediata?",
                "¿Qué mensaje está confundiendo al cliente?",
                "¿Qué tarea debería automatizarse primero?",
                "¿Qué necesita aprender el equipo para mejorar?",
              ].map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-3xl font-semibold italic text-copper">
              ¿Qué debemos hacer ahora?
            </p>
          </div>
        </div>
        <BridgeImage
          src="/images/bridge-system/bridge-insight-light.png"
          alt="Dashboard Bridge Insight"
          label="Bridge Insight light"
          className="min-h-[440px] lg:min-h-[620px]"
        />
      </div>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section className="tfb-section bg-bone">
      <div className="tfb-container space-y-12">
        <SectionHeader
          kicker="◢ UNA NUEVA CATEGORÍA"
          title="Esto no es una consultoría digital. Es una plataforma escalable de inteligencia aplicada."
        />
        <div className="overflow-hidden rounded-lg border border-[color:var(--line)] bg-bone-2">
          {comparisonRows.map(([left, right]) => (
            <div
              key={left}
              className="grid border-b border-[color:var(--line)] last:border-b-0 lg:grid-cols-2"
            >
              <p className="p-5 text-lg leading-7 text-[rgba(10,10,10,0.65)]">{left}</p>
              <p className="border-t border-[color:var(--line)] p-5 text-lg font-semibold leading-7 text-ink lg:border-l lg:border-t-0">
                {right}
              </p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl space-y-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          <p>La diferencia no está en usar IA.</p>
          <p>
            La diferencia está en construir un sistema que sepa dónde aplicarla.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <SectionHeader
            kicker="◢ CÓMO FUNCIONA"
            title="De la fuga invisible a la acción priorizada."
          >
            <p>
              The Bridge System™ trabaja en un ciclo simple, profundo y
              accionable.
            </p>
          </SectionHeader>
          <BridgeImage
            src="/images/bridge-system/bridge-flow-light.png"
            alt="Ruta de acciones Bridge Flow"
            label="Bridge Flow light"
            className="min-h-[360px] lg:min-h-[460px]"
          />
        </div>
        <div className="space-y-4">
          {steps.map((step) => (
            <article key={step.number} className="tfb-card tfb-card-hover">
              <div className="flex gap-4">
                <PillNumber>{step.number}</PillNumber>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[rgba(10,10,10,0.7)]">{step.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ModulesSection() {
  return (
    <section id="modulos" className="tfb-section bg-bone">
      <div className="tfb-container space-y-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            kicker="◢ TRES CAPAS · UNA INTELIGENCIA COMÚN"
            title="El sistema que diagnostica, recomienda y acompaña."
          />
          <BridgeImage
            src="/images/bridge-system/bridge-scan-light.png"
            alt="Bridge Scan en interfaz de diagnóstico inteligente"
            label="Bridge Scan light"
            className="min-h-[340px]"
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className="tfb-card tfb-card-hover">
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ember">
                ◢
              </p>
              <h3 className="mt-4 font-display text-3xl font-semibold text-ink">
                {module.title}
              </h3>
              <p className="mt-2 font-semibold text-copper">{module.subtitle}</p>
              <p className="mt-5 leading-7 text-[rgba(10,10,10,0.7)]">{module.text}</p>
              <p className="mt-6 border-t border-[color:var(--line)] pt-5 font-mono text-[0.72rem] font-bold uppercase leading-relaxed tracking-[0.1em] text-ink">
                Pregunta clave: {module.question}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliverablesSection() {
  return (
    <section className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="space-y-10">
          <SectionHeader
            kicker="◢ RESULTADOS CLAROS"
            title="Diagnóstico, recomendaciones, reportes y seguimiento en un solo lugar."
          >
            <p>
              The Bridge System™ no se queda en el análisis. Entrega información
              diseñada para mover decisiones.
            </p>
          </SectionHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {deliverables.map((item) => (
              <article key={item.title} className="tfb-card tfb-card-hover">
                <h3 className="font-display text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-[rgba(10,10,10,0.7)]">{item.text}</p>
              </article>
            ))}
          </div>
          <EditorialQuote>
            Lo que no se ve, no se mejora. Lo que no se ordena, se repite.
          </EditorialQuote>
        </div>
        <BridgeImage
          src="/images/bridge-system/executive-report-light.png"
          alt="Reporte ejecutivo de The Bridge System"
          label="Executive report light"
          className="min-h-[520px] lg:sticky lg:top-28"
        />
      </div>
    </section>
  );
}

export function StrategicEngineSection() {
  return (
    <section className="tfb-section bg-bone">
      <div className="tfb-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <BridgeImage
          src="/images/bridge-system/bridge-flow-light.png"
          alt="Bridge Flow y Paula Engine"
          label="Paula Engine"
          className="min-h-[520px]"
        />
        <div className="space-y-8">
          <SectionHeader
            kicker="◢ BRIDGE BRAIN™ · POWERED BY PAULA ENGINE™"
            title="Inteligencia artificial con criterio humano."
          >
            <p>
              En el centro de The Bridge System™ vive una capa propietaria de
              decisión estratégica: Bridge Brain™, impulsada por el Paula
              Engine™.
            </p>
            <p>
              Este motor combina reglas expertas, inteligencia artificial, datos
              de negocio y metodología estratégica para generar recomendaciones
              que no se sienten genéricas.
            </p>
            <p>Porque una clínica no comunica igual que una automotora.</p>
            <p>Una constructora no vende igual que un estudio legal.</p>
            <p>Un negocio de barrio no opera igual que una empresa B2B.</p>
            <p>
              Un equipo pequeño no necesita lo mismo que una organización con
              múltiples áreas.
            </p>
            <p>The Bridge System™ entiende contexto.</p>
            <p>Y eso cambia todo.</p>
          </SectionHeader>
          <EditorialQuote>
            El Paula Engine™ no entrega tips. Traduce criterio estratégico en
            acciones concretas.
          </EditorialQuote>
        </div>
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section id="integraciones" className="tfb-section bg-bone-2">
      <div className="tfb-container space-y-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeader
            kicker="◢ CONECTA TU ECOSISTEMA"
            title="Un puente entre tus herramientas, tus datos y tus decisiones."
          >
            <p>
              The Bridge System™ está diseñado para integrarse con el ecosistema
              real de una empresa.
            </p>
            <p>
              No importa si tu operación vive en un CRM, en WhatsApp, en
              formularios, en planillas, en un ERP, en campañas de Meta Ads o en
              herramientas internas.
            </p>
            <p>
              La plataforma conecta la información dispersa para transformarla
              en inteligencia accionable.
            </p>
          </SectionHeader>
          <BridgeImage
            src="/images/bridge-system/integrations-light.png"
            alt="Integraciones empresariales"
            label="Integrations light"
            className="min-h-[360px]"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrationGroups.map((group) => (
            <article key={group.title} className="tfb-card tfb-card-hover">
              <h3 className="font-display text-2xl font-semibold">
                {group.title}
              </h3>
              <p className="mt-3 leading-7 text-[rgba(10,10,10,0.7)]">{group.items}</p>
            </article>
          ))}
        </div>
        <EditorialQuote>
          The Bridge System™ no reemplaza todas tus herramientas. Las conecta
          con una capa de inteligencia que les da dirección.
        </EditorialQuote>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section id="industrias" className="tfb-section bg-bone">
      <div className="tfb-container space-y-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <SectionHeader
            kicker="◢ SOLUCIONES POR INDUSTRIA"
            title="Donde una empresa pierde claridad, The Bridge System™ encuentra el punto de fuga."
          >
            <p>
              Cada industria tiene su propio lenguaje, sus propios ritmos y sus
              propias urgencias.
            </p>
            <p>
              Pero casi todas comparten el mismo problema: clientes, procesos y
              equipos que no están conectados por un sistema inteligente.
            </p>
          </SectionHeader>
          <BridgeImage
            src="/images/bridge-system/industries-grid-light.png"
            alt="Ejemplos de industrias para The Bridge System"
            label="Industries grid light"
            className="min-h-[340px]"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry) => (
            <article key={industry.title} className="tfb-card tfb-card-hover">
              <h3 className="font-display text-2xl font-semibold">
                {industry.title}
              </h3>
              <p className="mt-4 leading-7 text-[rgba(10,10,10,0.7)]">{industry.problem}</p>
              <p className="mt-4 font-semibold leading-7 text-copper">
                {industry.result}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeader
          kicker="◢ EMPRESAS QUE QUIEREN OPERAR MEJOR"
          title="The Bridge System™ es para organizaciones que ya no quieren crecer desde la improvisación."
        >
          <p>Es para empresas que:</p>
        </SectionHeader>
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {audienceItems.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-[color:var(--line)] bg-bone px-5 py-4 font-mono text-[0.72rem] font-bold uppercase leading-relaxed tracking-[0.1em] text-ink"
              >
                ◢ {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-xl leading-8 text-[rgba(10,10,10,0.75)]">
            Es para pymes, empresas medianas, instituciones y equipos que saben
            que la inteligencia artificial no sirve de mucho si la operación
            sigue desordenada.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="tfb-section bg-bone">
      <div className="tfb-container space-y-12">
        <SectionHeader
          kicker="◢ LO QUE CAMBIA"
          title="Cuando una empresa ve sus puntos de fuga, empieza a recuperar control."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="tfb-card tfb-card-hover">
              <h3 className="font-display text-3xl font-semibold">
                {benefit.title}
              </h3>
              <p className="mt-4 leading-7 text-[rgba(10,10,10,0.7)]">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkModelSection() {
  return (
    <section className="tfb-section bg-bone-2">
      <div className="tfb-container grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="space-y-10">
          <SectionHeader
            kicker="◢ SOFTWARE + IMPLEMENTACIÓN ESTRATÉGICA"
            title="Una plataforma para diagnosticar, decidir e implementar."
          >
            <p>
              The Bridge System™ funciona como plataforma de diagnóstico,
              recomendación y mejora continua.
            </p>
            <p>
              Para empresas que necesitan mayor acompañamiento, The Funnel
              Bridge puede apoyar con servicios complementarios de implementación
              estratégica, automatización, capacitación y arquitectura digital.
            </p>
            <p>El centro es el software.</p>
            <p>
              La implementación es una capa adicional para empresas que quieren
              avanzar más rápido.
            </p>
          </SectionHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {workModels.map((model) => (
              <article key={model.title} className="tfb-card tfb-card-hover">
                <h3 className="font-display text-2xl font-semibold">
                  {model.title}
                </h3>
                <p className="mt-3 leading-7 text-[rgba(10,10,10,0.7)]">{model.text}</p>
              </article>
            ))}
          </div>
        </div>
        <BridgeImage
          src="/images/bridge-system/implementation-tracker-light.png"
          alt="Seguimiento de implementación"
          label="Implementation tracker light"
          className="min-h-[520px] lg:sticky lg:top-28"
        />
      </div>
    </section>
  );
}

export function FounderSection() {
  return (
    <section id="origen" className="tfb-section bg-bone">
      <div className="tfb-container grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-lg border border-[color:var(--line)] bg-bone-2 p-8 lg:sticky lg:top-28">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-copper">Origen estratégico</p>
          <h3 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink">Una plataforma nacida desde operación real, comunicación humana e inteligencia aplicada.</h3>
          <p className="mt-5 text-lg leading-8 text-[rgba(10,10,10,0.7)]">
            The Bridge System™ no gira alrededor de una persona. Gira alrededor de una pregunta: qué necesita una empresa para dejar de improvisar y empezar a operar con claridad.
          </p>
        </div>
        <div className="space-y-8">
          <SectionHeader
            kicker="◢ CREADO POR THE FUNNEL BRIDGE™"
            title="El criterio detrás del sistema."
          >
            <p>
              The Bridge System™ fue creado por The Funnel Bridge SpA desde la
              intersección entre comunicación, ventas, automatización,
              estrategia empresarial y comportamiento humano.
            </p>
            <p>
              Durante años apareció un patrón que se repetía una y otra vez:
              muchas empresas no fallan por falta de talento, tecnología o
              esfuerzo.
            </p>
            <p>
              Fallan porque no logran ver el sistema completo.
            </p>
            <p>No ven dónde se fuga la venta.</p>
            <p>No ven dónde se rompe el mensaje.</p>
            <p>No ven dónde el equipo improvisa.</p>
            <p>No ven dónde el cliente se enfría.</p>
            <p>
              No ven dónde la operación depende de una persona, un Excel, un
              WhatsApp o una memoria cansada.
            </p>
            <p>The Bridge System™ nace de esa lectura.</p>
            <p>
              Es una plataforma tecnológica capaz de diagnosticar, priorizar y
              acompañar procesos de mejora dentro de empresas reales.
            </p>
            <p>No es una herramienta creada desde la moda de la IA.</p>
            <p>
              Es una plataforma creada desde años de observar empresas, equipos,
              conversaciones, clientes, embudos, procesos, errores repetidos y
              oportunidades invisibles.
            </p>
          </SectionHeader>
          <EditorialQuote>
            The Bridge System™ no nace para reemplazar la inteligencia humana.
            Nace para que las empresas dejen de perderla en procesos
            desordenados.
          </EditorialQuote>
        </div>
      </div>
    </section>
  );
}

export function VisionSection() {
  return (
    <section id="vision" className="tfb-section bg-bone-2">
      <div className="tfb-container space-y-12">
        <SectionHeader
          kicker="◢ UNA PLATAFORMA VIVA"
          title="Diseñada para aprender con cada empresa."
        >
          <p>The Bridge System™ está construido como una plataforma modular.</p>
          <p>Primero diagnostica.</p>
          <p>Luego recomienda.</p>
          <p>Después mide.</p>
          <p>Más adelante aprende.</p>
          <p>
            Y con el tiempo, se integra al ecosistema real de cada empresa.
          </p>
          <p>La visión no es crear otro software más.</p>
          <p>
            La visión es construir la capa de inteligencia aplicada que ayude a
            las empresas a entenderse, ordenarse y mejorar antes de perder más
            ventas, más tiempo o más energía humana.
          </p>
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visionCards.map((card) => (
            <article key={card.title} className="tfb-card tfb-card-hover">
              <h3 className="font-display text-2xl font-semibold">
                {card.title}
              </h3>
              <p className="mt-3 leading-7 text-[rgba(10,10,10,0.7)]">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="demo" className="tfb-section bg-bone">
      <div className="tfb-container">
        <div className="rounded-lg border border-[color:var(--line)] bg-bone-2 p-6 shadow-soft sm:p-10 lg:p-14">
          <div className="max-w-4xl space-y-7">
            <SectionHeader
              kicker="◢ EL SIGUIENTE PASO"
              title="Tu empresa ya tiene datos. Ahora necesita inteligencia para saber qué hacer con ellos."
            >
              <p>
                Si tu equipo está vendiendo, atendiendo, respondiendo,
                publicando, cotizando, agendando o resolviendo clientes todos
                los días, entonces tu empresa ya tiene puntos de fuga.
              </p>
              <p>La pregunta es si puede verlos.</p>
              <p>
                The Bridge System™ fue creado para mostrarlos, priorizarlos y
                convertirlos en acción.
              </p>
            </SectionHeader>
            <CTAButtons secondary="Quiero detectar mis puntos de fuga" />
            <p className="font-mono text-[0.7rem] font-bold uppercase leading-relaxed tracking-[0.12em] text-fog">
              The Bridge System™ · Inteligencia aplicada para empresas que
              quieren operar con más claridad, más sistema y menos
              improvisación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BridgeFooter() {
  return (
    <footer className="bg-ink py-16 text-bone">
      <div className="tfb-container space-y-10">
        <SectionHeader
          kicker="◢ PROPIEDAD INTELECTUAL"
          title="Propiedad intelectual y uso autorizado"
          className="[&_.tfb-h2]:text-bone"
        >
          <p className="text-[rgba(245,241,234,0.72)]">
            The Bridge System™, Bridge Scan™, Bridge Flow™, Bridge Insight™,
            Bridge Brain™, Bridge Culture™, Bridge Academy™, Bridge
            Integrations™, The Bridge Framework™ y Paula Engine™ son conceptos,
            nombres, metodologías, estructuras, textos, flujos, criterios
            estratégicos, arquitectura de producto y activos intelectuales
            desarrollados por The Funnel Bridge SpA y Paula Roa.
          </p>
          <p className="text-[rgba(245,241,234,0.72)]">
            Todo el contenido presentado en esta página, incluyendo diseño
            conceptual, narrativa, estructura metodológica, diagramas, textos,
            módulos, nombres comerciales y lógica de producto, forma parte de
            los activos estratégicos de The Funnel Bridge SpA.
          </p>
          <p className="text-[rgba(245,241,234,0.72)]">
            Ninguna parte de este sitio puede ser copiada, reproducida,
            adaptada, entrenada, revendida, presentada como propia o utilizada
            para desarrollar productos derivados sin autorización previa y por
            escrito.
          </p>
        </SectionHeader>
        <div className="flex flex-col justify-between gap-4 border-t border-[color:var(--line-bone)] pt-8 font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.12em] text-[rgba(245,241,234,0.62)] sm:flex-row">
          <p>© 2026 The Funnel Bridge SpA. Todos los derechos reservados.</p>
          <p>Built in Temuco, Chile. Designed for the world.</p>
        </div>
      </div>
    </footer>
  );
}
