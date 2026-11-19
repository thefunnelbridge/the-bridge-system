// Max como app instalable.
// Regla: aquí solo se guarda la interfaz (estilos, código, íconos).
// Las páginas y los datos (/api) siempre van a internet y nunca se guardan.

const VERSION = "max-v1";
const PUBLICOS = ["/offline.html", "/css/max.css", "/icons/icon-192.png", "/icons/icon.svg"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PUBLICOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/.netlify/")) return;

  // Páginas: siempre desde internet; sin conexión, aviso.
  if (request.mode === "navigate") {
    evento.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }

  // Interfaz: primero internet, y si no hay, lo último que se guardó.
  if (/^\/(css|js|icons)\//.test(url.pathname)) {
    evento.respondWith(
      fetch(request)
        .then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        })
        .catch(() => caches.match(request)),
    );
  }
});
