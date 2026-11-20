// Cartera de clientes y oportunidades del día.
//   GET  /api/cartera?vista=oportunidades   citas de hoy y a quién llamar
//   GET  /api/cartera?buscar=texto          busca por nombre, RUT o patente
//   GET  /api/cartera?rut=...               ficha de un cliente con su historial
//   POST { accion: "importar", tipo, filas } reemplaza clientes, atenciones o solicitudes
//   POST { accion: "seguimiento", rut, ... } marca contactado o pospone
//   GET  /api/cartera?vista=excluidos       lista "No contactar"
//   POST { accion: "excluir", texto }       saca a una persona de todo Max
//   POST { accion: "incluir", id }          la quita de esa lista
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { tienda, leerJSON, registrarActividad } from "../../lib/almacen.mjs";
import { leerAjustes } from "../../lib/datos.mjs";
import { hoyChile, textoLimpio } from "../../lib/calculos.mjs";
import {
  LIMITES, claveRut, sumarDias, normalizarClientes, normalizarAtenciones, normalizarSolicitudes,
  oportunidades, buscar, ficha, crearExclusion, aplicarExclusiones,
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
const MAX_EXCLUIDOS = 200;

// Vuelve a pasar la lista "No contactar" por todo lo guardado y lo deja limpio.
async function limpiarGuardado(excluidos) {
  const [clientes, atenciones, solicitudes] = await Promise.all([leer("clientes", []), leer("atenciones", []), leer("solicitudes", [])]);
  const limpio = aplicarExclusiones({ clientes, atenciones, solicitudes, excluidos });
  await Promise.all([
    cartera().setJSON("clientes", limpio.clientes),
    cartera().setJSON("atenciones", limpio.atenciones),
    cartera().setJSON("solicitudes", limpio.solicitudes),
    cartera().setJSON("excluidos", limpio.excluidos),
  ]);
  return limpio;
}

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["GET", "POST"]);
  if (falla) return falla;
  const hoy = hoyChile();

  if (request.method === "GET") {
    const url = new URL(request.url);
    const clientes = await leer("clientes", []);

    if (url.searchParams.get("vista") === "excluidos") {
      const excluidos = await leer("excluidos", []);
      return json({ ok: true, excluidos: excluidos.map((x) => ({ id: x.id, texto: x.texto })) });
    }
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
    // Lo recién cargado pasa por la lista "No contactar" antes de quedar disponible.
    const excluidos = await leer("excluidos", []);
    if (excluidos.length) await limpiarGuardado(excluidos);
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

  if (cuerpo.accion === "excluir") {
    const excluidos = await leer("excluidos", []);
    if (excluidos.length >= MAX_EXCLUIDOS) return error("La lista No contactar está llena.", 400);
    const { entrada, error: problema } = crearExclusion(cuerpo.texto, crypto.randomUUID());
    if (problema) return error(problema, 400);
    const repetida = excluidos.some((x) => (entrada.rut && x.rut === entrada.rut) || (entrada.nombre && x.nombre === entrada.nombre));
    if (repetida) return error("Esa persona ya está en la lista.", 400);
    const limpio = await limpiarGuardado([...excluidos, entrada]);
    // En la actividad no va el nombre.
    await registrarActividad("Se agregó una persona a la lista No contactar.", "ajuste");
    return json({ ok: true, quitados: limpio.quitados });
  }

  if (cuerpo.accion === "incluir") {
    const excluidos = await leer("excluidos", []);
    await cartera().setJSON("excluidos", excluidos.filter((x) => x.id !== cuerpo.id));
    await registrarActividad("Se quitó una persona de la lista No contactar.", "ajuste");
    return json({ ok: true });
  }

  return error("Acción no válida.", 400);
};

export const config = { path: "/api/cartera" };
