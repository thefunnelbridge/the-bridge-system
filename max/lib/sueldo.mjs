// Cálculo del sueldo de Javier para "Mi mes". Todo puro, para poder probarlo.
// Las reglas las define Javier en su zona privada; aquí no hay valores reales.
//
// reglas = {
//   sueldoBase:        monto fijo del mes
//   otrosHaberes:      otros haberes fijos del mes (gratificación, colación, movilización...)
//   comisionPct:       porcentaje de comisión sobre su facturación personal
//   minimo:            facturación desde la que empieza a comisionar (0 = siempre)
//   soloExcedente:     true = el porcentaje se aplica solo a lo que pasa del mínimo
//   bonoMeta:          bono fijo si el departamento cumple la meta (0 = no hay)
//   descuentosPct:     descuentos legales aproximados, en % del bruto (AFP, salud, impuesto)
//   descuentosFijos:   otros descuentos fijos en pesos (créditos, sindicato, seguros)
//                      Con los dos en 0 no se estima el líquido.
// }
import { montoValido } from "./calculos.mjs";

const entre = (n, min, max) => typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;

// Revisa y ordena las reglas que llegan del formulario.
export function limpiarReglas(r) {
  if (!r || typeof r !== "object") return { error: "Faltan las reglas." };
  if (!montoValido(r.sueldoBase)) return { error: "El sueldo base no es válido." };
  if (!entre(r.comisionPct, 0, 100)) return { error: "El porcentaje de comisión tiene que estar entre 0 y 100." };
  const minimo = r.minimo ?? 0;
  const bonoMeta = r.bonoMeta ?? 0;
  const descuentosPct = r.descuentosPct ?? 0;
  const otrosHaberes = r.otrosHaberes ?? 0;
  const descuentosFijos = r.descuentosFijos ?? 0;
  if (!montoValido(minimo)) return { error: "El mínimo para comisionar no es válido." };
  if (!montoValido(bonoMeta)) return { error: "El bono por meta no es válido." };
  if (!montoValido(otrosHaberes)) return { error: "Los otros haberes no son válidos." };
  if (!montoValido(descuentosFijos)) return { error: "Los otros descuentos no son válidos." };
  if (!entre(descuentosPct, 0, 60)) return { error: "Los descuentos tienen que estar entre 0 y 60 por ciento." };
  return {
    reglas: {
      sueldoBase: r.sueldoBase,
      otrosHaberes,
      comisionPct: r.comisionPct,
      minimo,
      soloExcedente: Boolean(r.soloExcedente) && minimo > 0,
      bonoMeta,
      descuentosPct,
      descuentosFijos,
    },
  };
}

export function calcularSueldo({ reglas, facturado = 0, deptoCumplio = false }) {
  const comisiona = facturado >= reglas.minimo;
  const baseComision = !comisiona ? 0 : reglas.soloExcedente ? facturado - reglas.minimo : facturado;
  const comision = Math.round((baseComision * reglas.comisionPct) / 100);
  const bono = deptoCumplio ? reglas.bonoMeta : 0;
  const otros = reglas.otrosHaberes || 0;
  const fijos = reglas.descuentosFijos || 0;
  const bruto = reglas.sueldoBase + otros + comision + bono;
  const estimaLiquido = reglas.descuentosPct > 0 || fijos > 0;
  return {
    base: reglas.sueldoBase,
    otrosHaberes: otros,
    comision,
    bono,
    bruto,
    liquido: estimaLiquido ? Math.max(0, Math.round(bruto * (1 - reglas.descuentosPct / 100)) - fijos) : null,
    comisiona,
    faltaParaComisionar: comisiona ? 0 : reglas.minimo - facturado,
    // Cuánto suma a su sueldo cada millón extra que facture (ya comisionando).
    porMillon: Math.round((1_000_000 * reglas.comisionPct) / 100),
  };
}

// Proyección al cierre si mantiene el ritmo diario que lleva. Es una estimación, no un dato.
export function proyectar({ reglas, facturado, transcurridos, total, deptoCumplio = false }) {
  if (!(facturado > 0) || !(transcurridos > 0) || !(total > 0)) return null;
  const facturadoCierre = Math.round((facturado / transcurridos) * total);
  return { facturadoCierre, sueldo: calcularSueldo({ reglas, facturado: facturadoCierre, deptoCumplio }) };
}
