// Zona privada "Mi mes": facturación personal de Javier, comisión y sueldo.
// Vive en un almacén aparte. Este archivo solo lo pueden usar la carga de datos
// (para guardar) y la función de Mi mes (parte 3, detrás del PIN). Una prueba
// automática revisa que ninguna otra función lo importe: así el tablero, la voz
// y el resumen no pueden mostrar ni decir estos montos.
import { getStore } from "@netlify/blobs";
import { aplicarDia } from "./calculos.mjs";

const privado = () => getStore({ name: "max-privado", consistency: "strong" });

export async function leerMesPrivado(mes) {
  const datos = (await privado().get(`mes/${mes}`, { type: "json" })) ?? {};
  return { dias: datos.dias ?? {} };
}

// Guarda la facturación personal de un día. Devuelve { ok } o { error }.
export async function guardarPersonalDia(mes, fecha, monto, modo = "dia") {
  const actual = await leerMesPrivado(mes);
  const resultado = aplicarDia(actual.dias, fecha, monto, modo);
  if (resultado.error) return { error: resultado.error };
  await privado().setJSON(`mes/${mes}`, { ...actual, dias: resultado.dias });
  return { ok: true };
}
