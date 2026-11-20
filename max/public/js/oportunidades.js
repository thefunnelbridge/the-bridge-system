// Oportunidades de hoy y cartera de clientes: a quién llamar, qué citas hay
// y la ficha de cada cliente con su historial.
import { api } from "./api.js";
import { fechaCorta, fechaLarga, plural } from "./formato.js";

const $ = (id) => document.getElementById(id);
const PRIMEROS = 8;

function el(etiqueta, clase, texto) {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

// Teléfono chileno para enlaces: 912345678 -> 56912345678
function telefonoCompleto(telefono) {
  const d = String(telefono || "").replace(/\D/g, "");
  if (d.length === 9) return `56${d}`;
  if (d.length === 11 && d.startsWith("56")) return d;
  return d.length >= 8 ? d : "";
}

function enlace(texto, href, clase = "boton-chico") {
  const a = el("a", clase, texto);
  a.href = href;
  if (href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
  return a;
}

function motivo(dias) {
  if (dias < 0) return `Mantención vencida hace ${plural(-dias, "día", "días")}`;
  if (dias === 0) return "La mantención vence hoy";
  return `La mantención vence en ${plural(dias, "día", "días")}`;
}

function mensaje(patente, dias) {
  const vehiculo = patente ? `su vehículo patente ${patente}` : "su vehículo";
  const estado = dias < 0 ? "ya cumplió un año desde su última mantención" : "está por cumplir un año desde su última mantención";
  return `Hola, le escribe Javier, de Servicio Técnico Toyota en Salfa Temuco. Le cuento que ${vehiculo} ${estado}. ¿Le agendo una hora?`;
}

// Botones para contactar a un cliente.
function contactos({ telefono, email, patente, dias = 0 }) {
  const caja = el("div", "op-acciones");
  const fono = telefonoCompleto(telefono);
  if (fono) {
    caja.append(enlace("Llamar", `tel:+${fono}`));
    caja.append(enlace("WhatsApp", `https://wa.me/${fono}?text=${encodeURIComponent(mensaje(patente, dias))}`));
  }
  if (email) {
    const asunto = `Mantención anual de su Toyota${patente ? ` ${patente}` : ""}`;
    caja.append(enlace("Correo", `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje(patente, dias))}`));
  }
  if (!fono && !email) caja.append(el("span", "op-sin", "Sin teléfono ni correo"));
  return caja;
}

export function prepararOportunidades() {
  let datos = null;
  let verTodos = false;

  // ---------- Seguimiento ----------

  async function seguir(rut, estado) {
    try {
      await api("/api/cartera", { accion: "seguimiento", rut, estado });
    } catch (e) {
      if (e.message !== "sin sesión") $("aviso-cartera").textContent = e.message;
    }
    await refrescar();
  }

  function botonesSeguimiento(rut, alTerminar = () => {}) {
    const caja = el("div", "op-acciones");
    const listo = el("button", "boton-chico", "Contactado");
    listo.type = "button";
    listo.title = "No vuelve a aparecer en 30 días";
    listo.addEventListener("click", async () => { listo.disabled = true; await seguir(rut, "contactado"); alTerminar(); });
    const despues = el("button", "boton-chico", "Después");
    despues.type = "button";
    despues.title = "Vuelve a aparecer en 7 días";
    despues.addEventListener("click", async () => { despues.disabled = true; await seguir(rut, "posponer"); alTerminar(); });
    caja.append(listo, despues);
    return caja;
  }

  function nombreConFicha(nombre, rut) {
    const boton = el("button", "op-nombre", nombre || "Cliente sin nombre");
    boton.type = "button";
    boton.addEventListener("click", () => abrirFicha(rut));
    return boton;
  }

  // ---------- Listas ----------

  function pintar() {
    const d = datos;
    const columnas = $("oportunidades-columnas");
    if (!d.hayCartera) {
      columnas.hidden = true;
      $("aviso-cartera").textContent = "Todavía no me cargan tu cartera de clientes. Súbela en \"Cargar datos\": sirven los archivos de clientes, atenciones y solicitudes de Toyota.";
      return;
    }
    $("aviso-cartera").textContent = "";
    columnas.hidden = false;

    // Citas de hoy y del próximo día hábil.
    const cCitas = $("c-citas");
    cCitas.hidden = d.citas.length === 0;
    cCitas.textContent = String(d.citas.length);
    $("op-citas").replaceChildren(...(d.citas.length ? d.citas.map((cita) => {
      const li = el("li", cita.esHoy ? "es-hoy" : "");
      const cuando = el("div", "op-cuando");
      cuando.append(el("strong", "", cita.hora || "--:--"), el("span", "", cita.esHoy ? "Hoy" : fechaCorta(cita.fecha)));
      const cuerpo = el("div", "op-cuerpo");
      cuerpo.append(nombreConFicha(cita.nombre, cita.rut));
      cuerpo.append(el("span", "op-detalle", [cita.servicio, cita.detalle !== "No Aplica" ? cita.detalle : "", [cita.modelo, cita.anio].filter(Boolean).join(" "), cita.patente].filter(Boolean).join(" · ")));
      if (cita.campana) cuerpo.append(el("span", "op-campana", `Campaña pendiente: ${cita.campana}`));
      if (cita.comentario) cuerpo.append(el("span", "op-comentario", `"${cita.comentario}"`));
      li.append(cuando, cuerpo);
      return li;
    }) : [el("li", "vacio", "No hay citas para hoy ni para el próximo día hábil.")]));

    // Clientes para llamar.
    const cLlamar = $("c-llamar");
    cLlamar.hidden = d.llamar.length === 0;
    cLlamar.textContent = String(d.llamar.length);
    const visibles = verTodos ? d.llamar : d.llamar.slice(0, PRIMEROS);
    $("op-llamar").replaceChildren(...(d.llamar.length ? visibles.map((c) => {
      const li = el("li", c.dias < 0 ? "vencida" : "");
      const cuerpo = el("div", "op-cuerpo");
      cuerpo.append(nombreConFicha(c.nombre, c.rut));
      cuerpo.append(el("span", "op-detalle", [motivo(c.dias), c.patente].filter(Boolean).join(" · ")));
      cuerpo.append(contactos(c), botonesSeguimiento(c.rut));
      li.append(cuerpo);
      return li;
    }) : [el("li", "vacio", "Nadie para llamar hoy: no hay mantenciones vencidas ni por vencer sin hora tomada.")]));

    const mas = $("op-ver-mas");
    mas.hidden = d.llamar.length <= PRIMEROS;
    mas.textContent = verTodos ? "Ver menos" : `Ver los ${d.llamar.length}`;
  }

  $("op-ver-mas").addEventListener("click", () => { verTodos = !verTodos; pintar(); });

  async function refrescar() {
    try {
      datos = await api("/api/cartera?vista=oportunidades");
      pintar();
    } catch (e) {
      if (e.message !== "sin sesión") $("aviso-cartera").textContent = "No pude cargar las oportunidades. Revisa la conexión.";
    }
    return datos;
  }

  // ---------- Buscador ----------

  const campo = $("buscar");
  const resultados = $("buscar-resultados");
  let espera = 0;
  let consulta = 0;

  function cerrarResultados() {
    resultados.hidden = true;
    resultados.replaceChildren();
  }

  campo.addEventListener("input", () => {
    clearTimeout(espera);
    const texto = campo.value.trim();
    if (texto.length < 2) { cerrarResultados(); return; }
    espera = setTimeout(async () => {
      const mia = ++consulta;
      try {
        const { resultados: lista } = await api(`/api/cartera?buscar=${encodeURIComponent(texto)}`);
        if (mia !== consulta) return;
        resultados.replaceChildren(...(lista.length ? lista.map((c) => {
          const li = el("li");
          const boton = el("button", "", "");
          boton.type = "button";
          boton.append(el("strong", "", c.nombre || "Sin nombre"), el("span", "", c.patentes.join(", ")));
          boton.addEventListener("click", () => { cerrarResultados(); campo.value = ""; abrirFicha(c.rut); });
          li.append(boton);
          return li;
        }) : [el("li", "vacio", "No encontré a nadie con eso.")]));
        resultados.hidden = false;
      } catch { /* sin conexión: el aviso general ya lo dice */ }
    }, 250);
  });
  $("form-buscar").addEventListener("submit", (e) => e.preventDefault());
  campo.addEventListener("keydown", (e) => { if (e.key === "Escape") { campo.value = ""; cerrarResultados(); } });
  document.addEventListener("click", (e) => { if (!$("form-buscar").contains(e.target)) cerrarResultados(); });

  // ---------- Ficha del cliente ----------

  const dFicha = $("dialogo-ficha");
  $("ficha-cerrar").addEventListener("click", () => dFicha.close());

  function dato(etiqueta, valor) {
    const caja = el("div", "ficha-dato");
    caja.append(el("span", "", etiqueta), el("strong", "", valor || "Sin dato"));
    return caja;
  }

  async function abrirFicha(rut) {
    const contenido = $("ficha-contenido");
    contenido.replaceChildren(el("p", "dialogo-texto", "Buscando..."));
    dFicha.showModal();
    try {
      const f = await api(`/api/cartera?rut=${encodeURIComponent(rut)}`);
      const c = f.cliente;
      $("t-ficha").textContent = c.nombre || "Cliente";
      const dias = c.mantencion ? Math.round((Date.parse(c.mantencion) - Date.parse(f.hoy)) / 86400000) : null;
      const partes = [];

      const datosCliente = el("div", "ficha-datos");
      datosCliente.append(
        dato("RUT", c.rutTexto),
        dato("Teléfono", c.telefono),
        dato("Correo", c.email),
        dato("Patentes", c.patentes.join(", ")),
        dato("Última atención", c.ultimaAtencion ? fechaLarga(c.ultimaAtencion) : ""),
        dato("Mantención anual estimada", c.mantencion ? `${fechaLarga(c.mantencion)}${dias !== null ? ` (${motivo(dias).replace("La mantención ", "").replace("Mantención ", "")})` : ""}` : ""),
        dato("Asesor", c.asesor),
        dato("Aparece en", c.listas),
      );
      partes.push(datosCliente);
      partes.push(contactos({ telefono: c.telefono, email: c.email, patente: c.patentes[0], dias: dias ?? 0 }));
      if (f.seguimiento && f.seguimiento.proximo > f.hoy) {
        partes.push(el("p", "dialogo-nota", `${f.seguimiento.estado === "contactado" ? "Contactado" : "Pospuesto"} el ${fechaCorta(f.seguimiento.cuando)}. Vuelve a la lista el ${fechaCorta(f.seguimiento.proximo)}.`));
      } else {
        partes.push(botonesSeguimiento(c.rut, () => dFicha.close()));
      }

      partes.push(el("h3", "privado-subtitulo", `Solicitudes de Toyota (${f.solicitudes.length})`));
      const sol = el("ul", "ficha-lista");
      sol.append(...(f.solicitudes.length ? f.solicitudes.map((s) => {
        const li = el("li");
        li.append(el("strong", "", `${fechaCorta(s.fecha)}${s.hora ? ` ${s.hora}` : ""}`), el("span", "", [s.servicio, s.detalle !== "No Aplica" ? s.detalle : "", [s.modelo, s.anio].filter(Boolean).join(" "), s.patente].filter(Boolean).join(" · ")));
        if (s.campana) li.append(el("span", "op-campana", `Campaña: ${s.campana}`));
        if (s.comentario) li.append(el("span", "op-comentario", `"${s.comentario}"`));
        return li;
      }) : [el("li", "vacio", "Sin solicitudes registradas.")]));
      partes.push(sol);

      partes.push(el("h3", "privado-subtitulo", `Atenciones (${f.atenciones.length})`));
      const ate = el("ul", "ficha-lista");
      ate.append(...(f.atenciones.length ? f.atenciones.map((a) => {
        const li = el("li");
        li.append(el("strong", "", a.fecha ? fechaCorta(a.fecha) : "Sin fecha"), el("span", "", [`OT ${a.ot}`, a.tipo, a.patente, a.asesor].filter(Boolean).join(" · ")));
        return li;
      }) : [el("li", "vacio", "Sin atenciones registradas.")]));
      partes.push(ate);

      contenido.replaceChildren(...partes);
    } catch (e) {
      contenido.replaceChildren(el("p", "dialogo-mensaje", e.message));
    }
  }

  return { refrescar, datos: () => datos };
}
