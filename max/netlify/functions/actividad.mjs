// Últimos movimientos registrados por Max (entradas, cargas de datos, alertas).
import { json, error, sesion, sinSesion } from "../../lib/respuestas.mjs";
import { tienda, leerJSON } from "../../lib/almacen.mjs";

export default async (request) => {
  if (request.method !== "GET") return error("Método no permitido.", 405);
  if (!(await sesion(request))) return sinSesion();
  const eventos = await leerJSON(tienda("publico"), "actividad", []);
  return json({ ok: true, eventos: eventos.slice(0, 20) });
};

export const config = { path: "/api/actividad" };
