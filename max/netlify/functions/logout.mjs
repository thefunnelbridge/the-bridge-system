// Cierra la sesión.
import { cookieBorrarSesion } from "../../lib/sesion.mjs";
import { json, error, esSeguro, mismoOrigen } from "../../lib/respuestas.mjs";

export default async (request) => {
  if (request.method !== "POST") return error("Método no permitido.", 405);
  if (!mismoOrigen(request)) return error("Origen no permitido.", 403);
  return json({ ok: true }, 200, { "set-cookie": cookieBorrarSesion({ seguro: esSeguro(request) }) });
};

export const config = { path: "/api/logout" };
