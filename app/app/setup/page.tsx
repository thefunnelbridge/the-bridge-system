"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Database,
  GitBranch,
  Inbox,
  KeyRound,
  Plug,
  Radio,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  clientAccessRequestList,
  crmConnectionChecklist,
  enterpriseImplementationTimeline,
  getDefaultLocations,
  getDefaultSetupUsers,
  roleBlueprints,
  whatsappConnectionChecklist,
} from "@/lib/enterprise-activation";
import type { SetupUser } from "@/lib/enterprise-activation";
import { getIndustryInduction } from "@/lib/industry-induction";
import { getCompanyProfile, getDataRoom, saveCompanyProfile, saveDataRoom, saveTrackerTasks } from "@/lib/storage";
import type { CompanyProfile, DataRoom, DemoIndustry, TrackerTask } from "@/lib/types";

const setupKey = "bridge-system.setup.activation";

const industryOptions: DemoIndustry[] = [
  "Construcción / Inmobiliaria",
  "Corredores de propiedades / Brokerage inmobiliario",
  "Clínica / salud / estética / dental",
  "Automotora",
  "Legal",
  "Pyme local",
  "Salón de belleza / estética grande",
  "Negocio unipersonal / solopreneur",
  "Educación",
  "Retail / e-commerce",
  "Gimnasio / wellness",
];

const channelOptions = ["WhatsApp", "Email", "Formulario web", "Instagram", "Meta Ads", "Google Ads", "Llamadas", "Referidos", "CRM", "Tienda física"];
const toolOptions = ["WhatsApp Business", "CRM", "Google Sheets", "Google Workspace", "Meta Ads", "Email", "Calendario", "ERP", "POS", "Drive"];
const integrationOptions = [
  { id: "whatsapp", label: "WhatsApp Business", status: "Preparado para Cloud API", icon: Inbox },
  { id: "crm", label: "CRM comercial", status: "Disponible por API o importación", icon: Database },
  { id: "email", label: "Email / Google Workspace", status: "Disponible", icon: Plug },
  { id: "sheets", label: "Google Sheets", status: "Puente inicial recomendado", icon: ClipboardList },
  { id: "stripe", label: "Stripe Billing", status: "Checkout preparado", icon: KeyRound },
];

type SetupState = {
  channels: string[];
  tools: string[];
  roles: string[];
  locations: string[];
  users: SetupUser[];
  integrations: string[];
  whatsappChecklist: string[];
  crmChecklist: string[];
  metrics: Record<string, string>;
  completedSteps: string[];
};

const stepIds = ["empresa", "industria", "equipo", "integraciones", "metricas", "lanzamiento"];

function defaultSetupState(profile: CompanyProfile): SetupState {
  return {
    channels: profile.channels,
    tools: profile.tools,
    roles: profile.team,
    locations: getDefaultLocations(profile),
    users: getDefaultSetupUsers(profile, profile.team),
    integrations: ["whatsapp", "sheets"],
    whatsappChecklist: [],
    crmChecklist: [],
    metrics: {
      responseTime: String(profile.metrics.responseTime ?? ""),
      openConversations: "24",
      unassignedConversations: "6",
      opportunitiesWithoutNextAction: "12",
      blockedTasks: "3",
    },
    completedSteps: [],
  };
}

