// Conexión con el servidor de Max.
export async function api(ruta, cuerpo) {
  const opciones = { credentials: "same-origin", headers: { "content-type": "application/json" } };
  if (cuerpo !== undefined) {
    opciones.method = "POST";
    opciones.body = JSON.stringify(cuerpo);
  }
  let respuesta;
  try {
    respuesta = await fetch(ruta, opciones);
  } catch {
    throw new Error("No hay conexión con Max. Revisa internet e intenta de nuevo.");
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (respuesta.status === 401 && datos.sinSesion) {
    location.replace("/login");
    throw new Error("sin sesión");
  }
  if (!respuesta.ok) {
    const falla = new Error(datos.error || "Algo falló en el servidor. Intenta de nuevo.");
    falla.cerrada = Boolean(datos.cerrada); // Mi mes se bloqueó
    throw falla;
  }
  return datos;
}
