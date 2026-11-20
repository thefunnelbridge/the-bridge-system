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

// Devuelve { facturacion, terminados, clientes, atenciones, solicitudes, avisos }
export function interpretar(XLSX, datos, nombreArchivo = "") {
  // Los CSV se leen como texto, sin que la librería adivine fechas ni números.
  const libro = /\.csv$/i.test(nombreArchivo)
    ? XLSX.read(new TextDecoder("utf-8").decode(datos), { type: "string", raw: true })
    : XLSX.read(datos, { type: "array" });
  const salida = { facturacion: [], terminados: [], clientes: [], atenciones: [], solicitudes: [], avisos: [] };

  for (const nombre of libro.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1, raw: true, defval: null });
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
