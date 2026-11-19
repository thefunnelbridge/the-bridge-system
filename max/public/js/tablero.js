// Pinta el tablero principal con los datos guardados.
// Regla: si un dato falta, se muestra "Sin dato". Nunca se rellena con ejemplos.
import { clp, nombreMes, plural, fechaCorta } from "./formato.js";
import { pintarGrafico } from "./grafico.js";

const $ = (id) => document.getElementById(id);

function cifra(id, texto, { sinDato = false, clase = "" } = {}) {
  const el = $(id);
  el.textContent = texto;
  el.className = `cifra-valor ${sinDato ? "sin-dato" : ""} ${clase}`.trim();
}

function nota(id, texto, clase = "") {
  const el = $(id);
  el.textContent = texto;
  el.className = `cifra-nota ${clase}`.trim();
}

function pintarMeta(r, hoy, nucleo) {
  const mes = nombreMes(r.mes);
  $("e-facturado").textContent = `Facturado en ${mes}`;

  if (r.facturado === null) cifra("v-facturado", "Sin dato", { sinDato: true });
  else cifra("v-facturado", clp(r.facturado));

  if (r.meta === null) cifra("v-meta", "Sin dato", { sinDato: true });
  else cifra("v-meta", clp(r.meta));

  if (r.meta === null) cifra("v-falta", "Sin dato", { sinDato: true });
  else if (r.cumplida) cifra("v-falta", "Meta cumplida", { clase: "logro" });
  else cifra("v-falta", clp(r.falta));

  if (r.meta === null) cifra("v-por-dia", "Sin dato", { sinDato: true });
  else if (r.cumplida) cifra("v-por-dia", "Ya llegaste", { clase: "logro" });
  else if (r.sinDiasParaLlegar) cifra("v-por-dia", "No quedan días hábiles", { sinDato: true });
  else cifra("v-por-dia", clp(r.porDia));

  nota("n-dias", r.meta !== null && !r.cumplida && r.habilesRestantes > 0
    ? `Quedan ${plural(String(r.habilesRestantes).replace(".", ","), "día hábil", "días hábiles")}, contando ${r.serie.some((d) => d.fecha === hoy && d.monto !== null) ? "desde mañana" : "hoy"}.`
    : "");

  if (r.ritmo && !r.cumplida) {
    const d = r.ritmo.diferencia;
    if (d >= 0) nota("n-ritmo", `Vas ${clp(d)} sobre el ritmo para llegar.`, "bien");
    else nota("n-ritmo", `Vas ${clp(-d)} bajo el ritmo para llegar.`, "atento");
  } else nota("n-ritmo", "");

  // Avisos: qué falta cargar.
  const hoyHabil = r.serie.find((d) => d.fecha === hoy)?.peso > 0;
  const hoyCargado = r.serie.some((d) => d.fecha === hoy && d.monto !== null);
  let aviso = "";
  if (r.meta === null && r.facturado === null) aviso = `Todavía no me cargan la meta ni la facturación de ${mes}.`;
  else if (r.meta === null) aviso = `Falta la meta de ${mes}. Ponla en Ajustes.`;
  else if (r.facturado === null) aviso = `Todavía no me cargan la facturación de ${mes}.`;
  else if (hoyHabil && !hoyCargado) aviso = "Falta cargar la facturación de hoy.";
  $("aviso-meta").textContent = aviso;

  // El núcleo marca el avance contra la meta.
  if (r.pct === null) {
    nucleo.texto("MAX");
    nucleo.irA(0);
  } else {
    nucleo.texto(`${Math.round(r.pct)}%`, "DE LA META");
    nucleo.irA(Math.min(100, r.pct));
  }
}

function pintarTerminados(lista, alFacturar) {
  const ul = $("terminados");
  const contador = $("c-terminados");
  contador.hidden = lista.length === 0;
  contador.textContent = String(lista.length);

  if (!lista.length) {
    $("aviso-terminados").textContent = "";
    const vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "No hay trabajos terminados sin facturar anotados.";
    ul.replaceChildren(vacio);
    return;
  }

  const masAntiguo = Math.max(...lista.map((t) => t.diasEsperando ?? 0));
  $("aviso-terminados").textContent =
    `${plural(lista.length, "trabajo terminado", "trabajos terminados")} sin facturar.` +
    (masAntiguo > 0 ? ` El más antiguo lleva ${plural(masAntiguo, "día", "días")}.` : "");

  ul.replaceChildren(...lista.map((t) => {
    const li = document.createElement("li");
    if ((t.diasEsperando ?? 0) >= 3) li.className = "atrasado";

    const cuerpo = document.createElement("div");
    cuerpo.className = "te-cuerpo";
    const titulo = document.createElement("strong");
    titulo.textContent = `OT ${t.ot}`;
    const detalle = document.createElement("span");
    detalle.textContent = [t.modelo, t.patente, t.cliente].filter(Boolean).join(" · ") || "Sin más datos";
    cuerpo.append(titulo, detalle);

    const espera = document.createElement("span");
    espera.className = "te-espera";
    espera.textContent = t.diasEsperando === null ? "" : t.diasEsperando === 0 ? "Hoy" : `${plural(t.diasEsperando, "día", "días")}`;
    espera.title = t.fechaTermino ? `Terminado el ${fechaCorta(t.fechaTermino)}` : "";

    // Dos toques para evitar borrar por error.
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-chico";
    boton.textContent = "Facturado";
    let armado = 0;
    boton.addEventListener("click", () => {
      if (!armado) {
        boton.textContent = "¿Seguro?";
        boton.classList.add("confirmar");
        armado = setTimeout(() => { armado = 0; boton.textContent = "Facturado"; boton.classList.remove("confirmar"); }, 3500);
        return;
      }
      clearTimeout(armado);
      boton.disabled = true;
      alFacturar(t.id);
    });

    li.append(cuerpo, espera, boton);
    return li;
  }));
}

export function pintarTablero(datos, { nucleo, alFacturar }) {
  pintarMeta(datos.resumen, datos.hoy, nucleo);
  pintarGrafico($("grafico"), datos.resumen, datos.hoy);
  pintarTerminados(datos.terminados, alFacturar);
}
