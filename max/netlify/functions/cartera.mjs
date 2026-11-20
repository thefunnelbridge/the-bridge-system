// Cartera de clientes y oportunidades del día.
//   GET  /api/cartera?vista=oportunidades   citas de hoy y a quién llamar
//   GET  /api/cartera?buscar=texto          busca por nombre, RUT o patente
//   GET  /api/cartera?rut=...               ficha de un cliente con su historial
//   POST { accion: "importar", tipo, filas } reemplaza clientes, atenciones o solicitudes
//   POST { accion: "seguimiento", rut, ... } marca contactado o pospone
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { tienda, leerJSON, registrarActividad } from "../../lib/almacen.mjs";
import { leerAjustes } from "../../lib/datos.mjs";
import { hoyChile, textoLimpio } from "../../lib/calculos.mjs";
import {
  LIMITES, claveRut, sumarDias, normalizarClientes, normalizarAtenciones, normalizarSolicitudes,
  oportunidades, buscar, ficha,
} from "../../lib/cartera.mjs";

const NORMALIZAR = { clientes: normalizarClientes, atenciones: normalizarAtenciones, solicitudes: normalizarSolicitudes };
const NOMBRE = {
  clientes: ["cliente", "clientes"],
  atenciones: ["atención", "atenciones"],
  solicitudes: ["solicitud de Toyota", "solicitudes de Toyota"],
};
const DIAS = { contactado: 30, posponer: 7 };

const cartera = () => tienda("cartera");
const leer = (clave, porDefecto) => leerJSON(cartera(), clave, porDefecto);

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["GET", "POST"]);
  if (falla) return falla;
  const hoy = hoyChile();

  if (request.method === "GET") {
    const url = new URL(request.url);
    const clientes = await leer("clientes", []);

    if (url.searchParams.get("vista") === "oportunidades") {
      const [solicitudes, seguimiento, ajustes] = await Promise.all([leer("solicitudes", []), leer("seguimiento", {}), leerAjustes()]);
      return json({ ok: true, hayCartera: clientes.length > 0, total: clientes.length, ...oportunidades({ hoy, clientes, solicitudes, seguimiento, ajustes }) });
    }
    if (url.searchParams.has("buscar")) {
      return json({ ok: true, resultados: buscar(clientes, url.searchParams.get("buscar")) });
    }
    if (url.searchParams.has("rut")) {
      const [atenciones, solicitudes, seguimiento] = await Promise.all([leer("atenciones", []), leer("solicitudes", []), leer("seguimiento", {})]);
      const datos = ficha({ rut: claveRut(url.searchParams.get("rut")), clientes, atenciones, solicitudes, seguimiento });
      return datos ? json({ ok: true, hoy, ...datos }) : error("No encontré a ese cliente.", 409);
    }
    return error("Consulta no válida.", 400);
  }

  if (cuerpo.accion === "importar") {
    const tipo = cuerpo.tipo;
    if (!NORMALIZAR[tipo]) return error("Tipo de archivo no válido.", 400);
    if (!Array.isArray(cuerpo.filas) || !cuerpo.filas.length) return error("El archivo no trae filas.", 400);
    if (cuerpo.filas.length > LIMITES[tipo]) return error(`Son demasiadas filas (máximo ${LIMITES[tipo]}).`, 400);
    const datos = NORMALIZAR[tipo](cuerpo.filas);
    if (!datos.length) return error("No pude leer ninguna fila de ese archivo.", 400);
    await cartera().setJSON(tipo, datos);
    const uno = datos.length === 1;
    await registrarActividad(`Se ${uno ? "cargó" : "cargaron"} ${datos.length} ${NOMBRE[tipo][uno ? 0 : 1]}.`, "carga");
    return json({ ok: true, guardadas: datos.length });
  }

  if (cuerpo.accion === "seguimiento") {
    const rut = claveRut(cuerpo.rut);
    if (!rut || !DIAS[cuerpo.estado]) return error("Seguimiento no válido.", 400);
    const seguimiento = await leer("seguimiento", {});
    seguimiento[rut] = {
      estado: cuerpo.estado,
      cuando: hoy,
      proximo: sumarDias(hoy, DIAS[cuerpo.estado]),
      nota: textoLimpio(cuerpo.nota, 200),
    };
    await cartera().setJSON("seguimiento", seguimiento);
    return json({ ok: true, proximo: seguimiento[rut].proximo });
  }

  return error("Acción no válida.", 400);
};

export const config = { path: "/api/cartera" };
