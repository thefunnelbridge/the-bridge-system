// Terminados sin facturar: agregar, importar desde Excel y marcar como facturado.
// Siguiendo la regla del tablero, aquí no se guardan montos.
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { leerTerminados, guardarTerminados } from "../../lib/datos.mjs";
import { registrarActividad } from "../../lib/almacen.mjs";
import { hoyChile, esFechaISO, textoLimpio } from "../../lib/calculos.mjs";

const MAX_TERMINADOS = 300;

function limpiar(fila, hoy) {
  const ot = textoLimpio(fila?.ot, 30);
  if (!ot) return { error: "Falta el número de OT." };
  let fechaTermino = fila.fechaTermino || hoy;
  if (!esFechaISO(fechaTermino)) return { error: `La OT ${ot} tiene una fecha de término que no entiendo.` };
  if (fechaTermino > hoy) fechaTermino = hoy;
  return {
    dato: {
      ot,
      cliente: textoLimpio(fila.cliente, 80),
      patente: textoLimpio(fila.patente, 12).toUpperCase(),
      modelo: textoLimpio(fila.modelo, 60),
      fechaTermino,
    },
  };
}

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["POST"]);
  if (falla) return falla;
  const hoy = hoyChile();
  const lista = await leerTerminados();

  if (cuerpo.accion === "facturado") {
    const cual = lista.find((t) => t.id === cuerpo.id);
    if (!cual) return error("Ese trabajo ya no está en la lista.", 409);
    await guardarTerminados(lista.filter((t) => t.id !== cuerpo.id));
    await registrarActividad(`La OT ${cual.ot} quedó facturada.`, "terminado");
    return json({ ok: true });
  }

  if (cuerpo.accion === "agregar" || cuerpo.accion === "importar") {
    const filas = cuerpo.accion === "agregar" ? [cuerpo.fila] : cuerpo.filas;
    if (!Array.isArray(filas) || !filas.length) return error("No hay trabajos para guardar.", 400);
    let nuevos = 0;
    for (const fila of filas) {
      const { dato, error: problema } = limpiar(fila, hoy);
      if (problema) return error(problema, 400);
      const existente = lista.find((t) => t.ot === dato.ot);
      if (existente) Object.assign(existente, dato);
      else {
        lista.push({ id: crypto.randomUUID(), ...dato, creado: new Date().toISOString() });
        nuevos += 1;
      }
    }
    if (lista.length > MAX_TERMINADOS) return error(`La lista no puede pasar de ${MAX_TERMINADOS} trabajos.`, 400);
    await guardarTerminados(lista);
    const texto = filas.length === 1
      ? `Se anotó la OT ${textoLimpio(filas[0].ot, 30)} como terminada sin facturar.`
      : `Se actualizaron los terminados sin facturar desde un Excel (${nuevos} nuevos).`;
    await registrarActividad(texto, "terminado");
    return json({ ok: true, nuevos });
  }

  return error("Acción no válida.", 400);
};

export const config = { path: "/api/terminados" };
