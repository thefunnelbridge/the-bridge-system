import { test } from "node:test";
import assert from "node:assert/strict";
import { etapaDe, normalizarOT, diasAbierta, resumenOT, compararOT } from "../lib/ot.mjs";
import { aplicarExclusiones, crearExclusion } from "../lib/cartera.mjs";

// OT inventadas para las pruebas.
const HOY = "2026-11-19";
const FILAS = [
  { ot: "100", fechaEntrada: "2026-09-10", dias: 70, status: "EE APROB FACT", statUsu: "NENV", tipoTaller: "Garantia", notificada: "si", trabajo: "CAMBIO RADIO", modelo: "YARIS", patente: "abcd12", cliente: "Ana Prueba Uno", rut: "11.111.111-1", costoReal: "289077" },
  { ot: "101", fechaEntrada: "2026-10-20", dias: 30, status: "EE APROB FACT", statUsu: "SEST", tipoTaller: "Taller", notificada: "no", trabajo: "MANT 1000", modelo: "HILUX", cliente: "Bruno Prueba Dos", rut: "22222222-2" },
  { ot: "102", fechaEntrada: "2026-11-18", dias: 1, status: "EN PROCESO", tipoTaller: "Taller", notificada: "Sin Notificar", trabajo: "MANT 70000" },
  { ot: "103", fechaEntrada: "2026-11-05", dias: 14, status: "NO LIBERADA", tipoTaller: "Garantia", notificada: "no" },
  { ot: "104", fechaEntrada: "2025-06-26", dias: 511, status: "EE APROB FACT", tipoTaller: "Taller", notificada: "si" },
  { ot: "100", status: "EN PROCESO" }, // repetida: se ignora
  { ot: "", status: "EN PROCESO" },
];
const LISTA = normalizarOT(FILAS);

test("la etapa sale del estado y del tipo de taller", () => {
  assert.equal(etapaDe({ status: "EN PROCESO", tipoTaller: "Garantia" }), "en_taller");
  assert.equal(etapaDe({ status: "NO LIBERADA", tipoTaller: "Garantia" }), "no_liberada");
  assert.equal(etapaDe({ status: "EE APROB FACT", tipoTaller: "Garantia" }), "garantia_por_enviar");
  assert.equal(etapaDe({ status: "EE APROB FACT", tipoTaller: "Taller" }), "terminada_por_facturar");
  assert.equal(etapaDe({ status: "algo nuevo" }), "otra");
});

test("las OT se limpian: sin repetidas ni vacías", () => {
  assert.equal(LISTA.length, 5);
  assert.equal(LISTA[0].patente, "ABCD12");
  assert.equal(LISTA[0].costoReal, 289077);
  assert.equal(LISTA[0].notificada, true);
  assert.equal(LISTA[1].notificada, false);
  assert.equal(LISTA[2].notificada, false);
});

test("los días abiertos se cuentan hasta hoy, no hasta el día del archivo", () => {
  assert.equal(diasAbierta(LISTA[0], HOY), 70);
  assert.equal(diasAbierta(LISTA[0], "2026-11-24"), 75);
  assert.equal(diasAbierta({ fechaEntrada: null, diasArchivo: 12 }, HOY), 12);
});

test("el resumen separa las etapas y cuenta lo atrasado", () => {
  const r = resumenOT(LISTA, HOY);
  assert.equal(r.total, 5);
  assert.equal(r.porEtapa.garantia_por_enviar.cantidad, 1);
  assert.equal(r.porEtapa.terminada_por_facturar.cantidad, 2);
  assert.equal(r.porEtapa.en_taller.cantidad, 1);
  assert.equal(r.porEtapa.no_liberada.cantidad, 1);
  assert.equal(r.terminadasSinCerrar, 3);
  assert.equal(r.masDe60, 2);
  assert.equal(r.masDe180, 1);
  assert.equal(r.sinNotificar, 3);
  assert.equal(r.lista[0].ot, "104"); // la más antigua primero
  assert.equal(r.porEtapa.terminada_por_facturar.mediana, Math.round((30 + 511) / 2));
});

test("compara con el archivo anterior: nuevas, las que salieron y las que siguen", () => {
  const ayer = normalizarOT([{ ot: "100" }, { ot: "101" }, { ot: "99" }]);
  assert.deepEqual(compararOT(ayer, LISTA), { nuevas: ["102", "103", "104"], salieron: ["99"], siguen: 2 });
  assert.deepEqual(compararOT([], LISTA).salieron, []);
});

test("una persona en la lista No contactar tampoco aparece en las OT", () => {
  const porNombre = aplicarExclusiones({ ot: LISTA, excluidos: [crearExclusion("Ana Prueba", "a").entrada] });
  assert.ok(!porNombre.ot.some((o) => o.ot === "100"));
  const porRut = aplicarExclusiones({ ot: LISTA, excluidos: [crearExclusion("22.222.222-2", "b").entrada] });
  assert.ok(!porRut.ot.some((o) => o.ot === "101"));
  assert.equal(porRut.ot.length, 4);
});
