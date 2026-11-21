// Entrada a Max con usuario y clave. Bloquea 15 minutos tras 5 intentos fallidos.
// El usuario se define en MAX_USER (si no está, es "javier").
import { env } from "../../lib/entorno.mjs";
import { crearSesion, cookieSesion, iguales, secretoValido } from "../../lib/sesion.mjs";
import { json, error, esSeguro, mismoOrigen } from "../../lib/respuestas.mjs";
import { tienda, leerJSON, registrarActividad } from "../../lib/almacen.mjs";

const MAX_FALLOS = 5;
const BLOQUEO_MINUTOS = 15;

const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? "" : "s"}`;

// "Basic base64(usuario:clave)" -> { usuario, clave }, o null si no viene o está mal formada.
function leerBasica(cabecera) {
  const m = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(cabecera || "");
  if (!m) return null;
  try {
    const texto = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0)));
    const corte = texto.indexOf(":");
    if (corte === -1) return null;
    return { usuario: texto.slice(0, corte), clave: texto.slice(corte + 1) };
  } catch {
    return null;
  }
}

export default async (request, context) => {
  if (request.method !== "POST") return error("Método no permitido.", 405);
  if (!mismoOrigen(request)) return error("Origen no permitido.", 403);

  const claveReal = env("MAX_PASSWORD");
  const secreto = env("SESSION_SECRET");
  if (!claveReal || !secretoValido(secreto)) {
    return error(
      "Max todavía no está configurado: faltan MAX_PASSWORD o SESSION_SECRET (mínimo 32 caracteres).",
      500,
    );
  }

  // Usuario y clave llegan en el formulario o, para herramientas de mantención,
  // en la cabecera estándar "Authorization: Basic". Son los mismos datos y pasan
  // por el mismo bloqueo de intentos.
  let cuerpo = {};
  const basica = leerBasica(request.headers.get("authorization"));
  if (!basica) {
    try {
      cuerpo = await request.json();
    } catch {
      return error("Solicitud inválida.", 400);
    }
  }
  const clave = basica?.clave ?? (typeof cuerpo?.clave === "string" ? cuerpo.clave : "");
  const usuario = (basica?.usuario ?? (typeof cuerpo?.usuario === "string" ? cuerpo.usuario : "")).trim().toLowerCase();
  const usuarioReal = (env("MAX_USER") || "javier").trim().toLowerCase();

  const seguridad = tienda("seguridad");
  const llave = `login/${context?.ip || "desconocida"}`;
  const estado = await leerJSON(seguridad, llave, { fallos: 0, bloqueadoHasta: 0 });
  const ahora = Date.now();

  if (estado.bloqueadoHasta > ahora) {
    const minutos = Math.ceil((estado.bloqueadoHasta - ahora) / 60000);
    return error(`Demasiados intentos. Espera ${plural(minutos, "minuto")} y vuelve a intentar.`, 429);
  }

  // Se revisan los dos siempre, para no revelar cuál de los dos falló.
  const usuarioOk = await iguales(usuario, usuarioReal);
  const claveOk = await iguales(clave, claveReal);
  if (!clave || !usuarioOk || !claveOk) {
    const fallos = (estado.fallos || 0) + 1;
    if (fallos >= MAX_FALLOS) {
      await seguridad.setJSON(llave, { fallos: 0, bloqueadoHasta: ahora + BLOQUEO_MINUTOS * 60000 });
      await registrarActividad("Se bloqueó la entrada por intentos fallidos.", "alerta");
      return error(`Demasiados intentos. Espera ${BLOQUEO_MINUTOS} minutos y vuelve a intentar.`, 429);
    }
    await seguridad.setJSON(llave, { fallos, bloqueadoHasta: 0 });
    const quedan = MAX_FALLOS - fallos;
    return error(`Usuario o clave incorrectos. Te ${quedan === 1 ? "queda" : "quedan"} ${plural(quedan, "intento")}.`, 401);
  }

  await seguridad.delete(llave);
  const { token } = await crearSesion(secreto);
  await registrarActividad("Entraste a Max.", "sesion");
  return json({ ok: true }, 200, { "set-cookie": cookieSesion(token, { seguro: esSeguro(request) }) });
};

export const config = { path: "/api/login" };
