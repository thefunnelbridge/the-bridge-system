// Órdenes de trabajo (OT) abiertas de Javier, desde el Excel diario de Control
// y Gestión. Todo puro, para probarlo.
//
// Etapas que usa Max:
//   garantia_por_enviar     trabajo hecho, garantía sin enviar (EE APROB FACT + Garantía)
//   terminada_por_facturar  trabajo hecho, falta aprobar y facturar (EE APROB FACT + Taller)
//   no_liberada             la OT no está liberada
//   en_taller               trabajo en curso (EN PROCESO)
import { esFechaISO, diasEntre, textoLimpio } from "./calculos.mjs";
import { claveRut } from "./cartera.mjs";

export const LIMITE_OT = 3000;
export const ETAPAS = ["garantia_por_enviar", "terminada_por_facturar", "no_liberada", "en_taller", "otra"];

const normal = (t) => String(t ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const entero = (v) => {
  const n = Math.round(Number(String(v ?? "").replace(/[^\d.-]/g, "")));
  return Number.isFinite(n) ? n : 0;
};

export function etapaDe({ status, tipoTaller }) {
  const s = normal(status);
  if (s.includes("en proceso")) return "en_taller";
  if (s.includes("no liberada")) return "no_liberada";
  if (s.includes("aprob fact")) return normal(tipoTaller).includes("garant") ? "garantia_por_enviar" : "terminada_por_facturar";
  return "otra";
}

export function normalizarOT(filas) {
  const vistas = new Set();
  const salida = [];
  for (const f of filas || []) {
    const ot = textoLimpio(f?.ot, 20);
    if (!ot || vistas.has(ot)) continue;
    vistas.add(ot);
    const sinNotificar = /sin notificar|^no$/.test(normal(f.notificada));
    salida.push({
      ot,
      fechaEntrada: esFechaISO(f.fechaEntrada) ? f.fechaEntrada : null,
      diasArchivo: Math.max(0, entero(f.dias)),
      etapa: etapaDe(f),
      status: textoLimpio(f.status, 30),
      statUsu: textoLimpio(f.statUsu, 12),
      clase: textoLimpio(f.clase, 12),
      tipoTaller: textoLimpio(f.tipoTaller, 20),
      tipoCliente: textoLimpio(f.tipoCliente, 20),
      notificada: !sinNotificar,
      trabajo: textoLimpio(f.trabajo, 80),
      marca: textoLimpio(f.marca, 30),
      modelo: textoLimpio(f.modelo, 40),
      patente: textoLimpio(f.patente, 10).toUpperCase(),
      vin: textoLimpio(f.vin, 20),
      km: Math.max(0, entero(f.km)),
      cliente: textoLimpio(f.cliente, 80),
      rut: claveRut(f.rut),
      costoReal: entero(f.costoReal),
      ingresoReal: entero(f.ingresoReal),
      totalPlan: entero(f.totalPlan),
      modificadoPor: textoLimpio(f.modificadoPor, 20),
    });
  }
  return salida;
}

// Días que lleva abierta hoy (no el día en que se generó el archivo).
export function diasAbierta(ot, hoy) {
  return ot.fechaEntrada ? Math.max(0, diasEntre(ot.fechaEntrada, hoy)) : ot.diasArchivo;
}

function mediana(numeros) {
  if (!numeros.length) return null;
  const o = [...numeros].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : Math.round((o[m - 1] + o[m]) / 2);
}

export function resumenOT(lista, hoy) {
  const conDias = lista.map((ot) => ({ ...ot, dias: diasAbierta(ot, hoy) }));
  const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e, { cantidad: 0, mediana: null }]));
  for (const etapa of ETAPAS) {
    const grupo = conDias.filter((ot) => ot.etapa === etapa);
    porEtapa[etapa] = { cantidad: grupo.length, mediana: mediana(grupo.map((ot) => ot.dias)) };
  }
  return {
    total: conDias.length,
    porEtapa,
    terminadasSinCerrar: porEtapa.garantia_por_enviar.cantidad + porEtapa.terminada_por_facturar.cantidad,
    masDe60: conDias.filter((ot) => ot.dias > 60).length,
    masDe180: conDias.filter((ot) => ot.dias > 180).length,
    sinNotificar: conDias.filter((ot) => !ot.notificada).length,
    lista: conDias.sort((a, b) => b.dias - a.dias),
  };
}

// Qué cambió respecto del archivo anterior.
export function compararOT(anterior = [], actual = []) {
  const antes = new Set(anterior.map((ot) => ot.ot));
  const ahora = new Set(actual.map((ot) => ot.ot));
  return {
    nuevas: actual.filter((ot) => !antes.has(ot.ot)).map((ot) => ot.ot),
    salieron: anterior.filter((ot) => !ahora.has(ot.ot)).map((ot) => ot.ot),
    siguen: actual.filter((ot) => antes.has(ot.ot)).length,
  };
}
