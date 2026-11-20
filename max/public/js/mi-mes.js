// "Mi mes": la zona privada de Javier (su facturación, comisión y sueldo).
//
// Reglas de privacidad que este archivo cumple:
//  - Se abre solo con el PIN, que valida el servidor.
//  - Los montos viven en la memoria de esta ventana mientras está abierta: no se
//    guardan en el navegador y, al bloquear, se borran de la pantalla.
//  - Se bloquea sola a los 3 minutos sin uso, al cerrarla, al cambiar de
//    pestaña o al salir de la ventana.
//  - Este archivo no conoce la voz de Max: nada de aquí se puede decir en voz alta.
import { api } from "./api.js";
import { aMonto, conPuntos, clp, fechaCorta, nombreMes, plural } from "./formato.js";

const $ = (id) => document.getElementById(id);
const SEGUNDOS_SIN_USO = 180; // 3 minutos
const RENOVAR_CADA_MS = 30000;

function el(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

// "1,5" -> 1.5. Devuelve null si está vacío o no es un número.
function aPorcentaje(texto) {
  const limpio = String(texto ?? "").trim().replace("%", "").replace(",", ".");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : NaN;
}

const pct = (n) => `${String(n).replace(".", ",")}%`;

export function prepararMiMes({ alAbrir = () => {} } = {}) {
  const dialogo = $("dialogo-privado");
  const formPin = $("form-pin");
  const formReglas = $("form-reglas");
  const contenido = $("privado-contenido");
  const reloj = $("privado-reloj");
  const mPin = $("pin-mensaje");
  const mReglas = $("rg-mensaje");

  let pase = null;
  let datos = null;
  let restante = 0;
  let tic = 0;
  let renovacion = 0;

  ["rg-base", "rg-minimo", "rg-bono"].forEach((id) => conPuntos($(id)));
  $("pin").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/[^\d]/g, ""); });

  // ---------- Bloqueo ----------

  function bloquear() {
    pase = null;
    datos = null;
    clearInterval(tic);
    clearInterval(renovacion);
    contenido.replaceChildren();      // los montos salen de la pantalla, no solo se esconden
    contenido.hidden = true;
    formReglas.reset();
    formReglas.hidden = true;
    formPin.reset();
    formPin.hidden = false;
    reloj.hidden = true;
    mPin.textContent = "";
    mReglas.textContent = "";
    if (dialogo.open) dialogo.close();
  }

  function huboUso() {
    if (pase) restante = SEGUNDOS_SIN_USO;
  }

  function pintarReloj() {
    const minutos = Math.floor(restante / 60);
    const segundos = String(restante % 60).padStart(2, "0");
    reloj.textContent = `Se bloquea en ${minutos}:${segundos}`;
    reloj.classList.toggle("pronto", restante <= 15);
  }

  function vigilar() {
    restante = SEGUNDOS_SIN_USO;
    reloj.hidden = false;
    pintarReloj();
    clearInterval(tic);
    tic = setInterval(() => {
      restante -= 1;
      if (restante <= 0) bloquear();
      else pintarReloj();
    }, 1000);
    clearInterval(renovacion);
    renovacion = setInterval(async () => {
      if (!pase) return;
      try {
        recibir(await api("/api/mi-mes", { accion: "ver", pase }), { repintar: false });
      } catch {
        bloquear();
      }
    }, RENOVAR_CADA_MS);
  }

  for (const evento of ["pointermove", "pointerdown", "keydown", "input", "wheel"]) {
    dialogo.addEventListener(evento, huboUso, { passive: true });
  }
  dialogo.addEventListener("close", () => { if (pase || datos) bloquear(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) bloquear(); });
  window.addEventListener("blur", bloquear);
  window.addEventListener("pagehide", bloquear);

  // ---------- Pintar ----------

  function fila(etiqueta, valor, nota) {
    const caja = el("div", "privado-fila");
    caja.append(el("span", "privado-etiqueta", etiqueta), el("strong", "", valor));
    if (nota) caja.append(el("span", "privado-nota", nota));
    return caja;
  }

  function pintar() {
    const d = datos;
    const mes = nombreMes(d.mes);
    const partes = [];

    if (!d.reglas) {
      partes.push(el("p", "aviso", "Todavía no me dices cómo se calcula tu sueldo. Sin esas reglas no puedo mostrarlo, y no voy a inventarlo."));
    } else {
      const s = d.sueldo;
      const principal = el("div", "privado-principal");
      principal.append(
        el("span", "privado-etiqueta", "Hasta hoy tu sueldo va en"),
        el("strong", "privado-monto", clp(s.bruto)),
        el("span", "privado-nota", s.liquido !== null ? `Bruto. Líquido aproximado: ${clp(s.liquido)}.` : "Monto bruto."),
      );
      partes.push(principal);

      const desglose = el("div", "privado-grupo");
      desglose.append(fila("Sueldo base", clp(s.base)));
      desglose.append(fila(
        "Comisión",
        clp(s.comision),
        s.comisiona
          ? `${pct(d.reglas.comisionPct)} ${d.reglas.soloExcedente ? `sobre lo que pasa de ${clp(d.reglas.minimo)}` : "de tu facturación"}.`
          : `Te faltan ${clp(s.faltaParaComisionar)} de facturación para empezar a comisionar.`,
      ));
      if (d.reglas.bonoMeta > 0) {
        desglose.append(fila("Bono por meta del departamento", clp(s.bono), d.deptoCumplio ? "El departamento ya cumplió la meta." : `Suma ${clp(d.reglas.bonoMeta)} si el departamento llega a la meta.`));
      }
      partes.push(desglose);
    }

    const propia = el("div", "privado-grupo");
    propia.append(fila(
      `Tu facturación de ${mes}`,
      d.facturado === null ? "Sin dato" : clp(d.facturado),
      d.facturado === null
        ? "Se carga en \"Cargar datos\", en el campo privado."
        : `${plural(d.dias.length, "día cargado", "días cargados")}${d.participacion !== null ? `. Es el ${pct(d.participacion)} de lo facturado por el departamento` : ""}.`,
    ));
    partes.push(propia);

    if (d.reglas && d.sueldo.comisiona && d.reglas.comisionPct > 0) {
      const empuje = el("div", "privado-grupo privado-empuje");
      empuje.append(el("p", "", `Cada millón extra que factures suma ${clp(d.sueldo.porMillon)} a tu sueldo.`));
      if (d.proyeccion) {
        empuje.append(el("p", "", `Si sigues a este ritmo, cierras ${mes} facturando ${clp(d.proyeccion.facturadoCierre)} y tu sueldo llegaría a ${clp(d.proyeccion.sueldo.bruto)}.`));
        empuje.append(el("p", "privado-nota", "Es una proyección con el ritmo que llevas, no un dato."));
      }
      partes.push(empuje);
    }

    if (d.dias.length) {
      const lista = el("ul", "privado-dias");
      for (const dia of d.dias.slice(0, 8)) {
        const li = el("li");
        li.append(el("span", "", fechaCorta(dia.fecha)), el("strong", "", clp(dia.monto)));
        lista.append(li);
      }
      partes.push(el("h3", "privado-subtitulo", "Tus últimos días"), lista);
    }

    const botones = el("div", "dialogo-botones");
    const reglas = el("button", "boton-secundario", d.reglas ? "Cambiar reglas" : "Definir reglas de sueldo");
    reglas.type = "button";
    reglas.addEventListener("click", abrirReglas);
    const cerrar = el("button", "boton-primario", "Bloquear ahora");
    cerrar.type = "button";
    cerrar.addEventListener("click", bloquear);
    botones.append(reglas, cerrar);
    partes.push(botones);

    contenido.replaceChildren(...partes);
  }

  function recibir(respuesta, { repintar = true } = {}) {
    pase = respuesta.pase;
    datos = respuesta;
    if (repintar) pintar();
  }

  // ---------- Abrir con PIN ----------

  $("btn-mi-mes").addEventListener("click", () => {
    alAbrir();
    bloquear();
    dialogo.showModal();
    $("pin").focus();
  });
  $("pin-cerrar").addEventListener("click", bloquear);

  formPin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const pin = $("pin").value;
    if (!pin) { mPin.textContent = "Escribe tu PIN."; return; }
    $("pin-abrir").disabled = true;
    try {
      const respuesta = await api("/api/mi-mes", { accion: "abrir", pin });
      formPin.reset();
      formPin.hidden = true;
      contenido.hidden = false;
      recibir(respuesta);
      vigilar();
    } catch (e) {
      $("pin").value = "";
      mPin.textContent = e.message;
      $("pin").focus();
    } finally {
      $("pin-abrir").disabled = false;
    }
  });

  // ---------- Reglas de sueldo ----------

  function abrirReglas() {
    const r = datos?.reglas;
    const puntos = (n) => (n ? n.toLocaleString("es-CL") : "");
    const coma = (n) => (n || n === 0 ? String(n).replace(".", ",") : "");
    $("rg-base").value = r ? puntos(r.sueldoBase) : "";
    $("rg-pct").value = r ? coma(r.comisionPct) : "";
    $("rg-minimo").value = r ? puntos(r.minimo) : "";
    $("rg-excedente").checked = Boolean(r?.soloExcedente);
    $("rg-bono").value = r ? puntos(r.bonoMeta) : "";
    $("rg-desc").value = r && r.descuentosPct ? coma(r.descuentosPct) : "";
    mReglas.textContent = "";
    contenido.hidden = true;
    formReglas.hidden = false;
    $("rg-base").focus();
  }

  $("rg-volver").addEventListener("click", () => {
    formReglas.hidden = true;
    contenido.hidden = false;
  });

  formReglas.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const sueldoBase = aMonto($("rg-base").value);
    const comisionPct = aPorcentaje($("rg-pct").value);
    const descuentosPct = aPorcentaje($("rg-desc").value) ?? 0;
    if (sueldoBase === null) { mReglas.textContent = "Escribe tu sueldo base."; return; }
    if (comisionPct === null || Number.isNaN(comisionPct)) { mReglas.textContent = "Escribe el porcentaje de comisión (por ejemplo 1,5)."; return; }
    if (Number.isNaN(descuentosPct)) { mReglas.textContent = "Los descuentos tienen que ser un número (por ejemplo 20)."; return; }
    try {
      const respuesta = await api("/api/mi-mes", {
        accion: "reglas",
        pase,
        reglas: {
          sueldoBase,
          comisionPct,
          minimo: aMonto($("rg-minimo").value) ?? 0,
          soloExcedente: $("rg-excedente").checked,
          bonoMeta: aMonto($("rg-bono").value) ?? 0,
          descuentosPct,
        },
      });
      formReglas.hidden = true;
      contenido.hidden = false;
      recibir(respuesta);
    } catch (e) {
      if (e.cerrada) bloquear();
      else mReglas.textContent = e.message;
    }
  });

  return { bloquear };
}
