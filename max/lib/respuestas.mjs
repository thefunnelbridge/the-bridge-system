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

// Revisa método, origen y sesión, y lee el cuerpo si lo hay.
// Devuelve { falla: Response } si hay que cortar, o { cuerpo }.
export async function entrada(request, metodos) {
  if (!metodos.includes(request.method)) return { falla: error("Método no permitido.", 405) };
  if (request.method !== "GET" && !mismoOrigen(request)) return { falla: error("Origen no permitido.", 403) };
  if (!(await sesion(request))) return { falla: sinSesion() };
  if (request.method === "GET") return { cuerpo: null };
  try {
    const cuerpo = await request.json();
    if (!cuerpo || typeof cuerpo !== "object") throw new Error("vacío");
    return { cuerpo };
  } catch {
    return { falla: error("Solicitud inválida.", 400) };
  }
}
