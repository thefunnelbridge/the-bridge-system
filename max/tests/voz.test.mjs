import { test } from "node:test";
import assert from "node:assert/strict";
import { vocesDeHombre, elegirVoz, etiqueta, prioridad, partirEnFrases } from "../public/js/voces.js";
import { momento, saludoCorto, textoSaludo } from "../public/js/saludo.js";

const v = (name, lang) => ({ name, lang, voiceURI: name });

const EDGE = [
  v("Microsoft Sabina - Spanish (Mexico)", "es-MX"),
  v("Microsoft Raul - Spanish (Mexico)", "es-MX"),
  v("Microsoft Catalina Online (Natural) - Spanish (Chile)", "es-CL"),
  v("Microsoft Lorenzo Online (Natural) - Spanish (Chile)", "es-CL"),
  v("Microsoft Jorge Online (Natural) - Spanish (Mexico)", "es-MX"),
  v("Microsoft Dalia Online (Natural) - Spanish (Mexico)", "es-MX"),
  v("Microsoft Tomas Online (Natural) - Spanish (Argentina)", "es-AR"),
  v("Microsoft Guy Online (Natural) - English (United States)", "en-US"),
];

const CHROME = [
  v("Google español", "es-ES"),
  v("Google español de Estados Unidos", "es-US"),
  v("Microsoft Helena - Spanish (Spain)", "es-ES"),
  v("Microsoft Pablo - Spanish (Spain)", "es-ES"),
  v("Microsoft David - English (United States)", "en-US"),
];

test("en Edge, Max parte por Lorenzo", () => {
  assert.equal(elegirVoz(EDGE).name, "Microsoft Lorenzo Online (Natural) - Spanish (Chile)");
});

test("el orden es Lorenzo, Jorge, Tomás y después Raúl", () => {
  assert.deepEqual(vocesDeHombre(EDGE).map((x) => etiqueta(x)), [
    "Lorenzo (Chile)", "Jorge (México)", "Tomás (Argentina)", "Raúl (México)",
  ]);
});

test("nunca elige una voz de mujer ni una en otro idioma", () => {
  const nombres = vocesDeHombre([...EDGE, ...CHROME]).map((x) => x.name).join(" | ");
  for (const no of ["Sabina", "Catalina", "Dalia", "Helena", "Google", "Guy", "David"]) {
    assert.ok(!nombres.includes(no), `no debería incluir ${no}`);
  }
});

test("en Chrome con Windows usa a Pablo", () => {
  assert.equal(elegirVoz(CHROME).name, "Microsoft Pablo - Spanish (Spain)");
});

test("si solo hay voces de mujer, no elige ninguna", () => {
  assert.equal(elegirVoz([v("Google español", "es-ES"), v("Microsoft Sabina - Spanish (Mexico)", "es-MX")]), null);
  assert.equal(elegirVoz([]), null);
  assert.equal(elegirVoz(undefined), null);
});

test("respeta la voz que eligió Javier si sigue disponible", () => {
  assert.equal(elegirVoz(EDGE, "Microsoft Jorge Online (Natural) - Spanish (Mexico)").name, "Microsoft Jorge Online (Natural) - Spanish (Mexico)");
  assert.equal(elegirVoz(EDGE, "una-que-ya-no-existe").name, "Microsoft Lorenzo Online (Natural) - Spanish (Chile)");
  // Una voz de mujer guardada por error no se usa.
  assert.equal(elegirVoz(EDGE, "Microsoft Sabina - Spanish (Mexico)").name, "Microsoft Lorenzo Online (Natural) - Spanish (Chile)");
});

test("un nombre parecido no se confunde", () => {
  assert.equal(prioridad(v("Microsoft Juana - Spanish (Mexico)", "es-MX")), -1);
  assert.equal(prioridad(v("Microsoft Pablo - English", "en-US")), -1);
  assert.notEqual(prioridad(v("Juan", "es_MX")), -1);
});

test("parte el texto en frases", () => {
  assert.deepEqual(partirEnFrases("Hola Javier, buenos días. ¿Cómo estás? Partimos."), [
    "Hola Javier, buenos días.", "¿Cómo estás?", "Partimos.",
  ]);
  assert.deepEqual(partirEnFrases(""), []);
});

test("el saludo cambia según la hora", () => {
  assert.equal(momento(5), "dia");
  assert.equal(momento(11), "dia");
  assert.equal(momento(12), "tarde");
  assert.equal(momento(19), "tarde");
  assert.equal(momento(20), "noche");
  assert.equal(momento(3), "noche");
  assert.equal(saludoCorto(9), "Buenos días, Javier");
  assert.equal(saludoCorto(15), "Buenas tardes, Javier");
  assert.equal(saludoCorto(22), "Buenas noches, Javier");
});

test("con datos, el saludo de la mañana es el pedido", () => {
  assert.equal(
    textoSaludo(8, { hayDatos: true }),
    "Hola Javier, buenos días. ¿Cómo estás? Aquí está tu reporte de hoy. Toma tu café y partimos.",
  );
});

test("sin datos, Max lo dice en vez de prometer un reporte", () => {
  const texto = textoSaludo(8, { hayDatos: false });
  assert.match(texto, /Todavía no me cargan los datos de hoy/);
  assert.doesNotMatch(texto, /reporte/);
});

test("el café es solo en la mañana", () => {
  assert.match(textoSaludo(9), /café/);
  assert.doesNotMatch(textoSaludo(16), /café/);
  assert.doesNotMatch(textoSaludo(22), /café/);
  assert.match(textoSaludo(16), /buenas tardes/);
  assert.match(textoSaludo(22), /buenas noches/);
});

test("la alerta diaria de terminados va en el saludo, sin montos", () => {
  assert.match(textoSaludo(9, { hayDatos: true, terminados: 3 }), /Ojo: tienes 3 trabajos terminados sin facturar\./);
  assert.match(textoSaludo(9, { hayDatos: true, terminados: 1 }), /tienes un trabajo terminado sin facturar\./);
  assert.doesNotMatch(textoSaludo(9, { hayDatos: true, terminados: 0 }), /Ojo/);
  assert.doesNotMatch(textoSaludo(9, { hayDatos: true, terminados: 3 }), /\$/);
});

test("el saludo cuenta citas y clientes para llamar, sin nombres", () => {
  assert.match(textoSaludo(9, { hayDatos: true, citas: 2, llamar: 12 }), /Hoy tienes 2 citas y 12 clientes para llamar\./);
  assert.match(textoSaludo(9, { citas: 1 }), /Hoy tienes una cita\./);
  assert.match(textoSaludo(9, { llamar: 1 }), /Hoy tienes un cliente para llamar\./);
  assert.doesNotMatch(textoSaludo(9, {}), /Hoy tienes/);
});
