import { test } from "node:test";
import assert from "node:assert/strict";
import {
  claveRut, sumarDias, normalizarClientes, normalizarAtenciones, normalizarSolicitudes, tieneCampana,
  proximoHabil, oportunidades, buscar, ficha, crearExclusion, aplicarExclusiones, estaExcluido,
} from "../lib/cartera.mjs";

// Datos inventados para las pruebas.
const HOY = "2026-11-19"; // jueves
const CLIENTES = normalizarClientes([
  { nombre: "Ana Prueba Uno", rut: "11.111.111-1", telefono: "911111111", email: "ANA@ejemplo.cl", patentes: "ABCD12, EFGH34", mantencion: "2026-11-10", ultimaAtencion: "2025-11-10", asesor: "Javier" },
  { nombre: "Bruno Prueba Dos", rut: "22222222-2", telefono: "", email: "", patentes: "JKLM56", mantencion: "2026-12-05" },
  { nombre: "Carla Prueba Tres", rut: "33333333-3", telefono: "933333333", patentes: "NPQR78", mantencion: "2027-03-01" },
  { nombre: "Diego Prueba Cuatro", rut: "44444444-K", telefono: "944444444", patentes: "STUV90", mantencion: "2026-11-25" },
  { nombre: "Elena Prueba Cinco", rut: "55555555-5", telefono: "955555555", patentes: "WXYZ11", mantencion: "2026-07-01" },
  { nombre: "Repetido", rut: "11111111-1" },
  { nombre: "Sin rut", rut: "" },
]);
const SOLICITUDES = normalizarSolicitudes([
  { rut: "33333333-3", servicio: "Mantención", detalle: "20.000 KM", modelo: "RAV4", fecha: HOY, hora: "09:30", campana: "* No se encontraron campañas" },
  { rut: "44444444-K", servicio: "Mantención", detalle: "10.000 KM", modelo: "Raize", fecha: "2026-11-20", hora: "08:15", campana: "* 23SD-144 - Inspección" },
  { rut: "11111111-1", servicio: "Mantención", fecha: "2026-10-01", hora: "10:00" },
  { rut: "99999999-9", servicio: "Mantención", fecha: "no es fecha" },
]);

test("el RUT se compara sin puntos ni guion", () => {
  assert.equal(claveRut("15.578.620-5"), "155786205");
  assert.equal(claveRut("12345678-k"), "12345678K");
});

test("los clientes se limpian: sin repetidos, sin RUT vacío, patentes separadas", () => {
  assert.equal(CLIENTES.length, 5);
  assert.deepEqual(CLIENTES[0].patentes, ["ABCD12", "EFGH34"]);
  assert.equal(CLIENTES[0].email, "ana@ejemplo.cl");
  assert.equal(CLIENTES[3].rut, "44444444K");
});

test("una fecha ilegible queda vacía, no inventada", () => {
  const [c] = normalizarClientes([{ nombre: "X", rut: "1-9", mantencion: "##########", ultimaAtencion: "19-11-2026" }]);
  assert.equal(c.mantencion, null);
  assert.equal(c.ultimaAtencion, null);
});

test("las solicitudes sin fecha válida se descartan y se detecta la campaña real", () => {
  assert.equal(SOLICITUDES.length, 3);
  assert.equal(SOLICITUDES[0].campana, "");
  assert.equal(SOLICITUDES[1].campana, "23SD-144 - Inspección");
  assert.equal(tieneCampana("No posee llamado a campaña pendiente"), false);
  assert.equal(tieneCampana(""), false);
});

test("las atenciones exigen OT y RUT", () => {
  assert.equal(normalizarAtenciones([{ ot: "1", rut: "1-9", fecha: "2026-01-02" }, { ot: "", rut: "1-9" }, { ot: "2", rut: "" }]).length, 1);
});

test("el próximo día hábil salta fin de semana y feriados", () => {
  assert.equal(proximoHabil("2026-11-19"), "2026-11-20");
  assert.equal(proximoHabil("2026-11-20"), "2026-11-23"); // viernes -> lunes
  assert.equal(proximoHabil("2026-12-07"), "2026-12-09"); // el 8 es feriado
  assert.equal(sumarDias("2026-11-30", 1), "2026-12-01");
});

test("citas: las de hoy y las del próximo día hábil, en orden", () => {
  const o = oportunidades({ hoy: HOY, clientes: CLIENTES, solicitudes: SOLICITUDES });
  assert.deepEqual(o.citas.map((c) => [c.nombre, c.esHoy, c.hora]), [["Carla Prueba Tres", true, "09:30"], ["Diego Prueba Cuatro", false, "08:15"]]);
});