function readSetupState(profile: CompanyProfile): SetupState {
  if (typeof window === "undefined") return defaultSetupState(profile);
  try {
    return { ...defaultSetupState(profile), ...JSON.parse(window.localStorage.getItem(setupKey) ?? "{}") };
  } catch {
    return defaultSetupState(profile);
  }
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function listToText(value: string[]) {
  return value.join(", ");
}

function textToList(value: string) {
  return value
    .split(/[,;\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SetupPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const currentProfile = getCompanyProfile();
    setProfile(currentProfile);
    setDataRoom(getDataRoom());
    setSetup(readSetupState(currentProfile));
  }, []);

  const induction = useMemo(() => (profile ? getIndustryInduction(profile) : null), [profile]);

  if (!profile || !setup || !dataRoom || !induction) return null;

  const progress = Math.round((setup.completedSteps.length / stepIds.length) * 100);
  const activeStepId = stepIds[activeStep];

  function persist(nextProfile: CompanyProfile, nextSetup: SetupState, nextDataRoom = dataRoom) {
    setProfile(nextProfile);
    setSetup(nextSetup);
    setDataRoom(nextDataRoom);
    window.localStorage.setItem(setupKey, JSON.stringify(nextSetup));
    saveCompanyProfile(nextProfile);
    saveDataRoom(nextDataRoom);
  }

  function updateProfile(field: keyof CompanyProfile, value: string) {
    const nextProfile = { ...profile, [field]: value } as CompanyProfile;
    persist(nextProfile, setup);
  }

  function updateSetup(patch: Partial<SetupState>) {
    persist(profile, { ...setup, ...patch });
  }

  function updateUser(userId: string, patch: Partial<SetupUser>) {
    updateSetup({ users: setup.users.map((user) => (user.id === userId ? { ...user, ...patch } : user)) });
  }

  function addUser() {
    const nextUser: SetupUser = {
      id: `setup-user-${Date.now()}`,
      name: "Nuevo usuario",
      email: "usuario@empresa.cl",
      role: setup.roles[0] ?? "Colaborador / Worker",
      location: setup.locations[0] ?? profile.city,
      status: "Por crear",
    };
    updateSetup({ users: [...setup.users, nextUser] });
  }

  function completeStep(stepId = activeStepId) {
    const completedSteps = Array.from(new Set([...setup.completedSteps, stepId]));
    updateSetup({ completedSteps });
    setNotice("Paso guardado. El sistema ya tiene más contexto para operar.");
    setActiveStep(Math.min(stepIds.length - 1, activeStep + 1));
  }

  function launchOperatingPlan() {
    const now = new Date().toISOString();
    const tasks: TrackerTask[] = induction.managerChecklist.map((item, index) => ({
      id: `setup-task-${Date.now()}-${index}`,
      title: item,
      description: `Acción inicial creada desde Activation Setup para ${profile.industry}.`,
      area: index % 2 === 0 ? "Operación" : "Equipo",
      origin: "Activation Setup",
      priority: index === 0 ? "Alta" : "Media",
      owner: setup.roles[index % Math.max(1, setup.roles.length)] ?? "Dirección",
      status: "Pendiente",
      suggestedDate: index < 2 ? "Hoy" : "Esta semana",
      kpi: induction.examples.metric,
      expectedImpact: "Instalar foco operativo y reducir fuga visible.",
      difficulty: index < 2 ? "Baja/Media" : "Media",
      createdAt: now,
    }));

    const nextDataRoom: DataRoom = {
      ...dataRoom,
      leads: {
        ...dataRoom.leads,
        tiempoPromedioRespuesta: setup.metrics.responseTime || dataRoom.leads.tiempoPromedioRespuesta,
        conversacionesAbiertas: setup.metrics.openConversations,
        oportunidadesSinProximaAccion: setup.metrics.opportunitiesWithoutNextAction,
      },
      operations: {
        ...dataRoom.operations,
        bloqueosDetectados: setup.metrics.blockedTasks,
        ritualInicial: induction.dailyRitual,
      },
      team: {
        ...dataRoom.team,
        roles: setup.roles,
        responsables: setup.roles,
        usuariosPiloto: setup.users.map((user) => `${user.name} · ${user.role} · ${user.location}`),
        ubicaciones: setup.locations,
        induccionActiva: induction.title,
      },
    };
    const nextProfile = { ...profile, channels: setup.channels, tools: setup.tools, team: setup.roles };
    const nextSetup = { ...setup, completedSteps: stepIds };
    saveTrackerTasks(tasks);
    persist(nextProfile, nextSetup, nextDataRoom);
    setNotice("Activation Setup completado. Se creó el primer plan operativo en Bridge Flow™ / Tracker.");
  }

  return (
    <div className="space-y-8">
      <div className="bridge-dark-wave rounded-xl border border-[rgba(245,241,234,0.12)] p-6 text-bone shadow-[0_28px_100px_rgba(10,10,10,0.24)] lg:p-8">
        <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-copper">Activation Setup</p>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-semibold leading-[0.96] lg:text-7xl">Instala The Bridge System™ dentro de una empresa real.</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[rgba(245,241,234,0.76)]">
              Esta ruta guía a dirección o implementación para configurar empresa, industria, equipo, canales, integraciones, datos mínimos y primer plan operativo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => setActiveStep(0)}><Rocket className="size-4" /> Comenzar setup</Button>
              <Button href="/app/workers/today" className="border-[rgba(245,241,234,0.22)] bg-transparent text-bone hover:border-ember hover:bg-ember hover:text-bone">
                <Users className="size-4" /> Ver trabajador
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(245,241,234,0.14)] bg-[rgba(245,241,234,0.08)] p-5">
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-copper">Progreso de instalación</p>
            <p className="mt-2 text-5xl font-semibold">{progress}%</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(245,241,234,0.12)]">
              <div className="h-full rounded-full bg-ember transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[rgba(245,241,234,0.72)]">{induction.firstDayGoal}</p>
          </div>
        </div>
      </div>

      <SectionHeader
        eyebrow="Setup guiado"
        title="De demo a operación instalada"
        description="Cada paso alimenta una capa: Empresa, Data Room, Inbox, Pulse, Flow, Workers y Report."
      />

      {notice ? <p className="rounded-lg border border-copper/30 bg-bone-2 p-4 text-sm leading-6 text-fog">{notice}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Ruta de activación</p>
          <div className="mt-4 space-y-2">
            {[
              ["empresa", "Empresa", Building2],
              ["industria", "Industria", Sparkles],
              ["equipo", "Equipo y roles", Users],
              ["integraciones", "Canales e integraciones", Plug],
              ["metricas", "Datos mínimos", Database],
              ["lanzamiento", "Primer plan", Rocket],
            ].map(([id, label, Icon], index) => {
              const done = setup.completedSteps.includes(String(id));
              const active = activeStep === index;
              const StepIcon = Icon as LucideIcon;
              return (
                <button
                  key={String(id)}
                  onClick={() => setActiveStep(index)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    active ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone hover:border-copper"
                  }`}
                >
                  <span className={`grid size-9 place-items-center rounded-md ${active ? "bg-[rgba(255,59,31,0.14)] text-ember" : "bg-bone-2 text-copper"}`}>
                    {done ? <CheckCircle2 className="size-4" /> : <StepIcon className="size-4" />}
                  </span>
                  <span className="font-semibold">{label as string}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-5">
          {activeStepId === "empresa" ? (
            <SetupPanel icon={Building2} title="1. Identidad de la empresa" text="Define quién usará el sistema y con qué contexto operativo parte.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nombre empresa" value={profile.name} onChange={(value) => updateProfile("name", value)} />
                <Input label="Ciudad / cobertura" value={profile.city} onChange={(value) => updateProfile("city", value)} />
                <Input label="Tamaño" value={profile.size} onChange={(value) => updateProfile("size", value)} />
                <Input label="Modelo operativo" value={profile.model ?? ""} onChange={(value) => updateProfile("model", value)} />
              </div>
              <label className="mt-4 grid gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Problema principal</span>
                <textarea className="min-h-28 rounded-md border border-[color:var(--line)] bg-bone p-4 outline-none focus:border-copper" value={profile.mainProblem} onChange={(event) => updateProfile("mainProblem", event.target.value)} />
              </label>
              <StepActions onNext={() => completeStep()} />
            </SetupPanel>
          ) : null}

          {activeStepId === "industria" ? (
            <SetupPanel icon={Sparkles} title="2. Industria y versión del sistema" text="El sistema cambia lenguaje, misiones, datos y entrenamientos según el tipo de negocio.">
              <div className="grid gap-3 md:grid-cols-2">
                {industryOptions.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => updateProfile("industry", industry)}
                    className={`rounded-lg border p-4 text-left transition ${profile.industry === industry ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone hover:border-copper"}`}
                  >
                    <p className="font-semibold">{industry}</p>
                    <p className={`mt-2 text-sm leading-6 ${profile.industry === industry ? "text-[rgba(245,241,234,0.7)]" : "text-fog"}`}>
                      {industry === "Negocio unipersonal / solopreneur" ? "Para una persona que quiere ordenar su negocio con IA." : "Activación con datos, roles y misiones propias."}
                    </p>
                  </button>
                ))}
              </div>
              <Card className="mt-5 bg-bone-2">
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Inducción que se activará</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{induction.title}</h3>
                <p className="mt-3 text-sm leading-7 text-fog">{induction.simpleExplanation}</p>
              </Card>
              <StepActions onNext={() => completeStep()} />
            </SetupPanel>
          ) : null}

          {activeStepId === "equipo" ? (
            <SetupPanel icon={Users} title="3. Equipo, roles y trabajadores" text="Define quién verá misiones, tareas, alertas y microlecciones.">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Roles sugeridos por industria</p>
                  <div className="mt-4 space-y-3">
                    {induction.workerPersonas.map((persona) => (
                      <ToggleCard
                        key={persona.role}
                        active={setup.roles.includes(persona.role)}
                        title={persona.role}
                        text={persona.mission}
                        onClick={() => updateSetup({ roles: toggleValue(setup.roles, persona.role) })}
                      />
                    ))}
                  </div>
                </div>
                <label className="grid gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Roles reales de tu empresa</span>
                  <textarea
                    className="min-h-64 rounded-md border border-[color:var(--line)] bg-bone p-4 outline-none focus:border-copper"
                    value={listToText(setup.roles)}
                    onChange={(event) => updateSetup({ roles: textToList(event.target.value) })}
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
                <Card className="bg-bone-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Usuarios piloto</p>
                      <h3 className="mt-2 text-2xl font-semibold text-ink">Invitaciones y permisos</h3>
                    </div>
                    <Button variant="secondary" onClick={addUser}>Agregar usuario</Button>
                  </div>
                  <div className="mt-5 space-y-4">
                    {setup.users.map((user) => (
                      <div key={user.id} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <Input label="Nombre" value={user.name} onChange={(value) => updateUser(user.id, { name: value })} />
                          <Input label="Email" value={user.email} onChange={(value) => updateUser(user.id, { email: value })} />
                          <label className="grid gap-2">
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Rol</span>
                            <select className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value })}>
                              {setup.roles.map((role) => <option key={role}>{role}</option>)}
                              {roleBlueprints.map((role) => <option key={role.role}>{role.role}</option>)}
                            </select>
                          </label>
                          <label className="grid gap-2">
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">Sucursal / área</span>
                            <select className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={user.location} onChange={(event) => updateUser(user.id, { location: event.target.value })}>
                              {setup.locations.map((location) => <option key={location}>{location}</option>)}
                            </select>
                          </label>
                        </div>
                        <p className="mt-3 rounded-md bg-bone-2 px-3 py-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{user.status}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-5">
                  <Card>
                    <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Sucursales / áreas</p>
                    <textarea
                      className="mt-4 min-h-32 w-full rounded-md border border-[color:var(--line)] bg-bone p-4 outline-none focus:border-copper"
                      value={listToText(setup.locations)}
                      onChange={(event) => updateSetup({ locations: textToList(event.target.value) })}
                    />
                    <p className="mt-3 text-sm leading-6 text-fog">Se usa para segmentar usuarios, Pulse, reportes y responsabilidades por oficina, sucursal, proyecto o área.</p>
                  </Card>
                  <Card className="bg-ink text-bone">
                    <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Matriz de permisos</p>
                    <div className="mt-4 space-y-3">
                      {roleBlueprints.slice(0, 4).map((role) => (
                        <div key={role.role} className="rounded-md border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-3">
                          <p className="font-semibold text-bone">{role.role}</p>
                          <p className="mt-1 text-sm leading-6 text-[rgba(245,241,234,0.68)]">{role.description}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
              <StepActions onNext={() => completeStep()} />
            </SetupPanel>
          ) : null}

          {activeStepId === "integraciones" ? (
            <SetupPanel icon={Plug} title="4. Canales, herramientas e integraciones" text="No tienes que conectarlo todo el primer día. Primero definimos por dónde entra la operación.">
              <div className="grid gap-5 xl:grid-cols-2">
                <OptionGroup title="Canales actuales" options={channelOptions} values={setup.channels} onToggle={(value) => updateSetup({ channels: toggleValue(setup.channels, value) })} />
                <OptionGroup title="Herramientas actuales" options={toolOptions} values={setup.tools} onToggle={(value) => updateSetup({ tools: toggleValue(setup.tools, value) })} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {integrationOptions.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <ToggleCard
                      key={integration.id}
                      active={setup.integrations.includes(integration.id)}
                      title={integration.label}
                      text={integration.status}
                      icon={Icon}
                      onClick={() => updateSetup({ integrations: toggleValue(setup.integrations, integration.id) })}
                    />
                  );
                })}
              </div>
              <Card className="mt-5 bg-ink text-bone">
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">WhatsApp enterprise</p>
                <p className="mt-3 text-sm leading-7 text-[rgba(245,241,234,0.76)]">
                  Para producción se conecta mediante WhatsApp Business Platform / Cloud API: número empresarial, webhook seguro, permisos y plantillas aprobadas. Bridge Inbox™ transforma eventos en responsables, estados y próximas acciones.
                </p>
              </Card>

              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <ChecklistPanel
                  title="Checklist WhatsApp Cloud API"
                  items={whatsappConnectionChecklist}
                  completed={setup.whatsappChecklist}
                  onToggle={(item) => updateSetup({ whatsappChecklist: toggleValue(setup.whatsappChecklist, item) })}
                />
                <ChecklistPanel
                  title="Checklist CRM / Sheets"
                  items={crmConnectionChecklist}
                  completed={setup.crmChecklist}
                  onToggle={(item) => updateSetup({ crmChecklist: toggleValue(setup.crmChecklist, item) })}
                />
              </div>
              <StepActions onNext={() => completeStep()} />
            </SetupPanel>
          ) : null}

          {activeStepId === "metricas" ? (
            <SetupPanel icon={Database} title="5. Datos mínimos para partir" text="Son pocos datos, pero suficientes para que Pulse y Flow empiecen a priorizar.">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Tiempo promedio de respuesta" value={setup.metrics.responseTime} onChange={(value) => updateSetup({ metrics: { ...setup.metrics, responseTime: value } })} />
                <Input label="Conversaciones abiertas" value={setup.metrics.openConversations} onChange={(value) => updateSetup({ metrics: { ...setup.metrics, openConversations: value } })} />
                <Input label="Conversaciones sin responsable" value={setup.metrics.unassignedConversations} onChange={(value) => updateSetup({ metrics: { ...setup.metrics, unassignedConversations: value } })} />
                <Input label="Oportunidades sin próxima acción" value={setup.metrics.opportunitiesWithoutNextAction} onChange={(value) => updateSetup({ metrics: { ...setup.metrics, opportunitiesWithoutNextAction: value } })} />
                <Input label="Tareas bloqueadas" value={setup.metrics.blockedTasks} onChange={(value) => updateSetup({ metrics: { ...setup.metrics, blockedTasks: value } })} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {induction.whatToEnter.slice(0, 6).map((item) => (
                  <div key={item} className="rounded-lg border border-[color:var(--line)] bg-bone-2 p-4">
                    <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Dato recomendado</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{item}</p>
                  </div>
                ))}
              </div>
              <StepActions onNext={() => completeStep()} />
            </SetupPanel>
          ) : null}

          {activeStepId === "lanzamiento" ? (
            <SetupPanel icon={Rocket} title="6. Lanzar primer plan operativo" text="Con esto The Bridge System™ deja preparado Pulse, Flow, Workers y Tracker para el primer ciclo.">
              <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_360px]">
                <Card className="bg-ink text-bone">
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Lista exacta para pedir al cliente</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {clientAccessRequestList.map((item) => (
                      <div key={item} className="rounded-md border border-[rgba(245,241,234,0.12)] bg-[rgba(245,241,234,0.06)] p-3">
                        <p className="text-sm leading-6 text-[rgba(245,241,234,0.76)]">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="bg-bone-2">
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Estado técnico</p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
                    <p><strong className="text-ink">WhatsApp:</strong> {setup.whatsappChecklist.length}/{whatsappConnectionChecklist.length} pasos listos.</p>
                    <p><strong className="text-ink">CRM/Sheets:</strong> {setup.crmChecklist.length}/{crmConnectionChecklist.length} pasos listos.</p>
                    <p><strong className="text-ink">Usuarios:</strong> {setup.users.length} usuarios piloto definidos.</p>
                    <p><strong className="text-ink">Áreas:</strong> {setup.locations.length} sucursales/áreas definidas.</p>
                  </div>
                </Card>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="space-y-3">
                  {induction.managerChecklist.map((item, index) => (
                    <div key={item} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">Misión {String(index + 1).padStart(2, "0")}</p>
                      <p className="mt-2 font-semibold text-ink">{item}</p>
                      <p className="mt-2 text-sm leading-6 text-fog">Responsable sugerido: {setup.roles[index % Math.max(1, setup.roles.length)] ?? "Dirección"}</p>
                    </div>
                  ))}
                </div>
                <Card className="bg-bone-2">
                  <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Qué quedará activo</p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-fog">
                    <p><strong className="text-ink">Pulse:</strong> metas y alertas del día.</p>
                    <p><strong className="text-ink">Flow:</strong> tareas iniciales con KPI.</p>
                    <p><strong className="text-ink">Workers:</strong> misiones por rol.</p>
                    <p><strong className="text-ink">Report:</strong> contexto listo para dirección.</p>
                  </div>
                  <Button onClick={launchOperatingPlan} className="mt-5 w-full justify-center">
                    <Rocket className="size-4" /> Activar operación
                  </Button>
                </Card>
              </div>
              <Card className="mt-5">
                <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">Roadmap de instalación enterprise</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {enterpriseImplementationTimeline.map((phase) => (
                    <div key={phase.day} className="rounded-lg border border-[color:var(--line)] bg-bone p-4">
                      <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-copper">{phase.day}</p>
                      <h3 className="mt-2 font-semibold text-ink">{phase.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-fog">{phase.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button href="/app/pulse" variant="secondary"><Radio className="size-4" /> Ver Pulse</Button>
                <Button href="/app/flow" variant="secondary"><GitBranch className="size-4" /> Ver Flow</Button>
                <Button href="/app/workers/today" variant="secondary"><Users className="size-4" /> Ver Workers</Button>
                <Button href="/app/report"><ArrowRight className="size-4" /> Ver Report</Button>
              </div>
            </SetupPanel>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SetupPanel({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-ink text-ember">
          <Icon className="size-6" />
        </span>
        <div>
          <h2 className="text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-fog">{text}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </Card>
  );
}

function StepActions({ onNext }: { onNext: () => void }) {
  return (
    <div className="mt-6 flex justify-end">
      <Button onClick={onNext}>Guardar y continuar <ArrowRight className="size-4" /></Button>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-copper">{label}</span>
      <input className="h-12 rounded-md border border-[color:var(--line)] bg-bone px-4 outline-none focus:border-copper" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function OptionGroup({ title, options, values, onToggle }: { title: string; options: string[]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <div>
      <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`rounded-md border px-3 py-2 text-sm transition ${values.includes(option) ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone text-ink hover:border-copper"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChecklistPanel({
  title,
  items,
  completed,
  onToggle,
}: {
  title: string;
  items: string[];
  completed: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <Card className="bg-bone-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.14em] text-copper">{title}</p>
          <p className="mt-2 text-sm leading-6 text-fog">{completed.length}/{items.length} pasos marcados.</p>
        </div>
        <span className="rounded-full bg-bone px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-copper">
          {Math.round((completed.length / items.length) * 100)}%
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => {
          const done = completed.includes(item);
          return (
            <button key={item} onClick={() => onToggle(item)} className="flex w-full items-start gap-3 rounded-md border border-[color:var(--line)] bg-bone p-3 text-left transition hover:border-copper">
              <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${done ? "text-ember" : "text-fog"}`} />
              <p className="text-sm leading-6 text-fog">{item}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ToggleCard({ active, title, text, icon: Icon = CheckCircle2, onClick }: { active: boolean; title: string; text: string; icon?: LucideIcon; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition ${active ? "border-ink bg-ink text-bone" : "border-[color:var(--line)] bg-bone hover:border-copper"}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-1 size-4 shrink-0 ${active ? "text-ember" : "text-copper"}`} />
        <div>
          <p className="font-semibold">{title}</p>
          <p className={`mt-1 text-sm leading-6 ${active ? "text-[rgba(245,241,234,0.72)]" : "text-fog"}`}>{text}</p>
        </div>
      </div>
    </button>
  );
}
