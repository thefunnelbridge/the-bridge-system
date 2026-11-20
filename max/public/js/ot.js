// Panel de OT abiertas: separa lo que de verdad está en el taller de lo que
// está terminado y sin cerrar. Muestra primero las garantías por enviar.
// En la lista no van montos; el costo de una OT se ve solo en su detalle.
import { api } from "./api.js";
import { clp, fechaCorta, fechaLarga, plural } from "./formato.js";

const $ = (id) => document.getElementById(id);
const PRIMERAS = 8;

const ETAPAS = [
  { clave: "garantia_por_enviar", titulo: "Garantías por enviar", falta: "Falta enviar el reclamo de garantía" },
  { clave: "terminada_por_facturar", titulo: "Terminadas por facturar", falta: "Falta aprobar y facturar" },
  { clave: "no_liberada", titulo: "No liberadas", falta: "Falta liberar la OT" },
  { clave: "en_taller", titulo: "En el taller", falta: "Trabajo en curso" },
  { clave: "otra", titulo: "Otras", falta: "Estado que no reconozco" },
];

function el(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

export function prepararOT() {
  let datos = null;
  let etapa = "garantia_por_enviar";
  let verTodas = false;

  function pintar() {
    const seccion = $("seccion-ot");
    if (!datos?.hayOT) { seccion.hidden = true; return; }
    seccion.hidden = false;
    $("c-ot").textContent = String(datos.total);
    $("ot-nota").textContent = `Excel cargado el ${fechaCorta(datos.cargado)}.` +
      (datos.cambios ? ` Desde el ${fechaCorta(datos.cambios.desde)}: ${plural(datos.cambios.nuevas.length, "nueva", "nuevas")} y ${plural(datos.cambios.salieron.length, "salió", "salieron")} de la lista.` : "");

    // Si la etapa elegida quedó vacía, se pasa a la primera que tenga OT.
    const visibles = ETAPAS.filter((e) => datos.porEtapa[e.clave]?.cantidad > 0);
    if (!visibles.some((e) => e.clave === etapa)) etapa = visibles[0]?.clave || etapa;

    $("ot-etapas").replaceChildren(...visibles.map((e) => {
      const info = datos.porEtapa[e.clave];
      const boton = el("button", `etapa ${e.clave === etapa ? "activa" : ""} etapa-${e.clave}`);
      boton.type = "button";
      boton.setAttribute("role", "tab");
      boton.setAttribute("aria-selected", String(e.clave === etapa));
      boton.append(
        el("strong", "", String(info.cantidad)),
        el("span", "etapa-titulo", e.titulo),
        el("span", "etapa-nota", info.cantidad < 3 || info.mediana === null ? "" : `La mitad lleva más de ${plural(info.mediana, "día", "días")}`),
      );
      boton.addEventListener("click", () => { etapa = e.clave; verTodas = false; pintar(); });
      return boton;
    }));

    const definicion = ETAPAS.find((e) => e.clave === etapa);
    const lista = datos.lista.filter((ot) => ot.etapa === etapa);
    const sinHoras = lista.filter((ot) => !ot.notificada).length;
    $("ot-resumen").textContent = `${definicion.falta}.` +
      (sinHoras ? ` ${plural(sinHoras, "tiene", "tienen")} las horas del técnico sin notificar.` : "") +
      (etapa !== "en_taller" && datos.masDe60 ? ` En total, ${plural(datos.masDe60, "OT pasa", "OT pasan")} los 60 días.` : "");

    const mostradas = verTodas ? lista : lista.slice(0, PRIMERAS);
    $("ot-lista").replaceChildren(...mostradas.map((ot) => {
      const li = el("li", ot.dias > 60 ? "atrasada" : "");
      const dias = el("div", "ot-dias");
      dias.append(el("strong", "", String(ot.dias)), el("span", "", ot.dias === 1 ? "día" : "días"));
      const cuerpo = el("div", "op-cuerpo");
      const titulo = el("button", "op-nombre", `OT ${ot.ot} · ${ot.trabajo || "Sin descripción"}`);
      titulo.type = "button";
      titulo.addEventListener("click", () => abrir(ot));
      cuerpo.append(titulo);
      cuerpo.append(el("span", "op-detalle", [ot.modelo, ot.patente, ot.cliente].filter(Boolean).join(" · ")));
      if (!ot.notificada) cuerpo.append(el("span", "op-campana", "Horas del técnico sin notificar"));
      li.append(dias, cuerpo);
      return li;
    }));
    const mas = $("ot-ver-mas");
    mas.hidden = lista.length <= PRIMERAS;
    mas.textContent = verTodas ? "Ver menos" : `Ver las ${lista.length}`;
  }

  $("ot-ver-mas").addEventListener("click", () => { verTodas = !verTodas; pintar(); });

  // ---------- Detalle de una OT ----------

  const dialogo = $("dialogo-ot");
  $("ot-cerrar").addEventListener("click", () => dialogo.close());

  function dato(etiqueta, valor) {
    const caja = el("div", "ficha-dato");
    caja.append(el("span", "", etiqueta), el("strong", "", valor || "Sin dato"));
    return caja;
  }

  function abrir(ot) {
    $("t-ot").textContent = `OT ${ot.ot}`;
    const definicion = ETAPAS.find((e) => e.clave === ot.etapa);
    const datosOT = el("div", "ficha-datos");
    datosOT.append(
      dato("Etapa", `${definicion.titulo}. ${definicion.falta}.`),
      dato("Abierta desde", ot.fechaEntrada ? `${fechaLarga(ot.fechaEntrada)} (${plural(ot.dias, "día", "días")})` : plural(ot.dias, "día", "días")),
      dato("Trabajo", ot.trabajo),
      dato("Vehículo", [ot.marca, ot.modelo, ot.patente].filter(Boolean).join(" ")),
      dato("Kilometraje", ot.km ? `${ot.km.toLocaleString("es-CL")} km` : ""),
      dato("VIN", ot.vin),
      dato("Cliente", ot.cliente),
      dato("Tipo de cliente", ot.tipoCliente),
      dato("Estado en el Excel", [ot.status, ot.statUsu, ot.clase].filter(Boolean).join(" · ")),
      dato("Horas del técnico", ot.notificada ? "Notificadas" : "Sin notificar"),
      dato("Costo real", clp(ot.costoReal)),
      dato("Total planificado", clp(ot.totalPlan)),
      dato("Ingreso real", clp(ot.ingresoReal)),
      dato("Última modificación", ot.modificadoPor),
    );
    $("ot-contenido").replaceChildren(datosOT);
    dialogo.showModal();
  }

  async function refrescar() {
    try {
      datos = await api("/api/cartera?vista=ot");
      pintar();
    } catch (e) {
      if (e.message !== "sin sesión") $("seccion-ot").hidden = true;
    }
    return datos;
  }

  return { refrescar, datos: () => datos };
}
