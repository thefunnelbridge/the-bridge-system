// Datos del tablero principal (lo que se puede ver en la oficina).
// Los datos privados de "Mi mes" NO pasan por aquí: van en lib/privado.mjs.
import { tienda, leerJSON } from "./almacen.mjs";
import { AJUSTES_POR_DEFECTO } from "./calculos.mjs";

const publico = () => tienda("publico");

export async function leerAjustes() {
  return { ...AJUSTES_POR_DEFECTO, ...(await leerJSON(publico(), "ajustes", {})) };
}

export async function guardarAjustes(ajustes) {
  await publico().setJSON("ajustes", ajustes);
}

// Un mes: { meta: número o null, dias: { "2026-11-03": 1500000 } }
export async function leerMes(mes) {
  const datos = await leerJSON(publico(), `mes/${mes}`, {});
  return { meta: datos.meta ?? null, dias: datos.dias ?? {} };
}

export async function guardarMes(mes, datos) {
  await publico().setJSON(`mes/${mes}`, datos);
}

// Terminados sin facturar: [{ id, ot, cliente, patente, modelo, fechaTermino, creado }]
export async function leerTerminados() {
  return leerJSON(publico(), "terminados", []);
}

export async function guardarTerminados(lista) {
  await publico().setJSON("terminados", lista);
}
