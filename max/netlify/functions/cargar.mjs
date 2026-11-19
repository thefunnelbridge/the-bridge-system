// Carga de facturación: el formulario de dos campos o las filas de un Excel.
// La facturación personal de Javier se guarda directo en la zona privada.
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { leerMes, guardarMes } from "../../lib/datos.mjs";
import { guardarPersonalDia } from "../../lib/privado.mjs";
import { registrarActividad } from "../../lib/almacen.mjs";
import { hoyChile, esFechaISO, mesDe, aplicarDia, montoValido } from "../../lib/calculos.mjs";

const MAX_FILAS = 400;

const fechaLarga = (iso) =>
  new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", day: "numeric", month: "long" }).format(new Date(`${iso}T12:00:00Z`));

function revisarFila(fila, hoy) {
  if (!esFechaISO(fila?.fecha)) return "Hay una fecha que no entiendo.";
  if (fila.fecha > hoy) return `El ${fechaLarga(fila.fecha)} todavía no llega: no puedo cargar días futuros.`;
  const tieneDepto = fila.depto !== undefined && fila.depto !== null;
  const tienePersonal = fila.personal !== undefined && fila.personal !== null;
  if (!tieneDepto && !tienePersonal) return "Falta el monto.";
  if (tieneDepto && !montoValido(fila.depto)) return "Hay un monto del departamento que no es válido.";
  if (tienePersonal && !montoValido(fila.personal)) return "Hay un monto personal que no es válido.";
  return null;
}

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["POST"]);
  if (falla) return falla;

  const hoy = hoyChile();
  const modo = cuerpo.modo === "acumulado" ? "acumulado" : "dia";
  const filas = Array.isArray(cuerpo.filas) ? cuerpo.filas : [];
  if (!filas.length) return error("No hay datos para guardar.", 400);
  if (filas.length > MAX_FILAS) return error(`Son demasiadas filas (máximo ${MAX_FILAS}).`, 400);
  if (modo === "acumulado" && filas.length > 1) return error("El acumulado se carga de a un día.", 400);

  for (const fila of filas) {
    const problema = revisarFila(fila, hoy);
    if (problema) return error(problema, 400);
  }

  // Tablero: facturación del departamento, mes por mes.
  const ordenadas = [...filas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const meses = new Map();
  for (const fila of ordenadas) {
    if (fila.depto === undefined || fila.depto === null) continue;
    const mes = mesDe(fila.fecha);
    if (!meses.has(mes)) meses.set(mes, await leerMes(mes));
    const datos = meses.get(mes);
    const resultado = aplicarDia(datos.dias, fila.fecha, fila.depto, modo);
    if (resultado.error) return error(resultado.error, 400);
    datos.dias = resultado.dias;
  }

  // Zona privada primero: si su validación falla, no se guarda nada del tablero.
  const personales = ordenadas.filter((f) => f.personal !== undefined && f.personal !== null);
  for (const fila of personales) {
    const resultado = await guardarPersonalDia(mesDe(fila.fecha), fila.fecha, fila.personal, modo);
    if (resultado.error) return error(`Tu facturación personal: ${resultado.error}`, 400);
  }
  for (const [mes, datos] of meses) await guardarMes(mes, datos);

  // En la actividad nunca van montos.
  const texto = filas.length === 1
    ? `Se cargó la facturación del ${fechaLarga(filas[0].fecha)}.`
    : `Se cargaron ${filas.length} días de facturación desde un Excel.`;
  await registrarActividad(texto, "carga");
  return json({ ok: true, guardadas: filas.length });
};

export const config = { path: "/api/cargar" };
