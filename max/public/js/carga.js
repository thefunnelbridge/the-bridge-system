// Formularios de Max: cargar la facturación, subir un Excel, ajustes y terminados.
import { api } from "./api.js";
import { aMonto, conPuntos, clp, fechaCorta, fechaLarga, nombreMes, plural } from "./formato.js";
import { cargarLibreria, interpretar, descargarPlantilla } from "./excel.js";

const $ = (id) => document.getElementById(id);

function cerrarCon(dialogo, ...botones) {
  for (const id of botones) $(id).addEventListener("click", () => dialogo.close());
}

// `estado()` entrega los últimos datos del tablero; `alGuardar()` lo refresca.
// `alRefrescar()` vuelve a pintar todo sin que Max hable.
export function prepararFormularios({ estado, alGuardar, alRefrescar = async () => {} }) {
  // ---------- Facturación del día ----------
  const dCargar = $("dialogo-cargar");
  const mDia = $("dia-mensaje");
  conPuntos($("dia-depto"));
  // El monto personal no lleva puntos: se escribe a ciegas y solo acepta números.
  $("dia-personal").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/[^\d]/g, ""); });

  $("btn-cargar").addEventListener("click", () => {
    const hoy = estado().hoy;
    $("form-dia").reset();
    $("dia-fecha").value = hoy;
    $("dia-fecha").max = hoy;
    mDia.textContent = "";
    limpiarExcel();
    dCargar.showModal();
    $("dia-depto").focus();
  });
  cerrarCon(dCargar, "cargar-cerrar");

  $("form-dia").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const depto = aMonto($("dia-depto").value);
    const personal = aMonto($("dia-personal").value);
    const fecha = $("dia-fecha").value;
    if (!fecha) { mDia.textContent = "Elige el día."; return; }
    if (depto === null && personal === null) { mDia.textContent = "Escribe al menos un monto."; return; }
    const fila = { fecha };
    if (depto !== null) fila.depto = depto;
    if (personal !== null) fila.personal = personal;
    $("dia-guardar").disabled = true;
    try {
      await api("/api/cargar", { modo: $("dia-modo").value, filas: [fila] });
      dCargar.close();
      await alGuardar(`Listo. Guardé la facturación del ${fechaLarga(fecha)}.`);
    } catch (e) {
      mDia.textContent = e.message;
    } finally {
      $("dia-guardar").disabled = false;
    }
  });

  // ---------- Excel ----------
  const vista = $("excel-vista");
  const mExcel = $("excel-mensaje");
  const confirmar = $("excel-confirmar");
  let pendiente = null;

  function limpiarExcel() {
    pendiente = null;
    vista.hidden = true;
    vista.replaceChildren();
    confirmar.hidden = true;
    mExcel.textContent = "";
    $("excel-archivo").value = "";
  }

  function linea(texto, clase = "") {
    const p = document.createElement("p");
    p.textContent = texto;
    if (clase) p.className = clase;
    return p;
  }

  $("excel-archivo").addEventListener("change", async (evento) => {
    const archivos = [...(evento.target.files || [])];
    if (!archivos.length) return;
    mExcel.textContent = "";
    vista.hidden = true;
    confirmar.hidden = true;
    try {
      const XLSX = await cargarLibreria();
      // Se pueden elegir varios archivos de una vez: se juntan en una sola carga.
      const leido = { facturacion: [], terminados: [], clientes: [], atenciones: [], solicitudes: [], ot: [], avisos: [] };
      for (const uno of archivos) {
        if (uno.size > 30 * 1024 * 1024) throw new Error(`"${uno.name}" es muy grande (más de 30 MB).`);
        const parte = interpretar(XLSX, new Uint8Array(await uno.arrayBuffer()), uno.name, { asesorOT: estado().ajustes.asesorOT });
        for (const clave of Object.keys(leido)) leido[clave].push(...parte[clave]);
      }
      const archivo = { name: archivos.map((a) => a.name).join(", ") };
      const hoy = estado().hoy;
      const futuras = leido.facturacion.filter((f) => f.fecha > hoy).length;
      leido.facturacion = leido.facturacion.filter((f) => f.fecha <= hoy);
      const deCartera = leido.clientes.length + leido.atenciones.length + leido.solicitudes.length + leido.ot.length;
      leido.archivoOT = archivos.find((a) => /ot/i.test(a.name))?.name || archivo.name;
      if (!leido.facturacion.length && !leido.terminados.length && !deCartera) {
        throw new Error(leido.avisos[0] || "No reconocí lo que trae ese archivo. Sirven: facturación, terminados, clientes, atenciones, solicitudes de Toyota o el Excel de OT.");
      }
      pendiente = leido;

      // Vista previa: qué se va a guardar, antes de guardar.
      const partes = [linea(`${archivos.length === 1 ? "Archivo" : "Archivos"}: ${archivo.name}`, "excel-nombre")];
      if (leido.facturacion.length) {
        const fechas = leido.facturacion.map((f) => f.fecha).sort();
        const total = leido.facturacion.reduce((s, f) => s + (f.depto ?? 0), 0);
        const conDepto = leido.facturacion.some((f) => f.depto !== null);
        partes.push(linea(
          `${plural(leido.facturacion.length, "día", "días")} de facturación, del ${fechaCorta(fechas[0])} al ${fechaCorta(fechas.at(-1))}.` +
          (conDepto ? ` Total del departamento: ${clp(total)}.` : ""),
        ));
        if (leido.facturacion.some((f) => f.personal !== null)) {
          partes.push(linea("Incluye tu facturación personal: se guarda en la zona privada."));
        }
      }
      if (leido.terminados.length) {
        partes.push(linea(`${plural(leido.terminados.length, "trabajo terminado", "trabajos terminados")} sin facturar.`));
      }
      if (leido.ot.length) partes.push(linea(`${plural(leido.ot.length, "OT abierta", "OT abiertas")}. Reemplaza la lista de OT anterior y la compara con ella.`));
      if (leido.clientes.length) partes.push(linea(`${plural(leido.clientes.length, "cliente", "clientes")} para tu cartera. Reemplaza la lista de clientes anterior.`));
      if (leido.atenciones.length) partes.push(linea(`${plural(leido.atenciones.length, "atención", "atenciones")} para el historial. Reemplaza el historial anterior.`));
      if (leido.solicitudes.length) partes.push(linea(`${plural(leido.solicitudes.length, "solicitud", "solicitudes")} de Toyota. Reemplaza las solicitudes anteriores.`));
      if (futuras) partes.push(linea(`Dejé fuera ${plural(futuras, "día", "días")} con fecha futura.`, "excel-aviso"));
      for (const aviso of leido.avisos) partes.push(linea(aviso, "excel-aviso"));
      vista.replaceChildren(...partes);
      vista.hidden = false;
      confirmar.hidden = false;
    } catch (e) {
      pendiente = null;
      mExcel.textContent = e.message || "No pude leer ese archivo.";
    }
  });

  confirmar.addEventListener("click", async () => {
    if (!pendiente) return;
    confirmar.disabled = true;
    try {
      if (pendiente.facturacion.length) {
        const filas = pendiente.facturacion.map((f) => {
          const fila = { fecha: f.fecha };
          if (f.depto !== null) fila.depto = f.depto;
          if (f.personal !== null) fila.personal = f.personal;
          return fila;
        });
        await api("/api/cargar", { modo: "dia", filas });
      }
      if (pendiente.terminados.length) {
        await api("/api/terminados", { accion: "importar", filas: pendiente.terminados });
      }
      if (pendiente.ot.length) await api("/api/cartera", { accion: "importar", tipo: "ot", filas: pendiente.ot, archivo: pendiente.archivoOT });
      for (const tipo of ["clientes", "atenciones", "solicitudes"]) {
        if (pendiente[tipo].length) await api("/api/cartera", { accion: "importar", tipo, filas: pendiente[tipo] });
      }
      dCargar.close();
      await alGuardar("Listo. Guardé lo que venía en el archivo.");
    } catch (e) {
      mExcel.textContent = e.message;
    } finally {
      confirmar.disabled = false;
    }
  });

  $("excel-plantilla").addEventListener("click", async () => {
    try {
      descargarPlantilla(await cargarLibreria());
    } catch (e) {
      mExcel.textContent = e.message;
    }
  });

  // ---------- Ajustes ----------
  const dAjustes = $("dialogo-ajustes");
  const mAjustes = $("aj-mensaje");
  let noHabiles = [];
  conPuntos($("aj-meta"));

  function pintarDias() {
    $("aj-dias").replaceChildren(...noHabiles.map((fecha) => {
      const li = document.createElement("li");
      li.textContent = fechaCorta(fecha);
      const quitar = document.createElement("button");
      quitar.type = "button";
      quitar.textContent = "Quitar";
      quitar.setAttribute("aria-label", `Quitar el ${fechaLarga(fecha)}`);
      quitar.addEventListener("click", () => { noHabiles = noHabiles.filter((f) => f !== fecha); pintarDias(); });
      li.append(quitar);
      return li;
    }));
  }

  $("btn-ajustes").addEventListener("click", () => {
    const datos = estado();
    const mes = datos.resumen.mes;
    $("e-meta").textContent = `Meta de ${nombreMes(mes)} del departamento`;
    $("aj-meta").value = datos.resumen.meta ? datos.resumen.meta.toLocaleString("es-CL") : "";
    $("aj-sabado").value = datos.ajustes.sabado || "no";
    $("aj-asesor").value = datos.ajustes.asesorOT || "";
    noHabiles = [...(datos.ajustes.noHabiles || [])];
    $("aj-dia").value = "";
    $("aj-feriados").textContent = datos.feriados.length
      ? `Feriados que ya descuento este mes: ${datos.feriados.map((f) => `${fechaCorta(f.fecha)} (${f.nombre})`).join(", ")}.`
      : "Este mes no tiene feriados.";
    mAjustes.textContent = "";
    pintarDias();
    dAjustes.showModal();
  });
  cerrarCon(dAjustes, "aj-cerrar");

  // Lista "No contactar": se aplica de inmediato.
  async function pintarExcluidos() {
    try {
      const { excluidos } = await api("/api/cartera?vista=excluidos");
      $("aj-excluidos").replaceChildren(...excluidos.map((x) => {
        const li = document.createElement("li");
        li.textContent = x.texto;
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.textContent = "Quitar";
        quitar.addEventListener("click", async () => {
          try {
            await api("/api/cartera", { accion: "incluir", id: x.id });
            mAjustes.textContent = "Listo. Volverá a aparecer cuando se carguen de nuevo los archivos de clientes.";
          } catch (e) { mAjustes.textContent = e.message; }
          await pintarExcluidos();
        });
        li.append(quitar);
        return li;
      }));
    } catch { /* si no hay conexión, la lista queda como estaba */ }
  }

  $("btn-ajustes").addEventListener("click", () => { $("aj-excluir").value = ""; pintarExcluidos(); });

  async function excluir() {
    const texto = $("aj-excluir").value.trim();
    if (!texto) return;
    try {
      const { quitados } = await api("/api/cartera", { accion: "excluir", texto });
      $("aj-excluir").value = "";
      mAjustes.textContent = quitados
        ? `Listo. Saqué ${quitados === 1 ? "a 1 persona" : `a ${quitados} personas`} de la cartera.`
        : "Listo. No estaba en la cartera, pero queda anotada para las próximas cargas.";
      await pintarExcluidos();
      await alRefrescar();
    } catch (e) {
      mAjustes.textContent = e.message;
    }
  }
  $("aj-excluir-agregar").addEventListener("click", excluir);
  $("aj-excluir").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); excluir(); } });

  $("aj-agregar").addEventListener("click", () => {
    const fecha = $("aj-dia").value;
    if (fecha && !noHabiles.includes(fecha)) {
      noHabiles = [...noHabiles, fecha].sort();
      pintarDias();
    }
    $("aj-dia").value = "";
  });

  $("form-ajustes").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const meta = aMonto($("aj-meta").value);
    if (meta === 0) { mAjustes.textContent = "La meta tiene que ser mayor que cero."; return; }
    try {
      const asesorOT = $("aj-asesor").value.trim();
      await api("/api/ajustes", { meta, sabado: $("aj-sabado").value, noHabiles, ...(asesorOT ? { asesorOT } : {}) });
      dAjustes.close();
      await alGuardar("Listo. Guardé los ajustes.");
    } catch (e) {
      mAjustes.textContent = e.message;
    }
  });

  // ---------- Terminado sin facturar ----------
  const dTerminado = $("dialogo-terminado");
  const mTerminado = $("te-mensaje");

  $("btn-terminado").addEventListener("click", () => {
    $("form-terminado").reset();
    $("te-fecha").value = estado().hoy;
    $("te-fecha").max = estado().hoy;
    mTerminado.textContent = "";
    dTerminado.showModal();
    $("te-ot").focus();
  });
  cerrarCon(dTerminado, "te-cerrar");

  $("form-terminado").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const ot = $("te-ot").value.trim();
    if (!ot) { mTerminado.textContent = "Escribe el número de OT."; return; }
    try {
      await api("/api/terminados", {
        accion: "agregar",
        fila: {
          ot,
          patente: $("te-patente").value,
          cliente: $("te-cliente").value,
          modelo: $("te-modelo").value,
          fechaTermino: $("te-fecha").value || null,
        },
      });
      dTerminado.close();
      await alGuardar(`Listo. Anoté la OT ${ot}.`);
    } catch (e) {
      mTerminado.textContent = e.message;
    }
  });
}
