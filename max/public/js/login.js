// Pantalla de clave.
const formulario = document.getElementById("form-login");
const campo = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("btn-entrar");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensaje.textContent = "";
  if (!campo.value) {
    mensaje.textContent = "Escribe tu clave.";
    campo.focus();
    return;
  }
  boton.disabled = true;
  boton.textContent = "Entrando...";
  try {
    const respuesta = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ clave: campo.value }),
    });
    const datos = await respuesta.json().catch(() => ({}));
    if (respuesta.ok && datos.ok) {
      // Entrada nueva: Max vuelve a saludar al llegar.
      try { sessionStorage.removeItem("max-saludo-hecho"); } catch {}
      location.replace("/");
      return;
    }
    mensaje.textContent = datos.error || "No pude entrar. Intenta de nuevo.";
  } catch {
    mensaje.textContent = "No hay conexión con Max. Revisa internet e intenta de nuevo.";
  }
  campo.value = "";
  campo.focus();
  boton.disabled = false;
  boton.textContent = "Entrar";
});
