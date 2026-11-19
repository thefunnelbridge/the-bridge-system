import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  hoyChile, esFechaISO, pesoDia, diasDelMes, resumenMes, aplicarDia, diasEntre, diaAnterior, feriadosDelMes, montoValido,
} from "../lib/calculos.mjs";

const NOV = "2026-11";

test("hoyChile usa la hora de Chile, no la del servidor", () => {
  // 02:30 UTC del día 20 todavía es día 19 en Chile (UTC-3 en noviembre).
  assert.equal(hoyChile(new Date("2026-11-20T02:30:00Z")), "2026-11-19");
  assert.equal(hoyChile(new Date("2026-11-20T03:30:00Z")), "2026-11-20");
});

test("reconoce fechas válidas", () => {
  assert.equal(esFechaISO("2026-11-19"), true);
  assert.equal(esFechaISO("2026-02-30"), false);
  assert.equal(esFechaISO("19-11-2026"), false);
  assert.equal(esFechaISO(null), false);
});

test("días hábiles: lunes a viernes, sin feriados", () => {
  assert.equal(pesoDia("2026-11-19"), 1);          // jueves
  assert.equal(pesoDia("2026-11-21"), 0);          // sábado
  assert.equal(pesoDia("2026-11-22"), 0);          // domingo
  assert.equal(pesoDia("2026-12-08"), 0);          // Inmaculada Concepción, martes
  assert.equal(pesoDia("2026-09-18"), 0);          // Fiestas Patrias, viernes
});

test("los sábados se pueden contar como medio día o día completo", () => {
  assert.equal(pesoDia("2026-11-21", { sabado: "medio" }), 0.5);
  assert.equal(pesoDia("2026-11-21", { sabado: "completo" }), 1);
  assert.equal(pesoDia("2026-10-31", { sabado: "completo" }), 0); // sábado feriado
});

test("un día marcado sin trabajo no cuenta", () => {
  assert.equal(pesoDia("2026-11-19", { sabado: "no", noHabiles: ["2026-11-19"] }), 0);
});

test("noviembre de 2026 tiene 21 días hábiles", () => {
  assert.equal(diasDelMes(NOV).length, 30);
  assert.equal(resumenMes({ mes: NOV, hoy: "2026-11-01" }).habilesTotal, 21);
  assert.deepEqual(feriadosDelMes(NOV), [{ fecha: "2026-11-01", nombre: "Todos los Santos" }]);
});

test("sin datos, todo queda en null: Max no inventa", () => {
  const r = resumenMes({ mes: NOV, hoy: "2026-11-19" });
  assert.equal(r.meta, null);
  assert.equal(r.facturado, null);
  assert.equal(r.falta, null);
  assert.equal(r.pct, null);
  assert.equal(r.porDia, null);
  assert.equal(r.ritmo, null);
});

test("avance contra la meta, con el día de hoy todavía sin cargar", () => {
  // Hasta el miércoles 18 van 13 días hábiles; quedan 8 contando hoy (jueves 19).
  const dias = { "2026-11-02": 10_000_000, "2026-11-03": 12_000_000, "2026-11-18": 8_000_000 };
  const r = resumenMes({ mes: NOV, hoy: "2026-11-19", meta: 63_000_000, dias });
  assert.equal(r.facturado, 30_000_000);
  assert.equal(r.falta, 33_000_000);
  assert.equal(r.pct, 47.6);
  assert.equal(r.habilesRestantes, 8);
  assert.equal(r.habilesTranscurridos, 13);
  assert.equal(r.porDia, 4_125_000);
  assert.equal(r.promedioNecesario, 3_000_000);
  assert.deepEqual(r.ritmo, { esperado: 39_000_000, diferencia: -9_000_000 });
  assert.equal(r.ultimoDia, "2026-11-18");
});

test("cuando se carga el día de hoy, deja de contarse entre los que quedan", () => {
  const dias = { "2026-11-19": 5_000_000 };
  const r = resumenMes({ mes: NOV, hoy: "2026-11-19", meta: 21_000_000, dias });
  assert.equal(r.habilesRestantes, 7);
  assert.equal(r.porDia, Math.ceil(16_000_000 / 7));
});

