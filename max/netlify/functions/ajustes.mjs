// Ajustes del tablero: meta del mes, sábados y días sin trabajo.
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { leerAjustes, guardarAjustes, leerMes, guardarMes } from "../../lib/datos.mjs";
import { registrarActividad } from "../../lib/almacen.mjs";
import { hoyChile, mesDe, esFechaISO, montoValido } from "../../lib/calculos.mjs";

const SABADOS = ["no", "medio", "completo"];

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["POST"]);
  if (falla) return falla;

  const mes = mesDe(hoyChile());
  const cambios = [];

  if (cuerpo.meta !== undefined) {
    if (cuerpo.meta !== null && !(montoValido(cuerpo.meta) && cuerpo.meta > 0)) {
      return error("La meta tiene que ser un monto mayor que cero.", 400);
    }
    const datos = await leerMes(mes);
    if (datos.meta !== cuerpo.meta) {
      await guardarMes(mes, { ...datos, meta: cuerpo.meta });
      cambios.push("la meta del mes");
    }
  }

  if (cuerpo.sabado !== undefined || cuerpo.noHabiles !== undefined) {
    const ajustes = await leerAjustes();
    if (cuerpo.sabado !== undefined) {
      if (!SABADOS.includes(cuerpo.sabado)) return error("Opción de sábado no válida.", 400);
      if (ajustes.sabado !== cuerpo.sabado) cambios.push("los sábados");
      ajustes.sabado = cuerpo.sabado;
    }
    if (cuerpo.noHabiles !== undefined) {
      if (!Array.isArray(cuerpo.noHabiles) || cuerpo.noHabiles.length > 60 || !cuerpo.noHabiles.every(esFechaISO)) {
        return error("Hay un día sin trabajo que no entiendo.", 400);
      }
      const lista = [...new Set(cuerpo.noHabiles)].sort();
      if (JSON.stringify(lista) !== JSON.stringify(ajustes.noHabiles || [])) cambios.push("los días sin trabajo");
      ajustes.noHabiles = lista;
    }
    await guardarAjustes(ajustes);
  }

  if (cambios.length) await registrarActividad(`Se cambió ${cambios.join(", ")}.`, "ajuste");
  return json({ ok: true });
};

export const config = { path: "/api/ajustes" };
