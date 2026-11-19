// Centro de mando de Max.
import { crearNucleo } from "./nucleo.js";

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

function saludoPorHora(hora) {
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 20) return "Buenas tardes";
  return "Buenas noches";
}

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

function pintarFecha() {
  const ahora = new Date();
  const dia = new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" }).format(ahora);
  const { hora, minuto } = partesChile(ahora);
  $("fecha").textContent = `${capitalizar(dia)} · ${String(hora).padStart(2, "0")}:${minuto}`;
  $("saludo").textContent = `${saludoPorHora(hora)}, Javier`;
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
  try {
    await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
  } finally {
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
cargarActividad();
nucleo.encender(0);
