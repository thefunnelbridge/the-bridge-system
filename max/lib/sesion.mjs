// Sesión de Max: un token con fecha de vencimiento, firmado con HMAC-SHA256.
// Solo usa Web Crypto, así funciona igual en Node (funciones) y en Deno (guardia).

const codificador = new TextEncoder();
const decodificador = new TextDecoder();

export const COOKIE_SESION = "max_sesion";
export const DURACION_SESION_HORAS = 12;
export const LARGO_MINIMO_SECRETO = 32;

function aBase64url(bytes) {
  let binario = "";
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64url(texto) {
  const normal = texto.replace(/-/g, "+").replace(/_/g, "/");
  const relleno = normal + "=".repeat((4 - (normal.length % 4)) % 4);
  const binario = atob(relleno);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

async function llaveHmac(secreto) {
  return crypto.subtle.importKey(
    "raw",
    codificador.encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function secretoValido(secreto) {
  return typeof secreto === "string" && secreto.length >= LARGO_MINIMO_SECRETO;
}

export async function firmar(secreto, datos) {
  const cuerpo = aBase64url(codificador.encode(JSON.stringify(datos)));
  const firma = await crypto.subtle.sign("HMAC", await llaveHmac(secreto), codificador.encode(cuerpo));
  return `${cuerpo}.${aBase64url(new Uint8Array(firma))}`;
}

// Devuelve los datos si la firma es válida y no venció; si no, null.
export async function verificar(secreto, token, ahora = Date.now()) {
  if (!secretoValido(secreto) || typeof token !== "string") return null;
  const partes = token.split(".");
  if (partes.length !== 2 || !partes[0] || !partes[1]) return null;
  let firma;
  try {
    firma = deBase64url(partes[1]);
  } catch {
    return null;
  }
  const valida = await crypto.subtle.verify("HMAC", await llaveHmac(secreto), firma, codificador.encode(partes[0]));
  if (!valida) return null;
  let datos;
  try {
    datos = JSON.parse(decodificador.decode(deBase64url(partes[0])));
  } catch {
    return null;
  }
  if (!datos || typeof datos.exp !== "number" || datos.exp <= ahora) return null;
  return datos;
}

export function leerCookie(cabecera, nombre) {
  if (!cabecera) return null;
  for (const parte of cabecera.split(";")) {
    const i = parte.indexOf("=");
    if (i === -1) continue;
    if (parte.slice(0, i).trim() === nombre) return parte.slice(i + 1).trim();
  }
  return null;
}

export async function crearSesion(secreto, ahora = Date.now()) {
  const exp = ahora + DURACION_SESION_HORAS * 3600 * 1000;
  return { token: await firmar(secreto, { tipo: "sesion", exp }), exp };
}

export async function sesionDesdeRequest(secreto, request) {
  const token = leerCookie(request.headers.get("cookie"), COOKIE_SESION);
  const datos = await verificar(secreto, token);
  return datos && datos.tipo === "sesion" ? datos : null;
}

export function cookieSesion(token, { seguro }) {
  const maxAge = DURACION_SESION_HORAS * 3600;
  return `${COOKIE_SESION}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${seguro ? "; Secure" : ""}`;
}

export function cookieBorrarSesion({ seguro }) {
  return `${COOKIE_SESION}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${seguro ? "; Secure" : ""}`;
}

// Compara dos textos sin filtrar por el tiempo de respuesta cuánto coinciden.
export async function iguales(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", codificador.encode(a)),
    crypto.subtle.digest("SHA-256", codificador.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diferencia = 0;
  for (let i = 0; i < x.length; i++) diferencia |= x[i] ^ y[i];
  return diferencia === 0;
}
