// Lo que Max dice al entrar. Frases fijas: no gastan créditos de nada.

export function momento(hora) {
  if (hora >= 5 && hora < 12) return "dia";
  if (hora >= 12 && hora < 20) return "tarde";
  return "noche";
}

const SALUDO = { dia: "buenos días", tarde: "buenas tardes", noche: "buenas noches" };
const CIERRE = {
  dia: "Toma tu café y partimos.",
  tarde: "Vamos por una buena tarde.",
  noche: "Cerremos bien el día.",
};

// Para la pantalla: "Buenos días, Javier".
export function saludoCorto(hora) {
  const texto = SALUDO[momento(hora)];
  return `${texto.charAt(0).toUpperCase()}${texto.slice(1)}, Javier`;
}

// Para la voz. Si todavía no hay datos cargados, Max lo dice en vez de inventar.
export function textoSaludo(hora, { hayDatos = false } = {}) {
  const m = momento(hora);
  const reporte = hayDatos ? "Aquí está tu reporte de hoy." : "Todavía no me cargan los datos de hoy.";
  return `Hola Javier, ${SALUDO[m]}. ¿Cómo estás? ${reporte} ${CIERRE[m]}`;
}
