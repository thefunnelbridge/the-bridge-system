// Guardia de Max: sin sesión válida no se entrega ninguna página.
// Solo quedan abiertos la pantalla de clave y lo que ella necesita para verse.
import { sesionDesdeRequest } from "../../lib/sesion.mjs";

const PAGINAS_LOGIN = new Set(["/login", "/login.html"]);

export default async (request, context) => {
  const url = new URL(request.url);
  const secreto = Netlify.env.get("SESSION_SECRET");
  const conSesion = Boolean(await sesionDesdeRequest(secreto, request));

  if (PAGINAS_LOGIN.has(url.pathname)) {
    if (conSesion) return Response.redirect(new URL("/", url), 302);
    return context.next();
  }

  if (conSesion) {
    const respuesta = await context.next();
    const tipo = respuesta.headers.get("content-type") || "";
    if (tipo.includes("text/html")) {
      const copia = new Response(respuesta.body, respuesta);
      copia.headers.set("cache-control", "no-store");
      return copia;
    }
    return respuesta;
  }

  const pideHtml = (request.headers.get("accept") || "").includes("text/html");
  if (pideHtml) return Response.redirect(new URL("/login", url), 302);
  return new Response("Sin sesión", { status: 401, headers: { "cache-control": "no-store" } });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/api/*",
    "/.netlify/*",
    "/css/*",
    "/icons/*",
    "/js/login.js",
    "/manifest.webmanifest",
    "/sw.js",
    "/offline.html",
  ],
};
