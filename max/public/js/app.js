// Centro de mando de Max.
import { crearNucleo } from "./nucleo.js";
import { crearVoz } from "./voz.js";
import { etiqueta } from "./voces.js";
import { saludoCorto, textoSaludo } from "./saludo.js";

const ZONA = "America/Santiago";
const $ = (id) => document.getElementById(id);

const nucleo = crearNucleo($("nucleo"));

// ---------- Hora de Chile ----------

function partesChile(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat("es-CL", {
    timeZone: ZONA, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit",
  }).formatToParts(fecha);
  const valor = (tipo) => partes.find((p) => p.type === tipo)?.value;
  return { anio: +valor("year"), mes: +valor("month"), dia: +valor("day"), hora: +valor("hour"), minuto: valor("minute") };
}

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

function pintarFecha() {
  const ahora = new Date();
  const dia = new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" }).format(ahora);
  const { hora, minuto } = partesChile(ahora);
  $("fecha").textContent = `${capitalizar(dia)} · ${String(hora).padStart(2, "0")}:${minuto}`;
  $("saludo").textContent = saludoCorto(hora);
}

function nombreMes() {
  return new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, month: "long" }).format(new Date());
}

// ---------- Conexión con el servidor ----------

async function api(ruta, opciones = {}) {
  const respuesta = await fetch(ruta, {
    credentials: "same-origin",
    ...opciones,
    headers: { "content-type": "application/json", ...(opciones.headers || {}) },
  });
  if (respuesta.status === 401) {
    location.replace("/login");
    throw new Error("sin sesión");
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || "Error del servidor");
  return datos;
}

// ---------- La voz y el resplandor ----------

const estadoMax = $("estado-max");
const dicho = $("dicho");
const avisoVoz = $("aviso-voz");
let borrarDicho = 0;

function ponerEstado(texto, modo = "espera") {
  estadoMax.textContent = texto;
  nucleo.estado(modo);
  document.body.dataset.max = modo;
}

const voz = crearVoz({
  alNivel: (n) => nucleo.nivel(n),
  alPulso: () => nucleo.pulso(),
  // modo: "voz" (se escucha), "silencio" o "sin-voz" (solo se lee).
  alFrase: (frase, modo) => {
    clearTimeout(borrarDicho);
    dicho.textContent = frase;
    dicho.classList.add("visible");
    const texto = { voz: "Hablando", silencio: "En silencio", "sin-voz": "Sin voz: Max te escribe" }[modo] || "Hablando";
    ponerEstado(texto, "hablando");
  },
  alTerminar: () => {
    ponerEstado("En espera");
    borrarDicho = setTimeout(() => dicho.classList.remove("visible"), 4000);
  },
});

const SALUDO_HECHO = "max-saludo-hecho";

function recordar(clave) {
  try { sessionStorage.setItem(clave, "1"); } catch {}
}

function recuerda(clave) {
  try { return sessionStorage.getItem(clave) === "1"; } catch { return false; }
}

async function saludar() {
  avisoVoz.textContent = "";
  const { hora } = partesChile();
  const resultado = await voz.decir(textoSaludo(hora, { hayDatos: false }));
  if (resultado === "bloqueado") {
    // El navegador solo deja hablar después de un toque en la página.
    ponerEstado("Toca el núcleo y Max te saluda", "toque");
    return;
  }
  if (resultado === "sin-voz") {
    avisoVoz.textContent = voz.disponible()
      ? "Este equipo no tiene una voz de hombre en español, así que Max te escribe. En Microsoft Edge habla con la voz Lorenzo."
      : "Este navegador no puede hablar, así que Max te escribe. En Microsoft Edge habla con la voz Lorenzo.";
  }
  if (resultado !== "cortado") recordar(SALUDO_HECHO);
}

$("nucleo").addEventListener("click", () => {
  if (voz.activa()) voz.callar();
  else saludar();
});

// ---------- Silencio ----------

const botonSilencio = $("btn-silencio");

function pintarSilencio() {
  const callado = voz.silencio();
  botonSilencio.setAttribute("aria-pressed", String(callado));
  const texto = callado ? "Max está en silencio. Toca para que vuelva a hablar." : "Silenciar a Max";
  botonSilencio.title = texto;
  botonSilencio.setAttribute("aria-label", texto);
}