test("para llamar: mantención vencida o por vencer, sin hora tomada", () => {
  const o = oportunidades({ hoy: HOY, clientes: CLIENTES, solicitudes: SOLICITUDES });
  // Ana: vencida hace 9 días. Bruno: vence en 16, sin teléfono (va al final).
  // Carla: muy lejos. Diego: ya tiene hora. Elena: vencida hace más de 90 días.
  assert.deepEqual(o.llamar.map((c) => [c.nombre, c.dias]), [["Ana Prueba Uno", -9], ["Bruno Prueba Dos", 16]]);
  assert.equal(o.llamar[0].patente, "ABCD12");
});

test("un cliente contactado o pospuesto no vuelve a aparecer hasta su fecha", () => {
  const seguimiento = { "111111111": { proximo: "2026-12-19" } };
  const o = oportunidades({ hoy: HOY, clientes: CLIENTES, solicitudes: SOLICITUDES, seguimiento });
  assert.deepEqual(o.llamar.map((c) => c.nombre), ["Bruno Prueba Dos"]);
  const despues = oportunidades({ hoy: "2026-12-19", clientes: CLIENTES, solicitudes: [], seguimiento });
  assert.ok(despues.llamar.some((c) => c.nombre === "Ana Prueba Uno"));
});

test("buscar por nombre (sin tildes), RUT o patente", () => {
  assert.deepEqual(buscar(CLIENTES, "carla").map((c) => c.nombre), ["Carla Prueba Tres"]);
  assert.deepEqual(buscar(CLIENTES, "44.444.444").map((c) => c.nombre), ["Diego Prueba Cuatro"]);
  assert.deepEqual(buscar(CLIENTES, "efgh34").map((c) => c.nombre), ["Ana Prueba Uno"]);
  assert.deepEqual(buscar(CLIENTES, "a"), []);
  assert.equal(buscar(CLIENTES, "prueba", 2).length, 2);
});

test("la ficha junta al cliente con su historial", () => {
  const atenciones = normalizarAtenciones([{ ot: "10", rut: "11111111-1", fecha: "2026-01-05", tipo: "FIR" }, { ot: "11", rut: "11111111-1", fecha: "2026-06-05" }, { ot: "12", rut: "22222222-2" }]);
  const f = ficha({ rut: "111111111", clientes: CLIENTES, atenciones, solicitudes: SOLICITUDES });
  assert.equal(f.cliente.nombre, "Ana Prueba Uno");
  assert.deepEqual(f.atenciones.map((a) => a.ot), ["11", "10"]);
  assert.equal(f.solicitudes.length, 1);
  assert.equal(ficha({ rut: "000", clientes: CLIENTES }), null);
});

// ---------- Lista "No contactar" ----------

test("se puede excluir por RUT o por nombre y apellido", () => {
  assert.equal(crearExclusion("11.111.111-1", "a").entrada.rut, "111111111");
  assert.equal(crearExclusion("Ána  Pruebá", "b").entrada.nombre, "ana prueba");
  assert.ok(crearExclusion("Ana", "c").error);
  assert.ok(crearExclusion("", "d").error);
});

test("una persona excluida desaparece de clientes, atenciones y solicitudes", () => {
  const atenciones = normalizarAtenciones([{ ot: "1", rut: "11111111-1" }, { ot: "2", rut: "22222222-2" }]);
  const excluidos = [crearExclusion("Prueba Uno Ana", "x").entrada]; // el orden de las palabras no importa
  const limpio = aplicarExclusiones({ clientes: CLIENTES, atenciones, solicitudes: SOLICITUDES, excluidos });
  assert.equal(limpio.quitados, 1);
  assert.ok(!limpio.clientes.some((c) => c.nombre === "Ana Prueba Uno"));
  assert.deepEqual(limpio.atenciones.map((a) => a.ot), ["2"]);
  assert.ok(!limpio.solicitudes.some((s) => s.rut === "111111111"));
  // Queda anotado su RUT, para sacar también lo que llegue después solo con RUT.
  assert.deepEqual(limpio.excluidos[0].ruts, ["111111111"]);
  const despues = aplicarExclusiones({ clientes: [], atenciones, solicitudes: [], excluidos: limpio.excluidos });
  assert.deepEqual(despues.atenciones.map((a) => a.ot), ["2"]);
});

test("excluir por RUT no toca a nadie más, y un nombre parecido no se confunde", () => {
  const limpio = aplicarExclusiones({ clientes: CLIENTES, excluidos: [crearExclusion("44444444-K", "x").entrada] });
  assert.equal(limpio.clientes.length, CLIENTES.length - 1);
  assert.equal(estaExcluido({ rut: "9", nombre: "Ana Pruebas Unos" }, [crearExclusion("Ana Prueba", "y").entrada]), false);
  assert.equal(estaExcluido({ rut: "9", nombre: "PRUEBA UNO, ANA" }, [crearExclusion("Ana Prueba", "y").entrada]), true);
});

test("sin lista, no se quita a nadie", () => {
  const limpio = aplicarExclusiones({ clientes: CLIENTES, solicitudes: SOLICITUDES, excluidos: [] });
  assert.equal(limpio.clientes.length, CLIENTES.length);
  assert.equal(limpio.quitados, 0);
});
