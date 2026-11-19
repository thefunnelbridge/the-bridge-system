// Todo lo que muestra el tablero principal: meta del departamento y terminados.
// No lee la zona privada.
import { json, entrada } from "../../lib/respuestas.mjs";
import { leerAjustes, leerMes, leerTerminados } from "../../lib/datos.mjs";
import { hoyChile, mesDe, resumenMes, diasEntre, feriadosDelMes } from "../../lib/calculos.mjs";

export default async (request) => {
  const { falla } = await entrada(request, ["GET"]);
  if (falla) return falla;

  const hoy = hoyChile();
  const mes = mesDe(hoy);
  const [ajustes, datosMes, terminados] = await Promise.all([leerAjustes(), leerMes(mes), leerTerminados()]);

  return json({
    ok: true,
    hoy,
    resumen: resumenMes({ mes, hoy, meta: datosMes.meta, dias: datosMes.dias, ajustes }),
    terminados: terminados
      .map((t) => ({ ...t, diasEsperando: t.fechaTermino ? Math.max(0, diasEntre(t.fechaTermino, hoy)) : null }))
      .sort((a, b) => (b.diasEsperando ?? -1) - (a.diasEsperando ?? -1)),
    ajustes,
    feriados: feriadosDelMes(mes),
  });
};

export const config = { path: "/api/tablero" };