test("meta cumplida: no falta nada ni pide monto diario", () => {
  const r = resumenMes({ mes: NOV, hoy: "2026-11-19", meta: 10_000_000, dias: { "2026-11-02": 12_000_000 } });
  assert.equal(r.cumplida, true);
  assert.equal(r.falta, 0);
  assert.equal(r.porDia, null);
  assert.equal(r.pct, 120);
});

test("último día del mes ya cargado y sin llegar: lo avisa", () => {
  const r = resumenMes({ mes: NOV, hoy: "2026-11-30", meta: 10_000_000, dias: { "2026-11-30": 1_000_000 } });
  assert.equal(r.habilesRestantes, 0);
  assert.equal(r.porDia, null);
  assert.equal(r.sinDiasParaLlegar, true);
});

test("el porDia se redondea hacia arriba para no quedar corto", () => {
  const r = resumenMes({ mes: NOV, hoy: "2026-11-27", meta: 10, dias: { "2026-11-26": 0 } });
  assert.equal(r.habilesRestantes, 2); // viernes 27 y lunes 30
  assert.equal(r.porDia, 5);
  const r2 = resumenMes({ mes: NOV, hoy: "2026-11-27", meta: 11, dias: { "2026-11-26": 0 } });
  assert.equal(r2.porDia, 6);
});

test("cargar lo del día reemplaza ese día", () => {
  assert.deepEqual(aplicarDia({ "2026-11-02": 5 }, "2026-11-02", 9).dias, { "2026-11-02": 9 });
});

test("cargar el acumulado calcula lo del día", () => {
  const dias = { "2026-11-02": 10, "2026-11-03": 15 };
  assert.deepEqual(aplicarDia(dias, "2026-11-04", 40, "acumulado").dias, { ...dias, "2026-11-04": 15 });
  // Corregir el mismo día no cuenta dos veces.
  assert.deepEqual(aplicarDia({ ...dias, "2026-11-04": 15 }, "2026-11-04", 45, "acumulado").dias, { ...dias, "2026-11-04": 20 });
  assert.ok(aplicarDia(dias, "2026-11-04", 20, "acumulado").error);
});

test("fechas auxiliares", () => {
  assert.equal(diasEntre("2026-11-16", "2026-11-19"), 3);
  assert.equal(diasEntre("2026-10-30", "2026-11-02"), 3);
  assert.equal(diaAnterior("2026-11-01"), "2026-10-31");
});

test("montos válidos", () => {
  assert.equal(montoValido(0), true);
  assert.equal(montoValido(1_500_000), true);
  assert.equal(montoValido(-1), false);
  assert.equal(montoValido(1.5), false);
  assert.equal(montoValido("100"), false);
});

// ---------- Privacidad de "Mi mes" ----------

test("solo la carga de datos y Mi mes pueden tocar la zona privada", () => {
  const PERMITIDAS = new Set(["cargar.mjs", "mi-mes.mjs"]);
  const carpeta = new URL("../netlify/functions/", import.meta.url);
  for (const archivo of readdirSync(carpeta)) {
    const codigo = readFileSync(new URL(archivo, carpeta), "utf8");
    const toca = /privado/.test(codigo.replace(/\/\/.*$/gm, ""));
    if (!PERMITIDAS.has(archivo)) assert.equal(toca, false, `${archivo} no debe tocar la zona privada`);
  }
  for (const archivo of ["almacen.mjs", "datos.mjs", "calculos.mjs", "respuestas.mjs"]) {
    const codigo = readFileSync(new URL(`../lib/${archivo}`, import.meta.url), "utf8").replace(/\/\/.*$/gm, "");
    assert.equal(/max-privado|privado\.mjs/.test(codigo), false, `${archivo} no debe abrir el almacén privado`);
  }
});

test("el resumen del tablero no trae ningún campo personal", () => {
  const r = resumenMes({ mes: NOV, hoy: "2026-11-19", meta: 1000, dias: { "2026-11-02": 10 } });
  assert.equal(/personal|sueldo|comisi/i.test(JSON.stringify(r)), false);
});
