// Formatos de Chile: pesos y fechas.

const pesos = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

export const clp = (n) => `$${pesos.format(Math.round(n))}`;

// Para ejes y etiquetas chicas: $4,1 M, $850 mil.
export function clpCorto(n) {
  const v = Math.abs(n);
  if (v >= 1_000_000) return `$${(n / 1_000_000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} M`;
  if (v >= 1_000) return `$${Math.round(n / 1_000).toLocaleString("es-CL")} mil`;
  return clp(n);
}

// "1.250.000" o "$1.250.000" -> 1250000. Devuelve null si no hay número.
export function aMonto(valor) {
  if (typeof valor === "number") return Number.isFinite(valor) && valor >= 0 ? Math.round(valor) : null;
  const digitos = String(valor ?? "").replace(/[^\d]/g, "");
  return digitos ? Number(digitos) : null;
}

// Pone los puntos de miles mientras se escribe.
export function conPuntos(campo) {
  campo.addEventListener("input", () => {
    const n = aMonto(campo.value);
    campo.value = n === null ? "" : pesos.format(n);
  });
}

const aFecha = (iso) => new Date(`${iso}T12:00:00Z`);

export const fechaLarga = (iso) =>
  new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(aFecha(iso));

export const fechaCorta = (iso) =>
  new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", day: "numeric", month: "short" }).format(aFecha(iso));

export const nombreMes = (mes) =>
  new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", month: "long" }).format(aFecha(`${mes}-15`));

export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// Fechas que vienen de un Excel: número de serie, Date o texto. Devuelve "2026-11-19" o null.
export function aFechaISO(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number" && valor > 20000 && valor < 80000) {
    return new Date(Date.UTC(1899, 11, 30) + Math.round(valor) * 86400000).toISOString().slice(0, 10);
  }
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return new Date(valor.getTime() + 12 * 3600 * 1000).toISOString().slice(0, 10);
  }
  const texto = String(valor).trim();
  let m = texto.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return armar(m[1], m[2], m[3]);
  m = texto.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) return armar(m[3].length === 2 ? `20${m[3]}` : m[3], m[2], m[1]);
  return null;
}

function armar(anio, mes, dia) {
  const iso = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  const fecha = new Date(`${iso}T12:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === iso ? iso : null;
}
