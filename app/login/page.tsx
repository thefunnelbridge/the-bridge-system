"use client";

import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const configured = hasSupabaseBrowserConfig();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!configured) {
      setMessage("Supabase todavía no está configurado. Agrega las variables en Vercel para activar login real.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(mode === "signin" ? "Acceso validado. Entrando al sistema..." : "Cuenta creada. Revisa tu correo si Supabase pide confirmación.");
    if (mode === "signin") window.location.href = "/app";
  }

  return (
    <main className="min-h-screen bg-bone p-5 text-ink md:p-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1fr_460px] lg:items-center">
        <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-8 text-bone shadow-[0_30px_100px_rgba(10,10,10,0.24)]">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Enterprise Access</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.98] lg:text-7xl">The Bridge System™</h1>
          <p className="mt-4 font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-copper">Operational Intelligence Layer</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[rgba(245,241,234,0.78)]">
            Acceso seguro para empresas, líderes y equipos. Cada organización opera con sus propios usuarios, datos, tareas, conversaciones, metas y reportes.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <AccessPill icon={ShieldCheck} title="Multiempresa" text="Datos separados por organización." />
            <AccessPill icon={LockKeyhole} title="Roles" text="Owner, admin, manager y worker." />
            <AccessPill icon={Sparkles} title="AI-ready" text="Insights server-side preparados." />
          </div>
        </div>

        <Card className="bg-white/65">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">Acceso al sistema</p>
          <h2 className="mt-3 text-3xl font-semibold">{mode === "signin" ? "Entrar a tu empresa" : "Crear acceso enterprise"}</h2>
          <p className="mt-3 text-sm leading-6 text-fog">
            Para vender a clientes reales, este acceso se conecta a Supabase Auth. En modo sin configurar, la demo sigue disponible.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg border border-[color:var(--line)] bg-bone p-1">
            <button onClick={() => setMode("signin")} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-ink text-bone" : "text-fog"}`}>Entrar</button>
            <button onClick={() => setMode("signup")} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-ink text-bone" : "text-fog"}`}>Crear cuenta</button>
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Email corporativo</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Contraseña</span>
              <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
            </label>
            <Button type="submit" className="w-full justify-center">
              {mode === "signin" ? "Entrar" : "Crear acceso"} <ArrowRight className="size-4" />
            </Button>
          </form>

          {message ? <p className="mt-4 rounded-md bg-bone-2 p-3 text-sm leading-6 text-fog">{message}</p> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button href="/app" variant="secondary">Entrar a demo</Button>
            <Button href="/app/implementation" variant="secondary">Ver instalación</Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

function AccessPill({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="bridge-glass rounded-lg border p-4">
      <Icon className="size-5 text-ember" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[rgba(245,241,234,0.68)]">{text}</p>
    </div>
  );
}
