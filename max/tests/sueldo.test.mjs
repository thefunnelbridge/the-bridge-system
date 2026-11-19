import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { limpiarReglas, calcularSueldo, proyectar } from "../lib/sueldo.mjs";

// Valores inventados solo para las pruebas.
const REGLAS = { sueldoBase: 600_000, comisionPct: 2, minimo: 0, soloExcedente: false, bonoMeta: 0, descuentosPct: 0 };

test("sueldo = base + comisión sobre la facturación personal", () => {
  const s = calcularSueldo({ reglas: REGLAS, facturado: 10_000_000 });
  assert.equal(s.comision, 200_000);
  assert.equal(s.bruto, 800_000);
  assert.equal(s.liquido, null);
  assert.equal(s.porMillon, 20_000);
});

test("sin facturación, el sueldo va en la base", () => {
  assert.equal(calcularSueldo({ reglas: REGLAS, facturado: 0 }).bruto, 600_000);
});

test("con mínimo: bajo el mínimo no comisiona y dice cuánto falta", () => {
  const reglas = { ...REGLAS, minimo: 8_000_000 };
  const bajo = calcularSueldo({ reglas, facturado: 5_000_000 });
  assert.equal(bajo.comision, 0);
  assert.equal(bajo.comisiona, false);
  assert.equal(bajo.faltaParaComisionar, 3_000_000);
  const sobre = calcularSueldo({ reglas, facturado: 10_000_000 });
  assert.equal(sobre.comision, 200_000); // sobre todo lo facturado
});

test("solo sobre el excedente: comisiona lo que pasa del mínimo", () => {
  const reglas = { ...REGLAS, minimo: 8_000_000, soloExcedente: true };
  assert.equal(calcularSueldo({ reglas, facturado: 10_000_000 }).comision, 40_000);
  assert.equal(calcularSueldo({ reglas, facturado: 8_000_000 }).comision, 0);
});

test("el bono por meta entra solo si el departamento cumplió", () => {
  const reglas = { ...REGLAS, bonoMeta: 100_000 };
  assert.equal(calcularSueldo({ reglas, facturado: 0, deptoCumplio: false }).bono, 0);
  assert.equal(calcularSueldo({ reglas, facturado: 0, deptoCumplio: true }).bruto, 700_000);
});

test("el líquido aproximado descuenta el porcentaje indicado", () => {
  const s = calcularSueldo({ reglas: { ...REGLAS, descuentosPct: 20 }, facturado: 10_000_000 });
  assert.equal(s.liquido, 640_000);
});

test("porcentajes con decimales", () => {
  assert.equal(calcularSueldo({ reglas: { ...REGLAS, comisionPct: 1.5 }, facturado: 10_000_000 }).comision, 150_000);
});

test("proyección: mantiene el ritmo diario hasta el cierre", () => {
  const p = proyectar({ reglas: REGLAS, facturado: 6_000_000, transcurridos: 12, total: 21 });
  assert.equal(p.facturadoCierre, 10_500_000);
  assert.equal(p.sueldo.bruto, 810_000);
  assert.equal(proyectar({ reglas: REGLAS, facturado: 0, transcurridos: 12, total: 21 }), null);
  assert.equal(proyectar({ reglas: REGLAS, facturado: null, transcurridos: 12, total: 21 }), null);
  assert.equal(proyectar({ reglas: REGLAS, facturado: 5, transcurridos: 0, total: 21 }), null);
});

test("las reglas se validan", () => {
  assert.ok(limpiarReglas(null).error);
  assert.ok(limpiarReglas({ sueldoBase: -1, comisionPct: 2 }).error);
  assert.ok(limpiarReglas({ sueldoBase: 1, comisionPct: 120 }).error);
  assert.ok(limpiarReglas({ sueldoBase: 1, comisionPct: 2, descuentosPct: 90 }).error);
  const { reglas } = limpiarReglas({ sueldoBase: 600_000, comisionPct: 1.5, soloExcedente: true });
  assert.deepEqual(reglas, { sueldoBase: 600_000, comisionPct: 1.5, minimo: 0, soloExcedente: false, bonoMeta: 0, descuentosPct: 0 });
});

// ---------- Mi mes nunca se dice en voz alta ----------

test("la pantalla de Mi mes no puede usar la voz de Max", () => {
  const codigo = readFileSync(new URL("../public/js/mi-mes.js", import.meta.url), "utf8").replace(/\/\/.*$/gm, "");
  assert.equal(/voz\.js|voces\.js|\.decir\(|speechSynthesis/.test(codigo), false);
});

test("la voz y el saludo no reciben nada de Mi mes", () => {
  for (const archivo of ["voz.js", "saludo.js", "tablero.js", "grafico.js"]) {
    const codigo = readFileSync(new URL(`../public/js/${archivo}`, import.meta.url), "utf8").replace(/\/\/.*$/gm, "");
    assert.equal(/mi-mes|sueldo|comisi/i.test(codigo), false, `${archivo} no debe conocer Mi mes`);
  }
});
