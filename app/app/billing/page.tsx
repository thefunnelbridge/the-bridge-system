"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { stripeProductionChecklist } from "@/lib/enterprise-activation";
import { getCompanyProfile } from "@/lib/storage";

export default function BillingPage() {
  const company = getCompanyProfile();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        organizationName: company.name,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.url) {
      setMessage(data.error ?? "No se pudo iniciar Stripe Checkout.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="space-y-8">
      <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-7 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)]">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Billing · Stripe Ready</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.98] lg:text-7xl">Activación comercial enterprise.</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
          The Bridge System™ queda preparado para cobrar suscripciones con Stripe, asociar plan a organización y controlar acceso por estado de cuenta.
        </p>
      </div>

      <SectionHeader eyebrow="Billing" title="Plan enterprise instalable" description="Cobro real con Stripe Checkout cuando configures las variables de entorno en Vercel." />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Enterprise Operating Layer</p>
              <h2 className="mt-3 text-3xl font-semibold">The Bridge System™ para {company.name}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-fog">
                Incluye Command Center, Data Room, Bridge Inbox™, Trends, Pulse, Scan, Insight, Flow, Workers, Academy, Report y arquitectura lista para Supabase/OpenAI.
              </p>
            </div>
            <span className="grid size-12 place-items-center rounded-lg bg-ink text-ember">
              <CreditCard className="size-6" />
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <BillingFeature icon={ShieldCheck} title="Datos separados" text="Una organización, usuarios y permisos por empresa." />
            <BillingFeature icon={Zap} title="Uso diario" text="Metas, alertas, tareas, trabajadores y reportes." />
            <BillingFeature icon={Sparkles} title="AI-ready" text="Preparado para Bridge Brain™ server-side." />
          </div>
        </Card>

        <Card className="bg-bone-2">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Activar suscripción</p>
          <label className="mt-5 grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Email de facturación</span>
            <input
              className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper"
              type="email"
              placeholder="finanzas@empresa.cl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <Button onClick={startCheckout} className="mt-4 w-full justify-center" disabled={loading}>
            {loading ? "Conectando..." : "Ir a Stripe Checkout"}
          </Button>
          {message ? <p className="mt-4 rounded-md bg-bone p-3 text-sm leading-6 text-fog">{message}</p> : null}
          <p className="mt-4 text-xs leading-5 text-fog">
            Para producción debes crear un producto y precio en Stripe, luego configurar las variables de entorno de Stripe y la URL pública de la app en Vercel.
          </p>
        </Card>
      </div>

      <Card className="bg-ink text-bone">
        <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Stripe production checklist</p>
        <h2 className="mt-3 text-3xl font-semibold">Qué falta para cobrar con Stripe en producción</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stripeProductionChecklist.map((item) => (
            <div key={item} className="rounded-lg border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-4">
              <p className="text-sm leading-6 text-[rgba(245,241,234,0.76)]">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BillingFeature({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
      <Icon className="size-5 text-ember" />
      <p className="mt-3 font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-fog">{text}</p>
    </div>
  );
}
