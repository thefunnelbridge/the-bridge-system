// Lee un Excel de facturación o de terminados y lo convierte en filas simples.
// Se lee en el navegador: nada se envía hasta que Javier confirma la vista previa.
import { aMonto, aFechaISO } from "./formato.js";

let cargando = null;

// La librería pesa casi 1 MB: se carga solo cuando se necesita.
export function cargarLibreria() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  cargando ||= new Promise((resolver, rechazar) => {
    const script = document.createElement("script");
    script.src = "/js/vendor/xlsx.full.min.js";
    script.onload = () => resolver(window.XLSX);
    script.onerror = () => { cargando = null; rechazar(new Error("No pude cargar el lector de Excel.")); };
    document.head.appendChild(script);
  });
  return cargando;
}

const normal = (texto) => String(texto ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const COLUMNAS = {
  ot: /^(n[°ºo.]*\s*)?(de\s+)?(ot|o\.t\.|orden)\b/,
  cliente: /cliente|nombre/,
  patente: /patente|ppu|placa/,
  modelo: /modelo|vehiculo/,
  termino: /termin|fecha/,
  fecha: /^fecha|^dia$/,
  personal: /javier|personal|asesor|propia|^mi /,
  depto: /depart|depto|taller|sucursal|total|factur|venta|monto/,
};

function ubicar(encabezados, clave, ocupadas = []) {
  return encabezados.findIndex((e, i) => !ocupadas.includes(i) && COLUMNAS[clave].test(e));
}

// ---------- Cartera: clientes, atenciones y solicitudes de Toyota ----------

const CARTERA = {
  solicitudes: {
    es: (enc) => enc.some((e) => /fecha reservada/.test(e)),
    columnas: { rut: /rut/, servicio: /tipo de servicio/, detalle: /^detalle/, modelo: /modelo/, anio: /^an(i|n)?o$/, patente: /patente/, fecha: /fecha reservada/, hora: /^hora/, comentario: /comentario/, campana: /campana/ },
    fechas: ["fecha"],
  },
  atenciones: {
    es: (enc) => enc.some((e) => /tipo de lista/.test(e)),
    columnas: { ot: /^(n[°ºo.]*\s*)?(ot|orden)\b/, fecha: /^fecha/, tipo: /tipo de lista/, patente: /patente/, rut: /rut/, asesor: /asesor/ },
    fechas: ["fecha"],
  },
  clientes: {
    es: (enc) => enc.some((e) => /^nombre/.test(e)) && enc.some((e) => /^rut/.test(e)) && enc.some((e) => /patente|mantencion|telefono/.test(e)),
    columnas: { nombre: /^nombre/, rut: /^rut/, telefono: /telefono|celular|fono/, email: /mail|correo/, patentes: /patente/, ultimaAtencion: /^ultima atencion/, mantencion: /mantencion/, asesor: /asesor/, listas: /aparece/ },
    fechas: ["ultimaAtencion", "mantencion"],
  },
};

// Una hora que Excel guardó como fracción del día (0,395 = 09:30).
function aHora(valor) {
  if (typeof valor === "number" && valor >= 0 && valor < 1) {
    const minutos = Math.round(valor * 1440);
    return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
  }
  return String(valor ?? "").trim();
}

function leerCartera(filas, salida) {
  for (let i = 0; i < Math.min(filas.length, 15); i++) {
    const enc = (filas[i] || []).map(normal);
    const tipo = Object.keys(CARTERA).find((nombre) => CARTERA[nombre].es(enc));
    if (!tipo) continue;
    const { columnas, fechas } = CARTERA[tipo];
    const indice = Object.fromEntries(Object.entries(columnas).map(([clave, patron]) => [clave, enc.findIndex((e) => patron.test(e))]));
    let ilegibles = 0;
    for (const fila of filas.slice(i + 1)) {
      if (!fila || fila.every((c) => c === null || c === "")) continue;
      const dato = {};
      for (const [clave, pos] of Object.entries(indice)) {
        const valor = pos === -1 ? null : fila[pos];
        if (fechas.includes(clave)) {
          dato[clave] = aFechaISO(valor);
          if (valor !== null && String(valor).trim() !== "" && dato[clave] === null) ilegibles += 1;
        } else if (clave === "hora") dato[clave] = aHora(valor);
        else dato[clave] = valor === null ? "" : String(valor).trim();
      }
      salida[tipo].push(dato);
    }
    if (ilegibles) salida.avisos.push(`${ilegibles} ${ilegibles === 1 ? "fecha venía ilegible" : "fechas venían ilegibles"} (por ejemplo "#####") y ${ilegibles === 1 ? "quedó vacía" : "quedaron vacías"}.`);
    return true;
  }
  return false;
}

// ---------- OT abiertas: Excel diario de Control y Gestión ----------
// Lee dos formatos: el Excel completo (hoja BASE, una fila por OT de todo el
// país) y un archivo ya filtrado con las OT del asesor.

const OT_CRUDO = {
  receptor: /^nombre receptor/, ot: /^orden$/, fechaEntrada: /^fe\.? ?entrada/, dias: /^diasproc/, status: /^status$/,
  statUsu: /^statusu/, clase: /^clase ot/, tipoTaller: /^agrupo tipo taller/, tipoCliente: /^tipo cliente/,
  notificada: /ot no notificadas/, trabajo: /^texto breve/, marca: /^marca$/, modelo: /^modelo$/, patente: /^matric/,
  vin: /^equipo$/, km: /^odometro/, cliente: /^nombre cliente/, rut: /^rut client/, costoReal: /^costes tot/,
  ingresoReal: /^ingresos tot/, totalPlan: /^tota?l? general/, modificadoPor: /^modif/,
};

const OT_FILTRADO = {
  ot: /^ot$/, fechaEntrada: /^fecha_entrada/, dias: /^dias_abierta/, status: /^status_reporte/, statUsu: /^status_usuario/,
  clase: /^clase_ot/, tipoTaller: /^tipo_taller/, tipoCliente: /^tipo_cliente/, notificada: /^horas_tecnico/, trabajo: /^trabajo/,
  marca: /^marca$/, modelo: /^modelo$/, patente: /^patente/, vin: /^vin$/, km: /^km$/, cliente: /^cliente$/, rut: /^rut_cliente/,
  costoReal: /^costo_real/, ingresoReal: /^ingreso_real/, totalPlan: /^total_plan/, modificadoPor: /^ultima_modificacion/,
};

function leerOT(filas, salida, asesor) {
  for (let i = 0; i < Math.min(filas.length, 10); i++) {
    const enc = (filas[i] || []).map(normal);
    const crudo = enc.some((e) => OT_CRUDO.receptor.test(e)) && enc.some((e) => OT_CRUDO.ot.test(e));
    const filtrado = enc.some((e) => /^etapa_max$/.test(e)) || (enc.includes("ot") && enc.some((e) => /^dias_abierta/.test(e)));
    if (!crudo && !filtrado) continue;
    const mapa = crudo ? OT_CRUDO : OT_FILTRADO;
    const indice = Object.fromEntries(Object.entries(mapa).map(([clave, patron]) => [clave, enc.findIndex((e) => patron.test(e))]));
    const palabras = normal(asesor).split(/\s+/).filter(Boolean);
    let total = 0;
    for (const fila of filas.slice(i + 1)) {
      if (!fila || fila[indice.ot] === null || fila[indice.ot] === "") continue;
      total += 1;
      if (crudo) {
        const receptor = normal(fila[indice.receptor]);
        if (!palabras.length || !palabras.every((p) => receptor.includes(p))) continue;
      }
      const dato = {};
      for (const [clave, pos] of Object.entries(indice)) {
        if (clave === "receptor") continue;
        const valor = pos === -1 ? null : fila[pos];
        dato[clave] = clave === "fechaEntrada" ? aFechaISO(valor) : valor === null ? "" : String(valor).trim();
      }
      salida.ot.push(dato);
    }
    if (crudo) {
      salida.avisos.push(salida.ot.length
        ? `El Excel trae ${total} OT de todo el país; me quedé con las ${salida.ot.length} de ${asesor}.`
        : `El Excel trae ${total} OT, pero ninguna a nombre de "${asesor}". Revisa ese nombre en Ajustes.`);
    }
    return true;
  }
  return false;
}

// Devuelve { facturacion, terminados, clientes, atenciones, solicitudes, ot, avisos }
export function interpretar(XLSX, datos, nombreArchivo = "", { asesorOT = "" } = {}) {
  // Los CSV se leen como texto, sin que la librería adivine fechas ni números.
  let libro;
  if (/\.csv$/i.test(nombreArchivo)) {
    libro = XLSX.read(new TextDecoder("utf-8").decode(datos), { type: "string", raw: true });
  } else {
    // El Excel diario de OT pesa varios MB y tiene 17 hojas: solo se abre la hoja BASE.
    const nombres = XLSX.read(datos, { type: "array", bookSheets: true }).SheetNames;
    const base = nombres.find((n) => normal(n) === "base");
    libro = XLSX.read(datos, base ? { type: "array", sheets: [base] } : { type: "array" });
    if (base) libro.SheetNames = [base];
  }
  const salida = { facturacion: [], terminados: [], clientes: [], atenciones: [], solicitudes: [], ot: [], avisos: [] };

  for (const nombre of libro.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1, raw: true, defval: null });
    if (leerOT(filas, salida, asesorOT)) continue;
    if (leerCartera(filas, salida)) continue;
    // La fila de títulos: la primera (entre las 15 de arriba) que se reconozca.
    let inicio = -1, tipo = null, cols = {};
    for (let i = 0; i < Math.min(filas.length, 15); i++) {
      const enc = (filas[i] || []).map(normal);
      const ot = ubicar(enc, "ot");
      if (ot !== -1) {
        cols = { ot, cliente: ubicar(enc, "cliente"), patente: ubicar(enc, "patente"), modelo: ubicar(enc, "modelo") };
        cols.termino = ubicar(enc, "termino", [ot]);
        inicio = i; tipo = "terminados";
        break;
      }
      const fecha = ubicar(enc, "fecha");
      if (fecha !== -1) {
        const personal = ubicar(enc, "personal", [fecha]);
        const depto = ubicar(enc, "depto", [fecha, personal]);
        if (depto !== -1 || personal !== -1) {
          cols = { fecha, depto, personal };
          inicio = i; tipo = "facturacion";
          break;
        }
      }
    }
    if (tipo === null) {
      if (filas.length) salida.avisos.push(`No reconocí las columnas de la hoja "${nombre}".`);
      continue;
    }

    let saltadas = 0;
    for (const fila of filas.slice(inicio + 1)) {
      if (!fila || fila.every((c) => c === null || c === "")) continue;
      if (tipo === "terminados") {
        const ot = String(fila[cols.ot] ?? "").trim();
        if (!ot) { saltadas += 1; continue; }
        salida.terminados.push({
          ot,
          cliente: cols.cliente === -1 ? "" : String(fila[cols.cliente] ?? "").trim(),
          patente: cols.patente === -1 ? "" : String(fila[cols.patente] ?? "").trim(),
          modelo: cols.modelo === -1 ? "" : String(fila[cols.modelo] ?? "").trim(),
          fechaTermino: cols.termino === -1 ? null : aFechaISO(fila[cols.termino]),
        });
      } else {
        const fecha = aFechaISO(fila[cols.fecha]);
        const depto = cols.depto === -1 ? null : aMonto(fila[cols.depto]);
        const personal = cols.personal === -1 ? null : aMonto(fila[cols.personal]);
        if (!fecha || (depto === null && personal === null)) { saltadas += 1; continue; }
        salida.facturacion.push({ fecha, depto, personal });
      }
    }
    if (saltadas) salida.avisos.push(`En la hoja "${nombre}" salté ${saltadas} ${saltadas === 1 ? "fila que no pude leer" : "filas que no pude leer"}.`);
  }
  return salida;
}

// Plantilla lista para llenar.
export function descargarPlantilla(XLSX) {
  const libro = XLSX.utils.book_new();
  const fact = XLSX.utils.aoa_to_sheet([
    ["Fecha", "Facturación departamento", "Facturación Javier"],
    ["02-11-2026", 0, 0],
  ]);
  fact["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 22 }];
  const term = XLSX.utils.aoa_to_sheet([
    ["OT", "Cliente", "Patente", "Modelo", "Fecha término"],
  ]);
  term["!cols"] = [{ wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 22 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(libro, fact, "Facturación");
  XLSX.utils.book_append_sheet(libro, term, "Terminados");
  XLSX.writeFile(libro, "plantilla-max.xlsx");
}
