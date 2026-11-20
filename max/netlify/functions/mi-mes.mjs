// Zona privada "Mi mes": facturación personal, comisión y sueldo de Javier.
// Se abre con un PIN distinto de la clave, validado aquí en el servidor.
// Cada respuesta trae un pase que dura 90 segundos; sin pase vigente no entrega nada.
import { env } from "../../lib/entorno.mjs";
import { json, error, entrada } from "../../lib/respuestas.mjs";
import { firmar, verificar, iguales, secretoValido } from "../../lib/sesion.mjs";
import { tienda, leerJSON, registrarActividad } from "../../lib/almacen.mjs";
import { leerAjustes, leerMes } from "../../lib/datos.mjs";
import { leerMesPrivado, leerReglas, guardarReglas } from "../../lib/privado.mjs";
import { hoyChile, mesDe, resumenMes } from "../../lib/calculos.mjs";
import { limpiarReglas, calcularSueldo, proyectar } from "../../lib/sueldo.mjs";

const MAX_FALLOS = 5;
const BLOQUEO_MINUTOS = 15;
const PASE_SEGUNDOS = 90;

// 423 = bloqueado. (No se usa 403: algunos servidores lo reintentan.)
const cerrada = (mensaje) => error(mensaje, 423, { cerrada: true });

async function paquete(secreto) {
  const hoy = hoyChile();
  const mes = mesDe(hoy);
  const [ajustes, publico, privado, reglas] = await Promise.all([leerAjustes(), leerMes(mes), leerMesPrivado(mes), leerReglas()]);
  const depto = resumenMes({ mes, hoy, meta: publico.meta, dias: publico.dias, ajustes });
  const propio = resumenMes({ mes, hoy, dias: privado.dias, ajustes });
  const facturado = propio.facturado;

  return {
    ok: true,
    pase: await firmar(secreto, { tipo: "privado", exp: Date.now() + PASE_SEGUNDOS * 1000 }),
    hoy,
    mes,
    facturado,
    dias: Object.entries(privado.dias).sort(([a], [b]) => b.localeCompare(a)).map(([fecha, monto]) => ({ fecha, monto })),
    // Si lo personal supera lo del departamento, los datos no calzan: mejor no mostrar el porcentaje.
    participacion: facturado !== null && depto.facturado > 0 && facturado <= depto.facturado
      ? Math.round((facturado / depto.facturado) * 1000) / 10
      : null,
    deptoCumplio: depto.cumplida,
    reglas,
    sueldo: reglas ? calcularSueldo({ reglas, facturado: facturado ?? 0, deptoCumplio: depto.cumplida }) : null,
    proyeccion: reglas
      ? proyectar({ reglas, facturado, transcurridos: propio.habilesTranscurridos, total: propio.habilesTotal, deptoCumplio: depto.cumplida })
      : null,
  };
}

export default async (request) => {
  const { falla, cuerpo } = await entrada(request, ["POST"]);
  if (falla) return falla;

  const secreto = env("SESSION_SECRET");
  const pinReal = env("MAX_PIN_PRIVADO");
  if (!pinReal || !secretoValido(secreto)) return error("Mi mes todavía no está configurado: falta MAX_PIN_PRIVADO.", 500);
  if (await iguales(pinReal, env("MAX_PASSWORD") || "")) {
    return error("El PIN de Mi mes tiene que ser distinto de la clave de entrada. Cámbialo en la configuración.", 500);
  }

  if (cuerpo.accion === "abrir") {
    const seguridad = tienda("seguridad");
    const estado = await leerJSON(seguridad, "pin", { fallos: 0, bloqueadoHasta: 0 });
    const ahora = Date.now();
    if (estado.bloqueadoHasta > ahora) {
      const minutos = Math.ceil((estado.bloqueadoHasta - ahora) / 60000);
      return error(`Demasiados intentos. Espera ${minutos} ${minutos === 1 ? "minuto" : "minutos"}.`, 429);
    }
    const pin = typeof cuerpo.pin === "string" ? cuerpo.pin : "";
    if (!pin || !(await iguales(pin, pinReal))) {
      const fallos = (estado.fallos || 0) + 1;
      if (fallos >= MAX_FALLOS) {
        await seguridad.setJSON("pin", { fallos: 0, bloqueadoHasta: ahora + BLOQUEO_MINUTOS * 60000 });
        await registrarActividad("Se bloqueó Mi mes por intentos fallidos de PIN.", "alerta");
        return error(`Demasiados intentos. Espera ${BLOQUEO_MINUTOS} minutos.`, 429);
      }
      await seguridad.setJSON("pin", { fallos, bloqueadoHasta: 0 });
      const quedan = MAX_FALLOS - fallos;
      return error(`PIN incorrecto. Te ${quedan === 1 ? "queda 1 intento" : `quedan ${quedan} intentos`}.`, 401);
    }
    await seguridad.delete("pin");
    return json(await paquete(secreto));
  }

  // Todo lo demás exige un pase vigente.
  const pase = await verificar(secreto, cuerpo.pase);
  if (!pase || pase.tipo !== "privado") return cerrada("Mi mes se bloqueó. Vuelve a poner el PIN.");

  if (cuerpo.accion === "ver") return json(await paquete(secreto));

  if (cuerpo.accion === "reglas") {
    const { reglas, error: problema } = limpiarReglas(cuerpo.reglas);
    if (problema) return error(problema, 400);
    await guardarReglas(reglas);
    return json(await paquete(secreto));
  }

  return error("Acción no válida.", 400);
};

export const config = { path: "/api/mi-mes" };
