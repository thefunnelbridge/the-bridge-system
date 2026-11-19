// Ayudas comunes para las funciones del servidor.
import { env } from "./entorno.mjs";
import { sesionDesdeRequest } from "./sesion.mjs";

export function json(datos, status = 200, cabeceras = {}) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...cabeceras,
    },
  });
}

export function error(mensaje, status, extra = {}) {
  return json({ ok: false, error: mensaje, ...extra }, status);
}

export function esSeguro(request) {
  return new URL(request.url).protocol === "https:";
}

// Rechaza envíos que vienen de otro sitio.
export function mismoOrigen(request) {
  const origen = request.headers.get("origin");
  if (!origen) return true;
  return origen === new URL(request.url).origin;
}

// Devuelve la sesión válida o null.
export async function sesion(request) {
  return sesionDesdeRequest(env("SESSION_SECRET"), request);
}

export const sinSesion = () => error("Tu sesión terminó. Vuelve a entrar.", 401);
