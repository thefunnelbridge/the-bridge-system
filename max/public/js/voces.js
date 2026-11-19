// Elección de la voz de Max entre las que trae el navegador.
// El navegador no informa si una voz es de hombre o de mujer, así que se
// reconocen por nombre. Solo se aceptan voces de hombre en español: si el
// equipo no tiene ninguna, Max no habla con otra voz; lo avisa.

// En orden de preferencia. Lorenzo (Chile) viene con Microsoft Edge.
export const VOCES_DE_HOMBRE = [
  "lorenzo",                                   // Chile (Edge)
  "jorge", "tomas",                            // México, Argentina (Edge)
  "gonzalo", "alex", "mateo", "sebastian", "marcelo", "mario", "luis",
  "emilio", "andres", "federico", "roberto", "rodrigo", "victor", "manuel",
  "alonso", "javier",                          // otras de Latinoamérica (Edge)
  "raul", "pablo",                             // Windows
  "juan", "diego", "carlos",                   // Mac y iPhone
  "alvaro",                                    // España (Edge)
  "eddy", "reed", "rocko",                     // Apple
];

const normalizar = (texto) =>
  String(texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function esEspanol(voz) {
  return /^es([-_]|$)/i.test(voz.lang || "");
}

// Posición en la lista de preferencia, o -1 si no es una voz de hombre conocida.
export function prioridad(voz) {
  if (!voz || !esEspanol(voz)) return -1;
  const nombre = normalizar(voz.name);
  return VOCES_DE_HOMBRE.findIndex((n) => new RegExp(`(^|[^a-z])${n}([^a-z]|$)`).test(nombre));
}

// Voces de hombre en español que tiene este equipo, la mejor primero.
export function vocesDeHombre(voces) {
  return [...(voces || [])]
    .map((voz) => ({ voz, p: prioridad(voz) }))
    .filter((x) => x.p !== -1)
    .sort((a, b) => a.p - b.p)
    .map((x) => x.voz);
}

// La voz a usar: la que eligió Javier si sigue disponible; si no, la mejor.
export function elegirVoz(voces, preferida) {
  const lista = vocesDeHombre(voces);
  if (!lista.length) return null;
  return lista.find((voz) => preferida && voz.voiceURI === preferida) || lista[0];
}

// Nombre corto para mostrar: "Lorenzo (Chile)".
export function etiqueta(voz) {
  const p = prioridad(voz);
  const base = p === -1 ? voz.name : VOCES_DE_HOMBRE[p];
  const nombre = { tomas: "Tomás", raul: "Raúl", andres: "Andrés", sebastian: "Sebastián", victor: "Víctor", alvaro: "Álvaro" }[base]
    || base.charAt(0).toUpperCase() + base.slice(1);
  const region = String(voz.lang || "").split(/[-_]/)[1];
  let pais = "";
  try {
    if (region) pais = new Intl.DisplayNames(["es"], { type: "region" }).of(region.toUpperCase()) || "";
  } catch {}
  return pais ? `${nombre} (${pais})` : nombre;
}

// Parte un texto en frases, para que la voz no se corte en textos largos.
export function partirEnFrases(texto) {
  return String(texto || "").match(/[^.!?]+[.!?]*/g)?.map((f) => f.trim()).filter(Boolean) || [];
}
