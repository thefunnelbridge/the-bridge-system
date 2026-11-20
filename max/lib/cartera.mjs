// Cartera de clientes de Javier y oportunidades del día. Todo puro, para probarlo.
// Los datos vienen de tres archivos: clientes, atenciones y solicitudes de Toyota.
import { esFechaISO, diasEntre, pesoDia, textoLimpio, AJUSTES_POR_DEFECTO } from "./calculos.mjs";

export const LIMITES = { clientes: 5000, atenciones: 30000, solicitudes: 5000 };

// Ventana para llamar por mantención: vencida hace hasta 90 días o vence en 30.
export const DIAS_VENCIDA = 90;
export const DIAS_POR_VENCER = 30;

// RUT sin puntos ni guion, para comparar: "15.578.620-5" -> "155786205"
export const claveRut = (rut) => String(rut ?? "").toUpperCase().replace(/[^0-9K]/g, "");

const fecha = (v) => (esFechaISO(v) ? v : null);
const normal = (t) => String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function sumarDias(iso, n) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

export function normalizarClientes(filas) {
  const vistos = new Set();
  const salida = [];
  for (const f of filas || []) {
    const rut = claveRut(f?.rut);
    if (!rut || vistos.has(rut)) continue;
    vistos.add(rut);
    const patentes = Array.isArray(f.patentes) ? f.patentes : String(f.patentes ?? "").split(/[,;/]/);
    salida.push({
      rut,
      rutTexto: textoLimpio(f.rut, 14),
      nombre: textoLimpio(f.nombre, 80),
      telefono: String(f.telefono ?? "").replace(/\D/g, "").slice(-11),
      email: textoLimpio(f.email, 100).toLowerCase(),
      patentes: patentes.map((p) => textoLimpio(p, 10).toUpperCase()).filter(Boolean).slice(0, 10),
      ultimaAtencion: fecha(f.ultimaAtencion),
      mantencion: fecha(f.mantencion),
      asesor: textoLimpio(f.asesor, 60),
      listas: textoLimpio(f.listas, 120),
    });
  }
  return salida;
}

export function normalizarAtenciones(filas) {
  return (filas || [])
    .map((f) => ({
      ot: textoLimpio(f?.ot, 20),
      fecha: fecha(f?.fecha),
      tipo: textoLimpio(f?.tipo, 40),
      patente: textoLimpio(f?.patente, 10).toUpperCase(),
      rut: claveRut(f?.rut),
      asesor: textoLimpio(f?.asesor, 60),
    }))
    .filter((a) => a.ot && a.rut);
}

// Una campaña real: el texto no dice que no hay.
export function tieneCampana(texto) {
  const t = normal(texto);
  return Boolean(t) && !/no se encontraron|no posee/.test(t);
}

export function normalizarSolicitudes(filas) {
  return (filas || [])
    .map((f) => ({
      rut: claveRut(f?.rut),
      servicio: textoLimpio(f?.servicio, 60),
      detalle: textoLimpio(f?.detalle, 40),
      modelo: textoLimpio(f?.modelo, 40),
      anio: textoLimpio(f?.anio, 4),
      patente: textoLimpio(f?.patente, 10).toUpperCase(),
      fecha: fecha(f?.fecha),
      hora: /^\d{1,2}:\d{2}/.test(String(f?.hora ?? "")) ? String(f.hora).slice(0, 5) : "",
      comentario: textoLimpio(f?.comentario, 300),
      campana: tieneCampana(f?.campana) ? textoLimpio(f.campana, 200).replace(/^\*\s*/, "") : "",
    }))
    .filter((s) => s.rut && s.fecha);
}

// El próximo día hábil después de hoy (para mostrar las citas de "mañana").
export function proximoHabil(hoy, ajustes = AJUSTES_POR_DEFECTO) {
  let dia = hoy;
  for (let i = 0; i < 14; i++) {
    dia = sumarDias(dia, 1);
    if (pesoDia(dia, ajustes) > 0) return dia;
  }
  return sumarDias(hoy, 1);
}

// Lo que Javier puede hacer hoy:
//  - citas: reservas de hoy y del próximo día hábil.
//  - llamar: clientes con la mantención vencida o por vencer, que no tienen hora
//    tomada y que no fueron contactados o pospuestos.
export function oportunidades({ hoy, clientes = [], solicitudes = [], seguimiento = {}, ajustes = AJUSTES_POR_DEFECTO }) {
  const porRut = new Map(clientes.map((c) => [c.rut, c]));
  const siguiente = proximoHabil(hoy, ajustes);

  const citas = solicitudes
    .filter((s) => s.fecha === hoy || s.fecha === siguiente)
    .map((s) => ({ ...s, nombre: porRut.get(s.rut)?.nombre || "", telefono: porRut.get(s.rut)?.telefono || "", esHoy: s.fecha === hoy }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));

  const conHora = new Set(solicitudes.filter((s) => s.fecha >= hoy).map((s) => s.rut));
  const llamar = clientes
    .filter((c) => c.mantencion && !conHora.has(c.rut))
    .map((c) => ({ c, dias: diasEntre(hoy, c.mantencion) })) // negativo = vencida
    .filter(({ dias }) => dias >= -DIAS_VENCIDA && dias <= DIAS_POR_VENCER)
    .filter(({ c }) => !(seguimiento[c.rut]?.proximo > hoy))
    .sort((a, b) => Number(Boolean(b.c.telefono)) - Number(Boolean(a.c.telefono)) || a.dias - b.dias)
    .map(({ c, dias }) => ({
      rut: c.rut,
      nombre: c.nombre,
      telefono: c.telefono,
      email: c.email,
      patente: c.patentes[0] || "",
      mantencion: c.mantencion,
      dias,
      asesor: c.asesor,
    }));

  return { hoy, siguiente, citas, llamar };
}

// Busca por nombre, RUT o patente.
export function buscar(clientes, texto, max = 20) {
  const q = normal(texto).trim();
  if (q.length < 2) return [];
  const qRut = claveRut(texto);
  const qPatente = q.replace(/[^a-z0-9]/g, "").toUpperCase();
  const salida = [];
  for (const c of clientes) {
    const coincide =
      normal(c.nombre).includes(q) ||
      (qRut.length >= 4 && c.rut.includes(qRut)) ||
      (qPatente.length >= 3 && c.patentes.some((p) => p.includes(qPatente)));
    if (coincide) {
      salida.push({ rut: c.rut, nombre: c.nombre, patentes: c.patentes, telefono: c.telefono });
      if (salida.length >= max) break;
    }
  }
  return salida;
}

// Todo lo que Max sabe de un cliente.
export function ficha({ rut, clientes = [], atenciones = [], solicitudes = [], seguimiento = {} }) {
  const cliente = clientes.find((c) => c.rut === rut);
  if (!cliente) return null;
  return {
    cliente,
    atenciones: atenciones.filter((a) => a.rut === rut).sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "")).slice(0, 40),
    solicitudes: solicitudes.filter((s) => s.rut === rut).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 20),
    seguimiento: seguimiento[rut] || null,
  };
}
