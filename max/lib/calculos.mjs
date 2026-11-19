// Cálculos de Max: días hábiles y avance contra la meta del mes.
// Todo aquí es puro (sin base de datos), para poder probarlo.
import { FERIADOS_CL } from "./feriados-cl.mjs";

const ZONA = "America/Santiago";

export const AJUSTES_POR_DEFECTO = { sabado: "no", noHabiles: [] };

// Fecha de hoy en Chile, como "2026-11-19".
export function hoyChile(ahora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
}

export function esFechaISO(texto) {
  if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [a, m, d] = texto.split("-").map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}

export const esMes = (texto) => typeof texto === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(texto);
export const mesDe = (fechaISO) => fechaISO.slice(0, 7);

export function diasDelMes(mes) {
  const [a, m] = mes.split("-").map(Number);
  const cantidad = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return Array.from({ length: cantidad }, (_, i) => `${mes}-${String(i + 1).padStart(2, "0")}`);
}

export function diaAnterior(fechaISO) {
  const [a, m, d] = fechaISO.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d - 1)).toISOString().slice(0, 10);
}

export function diasEntre(desdeISO, hastaISO) {
  const t = (iso) => Date.UTC(...iso.split("-").map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))));
  return Math.round((t(hastaISO) - t(desdeISO)) / 86400000);
}

// Cuánto vale un día para la meta: 1 (hábil), 0,5 (sábado de medio día) o 0.
export function pesoDia(fechaISO, ajustes = AJUSTES_POR_DEFECTO) {
  if (FERIADOS_CL[fechaISO]) return 0;
  if ((ajustes.noHabiles || []).includes(fechaISO)) return 0;
  const [a, m, d] = fechaISO.split("-").map(Number);
  const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay(); // 0 domingo, 6 sábado
  if (dia === 0) return 0;
  if (dia === 6) return ajustes.sabado === "completo" ? 1 : ajustes.sabado === "medio" ? 0.5 : 0;
  return 1;
}

export function feriadosDelMes(mes) {
  return diasDelMes(mes).filter((f) => FERIADOS_CL[f]).map((fecha) => ({ fecha, nombre: FERIADOS_CL[fecha] }));
}

// Avance del mes contra la meta.
//   meta: número o null. dias: { "2026-11-03": 1500000, ... } (facturación de cada día).
// Si falta un dato, el campo va en null: Max nunca lo inventa.
export function resumenMes({ mes, hoy, meta = null, dias = {}, ajustes = AJUSTES_POR_DEFECTO }) {
  const fechas = diasDelMes(mes);
  const serie = fechas.map((fecha) => ({
    fecha,
    peso: pesoDia(fecha, ajustes),
    monto: Number.isFinite(dias[fecha]) ? dias[fecha] : null,
  }));
  const conDato = serie.filter((d) => d.monto !== null);
  const facturado = conDato.length ? conDato.reduce((s, d) => s + d.monto, 0) : null;
  const habilesTotal = serie.reduce((s, d) => s + d.peso, 0);

  // Días que quedan para facturar: desde mañana, más hoy si todavía no se carga.
  const mesActual = mesDe(hoy);
  const hoyCargado = dias[hoy] !== undefined;
  const queda = (d) => {
    if (mes > mesActual) return true;
    if (mes < mesActual) return false;
    return d.fecha > hoy || (d.fecha === hoy && !hoyCargado);
  };
  const habilesRestantes = serie.filter(queda).reduce((s, d) => s + d.peso, 0);
  const habilesTranscurridos = habilesTotal - habilesRestantes;

  const tieneMeta = Number.isFinite(meta) && meta > 0;
  const acumulado = facturado ?? 0;
  const falta = tieneMeta ? Math.max(0, meta - acumulado) : null;
  const cumplida = tieneMeta && acumulado >= meta;
  const pct = tieneMeta ? Math.round((acumulado / meta) * 1000) / 10 : null;
  const porDia = tieneMeta && !cumplida && habilesRestantes > 0 ? Math.ceil(falta / habilesRestantes) : null;
  const promedioNecesario = tieneMeta && habilesTotal > 0 ? Math.round(meta / habilesTotal) : null;

  // Ritmo: lo que debería llevar facturado a esta altura del mes.
  let ritmo = null;
  if (tieneMeta && facturado !== null && habilesTotal > 0 && habilesTranscurridos > 0) {
    const esperado = Math.round((meta * habilesTranscurridos) / habilesTotal);
    ritmo = { esperado, diferencia: acumulado - esperado };
  }

  return {
    mes,
    meta: tieneMeta ? meta : null,
    facturado,
    falta,
    pct,
    cumplida,
    porDia,
    sinDiasParaLlegar: tieneMeta && !cumplida && habilesRestantes === 0,
    promedioNecesario,
    habilesTotal,
    habilesRestantes,
    habilesTranscurridos,
    ritmo,
    ultimoDia: conDato.length ? conDato[conDato.length - 1].fecha : null,
    serie,
  };
}

// Aplica la facturación de un día. modo "dia": el monto es lo de ese día.
// modo "acumulado": el monto es el total del mes hasta ese día.
export function aplicarDia(dias, fecha, monto, modo = "dia") {
  const nuevo = { ...dias };
  if (modo === "acumulado") {
    const previo = Object.entries(dias).filter(([f]) => f < fecha).reduce((s, [, v]) => s + v, 0);
    const delDia = monto - previo;
    if (delDia < 0) {
      return { error: "Ese acumulado es menor que lo que ya está cargado en los días anteriores. Revisa el monto." };
    }
    nuevo[fecha] = delDia;
  } else {
    nuevo[fecha] = monto;
  }
  return { dias: nuevo };
}

const MONTO_MAXIMO = 100_000_000_000;
export const montoValido = (n) => Number.isInteger(n) && n >= 0 && n <= MONTO_MAXIMO;

export function textoLimpio(valor, max = 80) {
  return String(valor ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}
