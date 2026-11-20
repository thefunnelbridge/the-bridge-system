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
//   terminados: trabajos terminados que siguen sin facturar (alerta diaria).
//   citas y llamar: cuántas citas hay hoy y cuántos clientes hay para llamar.
// Solo cantidades: nunca nombres de clientes ni montos.
export function textoSaludo(hora, { hayDatos = false, terminados = 0, citas = 0, llamar = 0 } = {}) {
  const m = momento(hora);
  const reporte = hayDatos ? "Aquí está tu reporte de hoy." : "Todavía no me cargan los datos de hoy.";
  const partes = [];
  if (citas > 0) partes.push(citas === 1 ? "una cita" : `${citas} citas`);
  if (llamar > 0) partes.push(llamar === 1 ? "un cliente para llamar" : `${llamar} clientes para llamar`);
  const agenda = partes.length ? ` Hoy tienes ${partes.join(" y ")}.` : "";
  const alerta = terminados > 0
    ? ` Ojo: tienes ${terminados === 1 ? "un trabajo terminado" : `${terminados} trabajos terminados`} sin facturar.`
    : "";
  return `Hola Javier, ${SALUDO[m]}. ¿Cómo estás? ${reporte}${agenda}${alerta} ${CIERRE[m]}`;
}
