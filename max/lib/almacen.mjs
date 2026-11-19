// Base de datos de Max: Netlify Blobs.
// Cada almacén guarda documentos JSON. Los datos de "Mi mes" van en un almacén
// aparte que solo abre la función de Mi mes (parte 3); desde aquí no se puede.
import { getStore } from "@netlify/blobs";

const PERMITIDOS = new Set(["publico", "seguridad"]);

export function tienda(nombre) {
  if (!PERMITIDOS.has(nombre)) {
    throw new Error(`Almacén no permitido desde aquí: ${nombre}`);
  }
  return getStore({ name: `max-${nombre}`, consistency: "strong" });
}

export async function leerJSON(almacen, clave, porDefecto) {
  const valor = await almacen.get(clave, { type: "json" });
  return valor ?? porDefecto;
}

const MAX_EVENTOS = 50;

export async function registrarActividad(texto, tipo = "sistema") {
  const almacen = tienda("publico");
  const eventos = await leerJSON(almacen, "actividad", []);
  eventos.unshift({ t: new Date().toISOString(), texto, tipo });
  await almacen.setJSON("actividad", eventos.slice(0, MAX_EVENTOS));
}