botonSilencio.addEventListener("click", () => {
  voz.ponerSilencio(!voz.silencio());
  pintarSilencio();
});

// ---------- Elegir la voz ----------

const dialogoVoz = $("dialogo-voz");
const listaVoces = $("voz-lista");

async function abrirVoces() {
  const disponibles = await voz.voces();
  const actual = await voz.vozActual();
  const hay = disponibles.length > 0;
  $("voz-campo").hidden = !hay;
  $("voz-probar").hidden = !hay;
  $("voz-info").textContent = hay
    ? "Max usa la voz gratis de este navegador. Elige la que más te guste y pruébala. La elección queda guardada en este equipo."
    : "Este equipo no tiene una voz de hombre en español. Abre Max en Microsoft Edge: ahí habla con la voz Lorenzo, de Chile. Mientras tanto, Max te escribe lo que diría.";
  listaVoces.replaceChildren(...disponibles.map((v) => {
    const opcion = document.createElement("option");
    opcion.value = v.voiceURI;
    opcion.textContent = etiqueta(v);
    opcion.selected = actual?.voiceURI === v.voiceURI;
    return opcion;
  }));
  dialogoVoz.showModal();
}

$("btn-voz").addEventListener("click", abrirVoces);
listaVoces.addEventListener("change", () => voz.elegir(listaVoces.value));
$("voz-probar").addEventListener("click", () => {
  voz.elegir(listaVoces.value);
  voz.decir("Hola Javier, soy Max. Así sueno con esta voz.");
});
$("voz-cerrar").addEventListener("click", () => dialogoVoz.close());

// ---------- Actividad ----------

function cuandoFue(iso) {
  const fecha = new Date(iso);
  const hoy = partesChile();
  const ese = partesChile(fecha);
  const hora = `${String(ese.hora).padStart(2, "0")}:${ese.minuto}`;
  if (ese.anio === hoy.anio && ese.mes === hoy.mes && ese.dia === hoy.dia) return `Hoy ${hora}`;
  const ayer = partesChile(new Date(Date.now() - 86400000));
  if (ese.anio === ayer.anio && ese.mes === ayer.mes && ese.dia === ayer.dia) return `Ayer ${hora}`;
  return new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, day: "numeric", month: "short" }).format(fecha);
}

async function cargarActividad() {
  const lista = $("actividad");
  try {
    const { eventos } = await api("/api/actividad");
    if (!eventos.length) {
      const vacio = document.createElement("li");
      vacio.className = "vacio";
      vacio.textContent = "Todavía no hay movimientos.";
      lista.replaceChildren(vacio);
      return;
    }
    lista.replaceChildren(...eventos.map((evento) => {
      const item = document.createElement("li");
      item.className = evento.tipo || "";
      const t = document.createElement("span");
      t.className = "t";
      t.textContent = cuandoFue(evento.t);
      const x = document.createElement("span");
      x.className = "x";
      x.textContent = evento.texto;
      item.append(t, x);
      return item;
    }));
  } catch (e) {
    if (e.message === "sin sesión") return;
    const item = document.createElement("li");
    item.className = "alerta";
    item.textContent = "No pude cargar la actividad.";
    lista.replaceChildren(item);
  }
}

// ---------- Meta del departamento (se completa en la parte 2) ----------

function pintarMetaSinDatos() {
  $("e-facturado").textContent = `Facturado en ${nombreMes()}`;
  $("aviso-meta").textContent = `Todavía no me cargan la meta ni la facturación de ${nombreMes()}.`;
}

// ---------- Salir ----------

$("btn-salir").addEventListener("click", async () => {
  voz.callar();
  try {
    await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
  } finally {
    try { sessionStorage.removeItem(SALUDO_HECHO); } catch {}
    location.replace("/login");
  }
});

// ---------- App instalable ----------

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// ---------- Arranque ----------

pintarFecha();
setInterval(pintarFecha, 30000);
pintarMetaSinDatos();
pintarSilencio();
cargarActividad();

// Encendido: barrido de la aguja y, la primera vez de cada sesión, el saludo.
nucleo.encender(0).then(() => {
  if (!recuerda(SALUDO_HECHO)) saludar();
});
