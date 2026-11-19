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

// Devuelve { facturacion: [{fecha, depto, personal}], terminados: [...], avisos: [] }
export function interpretar(XLSX, datos) {
  const libro = XLSX.read(datos, { type: "array" });
  const salida = { facturacion: [], terminados: [], avisos: [] };

  for (const nombre of libro.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1, raw: true, defval: null });
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
