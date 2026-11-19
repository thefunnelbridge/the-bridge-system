// La voz de Max. Usa la voz gratis del navegador (primero Lorenzo, de Chile).
// Mientras habla va avisando el ritmo, para que el núcleo resplandezca.
// Si está en silencio o el equipo no tiene voz de hombre, Max muestra el texto
// y brilla igual, sin sonido.
//
// Más adelante, el audio de ElevenLabs se conecta por los mismos avisos
// (alNivel, alPulso), midiendo el sonido real.

import { elegirVoz, vocesDeHombre, partirEnFrases } from "./voces.js";

const CLAVE_SILENCIO = "max-silencio";
const CLAVE_VOZ = "max-voz";
const TONO = 0.9; // un poco más grave
const ESPERA_INICIO_MS = 6000;

function leer(clave) {
  try { return localStorage.getItem(clave); } catch { return null; }
}

function guardar(clave, valor) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, valor);
  } catch {}
}

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

export function crearVoz({ alNivel = () => {}, alPulso = () => {}, alFrase = () => {}, alTerminar = () => {} } = {}) {
  const sintesis = "speechSynthesis" in window ? window.speechSynthesis : null;
  let turno = 0;        // cambia cada vez que Max empieza o corta una frase
  let activa = false;
  let ritmo = 0;
  let ultimoPulso = 0;
  let vivas = [];       // evita que el navegador descarte frases a medio decir
  let yaEspero = false;

  // ---------- Voces disponibles ----------

  async function voces() {
    if (!sintesis) return [];
    let lista = sintesis.getVoices();
    const tieneLaMejor = () => vocesDeHombre(lista)[0]?.name.toLowerCase().includes("lorenzo");
    // Las voces naturales de Edge llegan un momento después que las del equipo.
    if (!yaEspero && !tieneLaMejor()) {
      yaEspero = true;
      await new Promise((resolver) => {
        const listo = () => { sintesis.removeEventListener("voiceschanged", listo); resolver(); };
        sintesis.addEventListener("voiceschanged", listo);
        setTimeout(listo, 1200);
      });
      lista = sintesis.getVoices();
    }
    return vocesDeHombre(lista);
  }

  async function vozActual() {
    return elegirVoz(await voces(), leer(CLAVE_VOZ));
  }

  // ---------- Ritmo del resplandor ----------

  function iniciarRitmo(fuerza) {
    detenerRitmo();
    let golpes = 0;
    ritmo = setInterval(() => {
      alNivel(fuerza * (0.4 + Math.random() * 0.5));
      golpes += 1;
      // Si la voz no avisa cada palabra, las ondas siguen un ritmo propio.
      if (golpes % 3 === 0 && performance.now() - ultimoPulso > 600) alPulso();
    }, 150);
  }

  function detenerRitmo() {
    clearInterval(ritmo);
    ritmo = 0;
  }

  function terminar(miTurno, resultado) {
    if (miTurno !== turno) return;
    activa = false;
    detenerRitmo();
    vivas = [];
    alTerminar(resultado);
  }

  // ---------- Hablar ----------

  function hablar(frases, voz, miTurno) {
    return new Promise((resolver) => {
      let empezo = false;
      let cerrado = false;
      const cerrar = (resultado) => {
        if (cerrado) return;
        cerrado = true;
        clearTimeout(reloj);
        terminar(miTurno, resultado);
        resolver(resultado);
      };
      // Si el navegador no deja hablar sin un toque, se pide el toque.
      const reloj = setTimeout(() => {
        if (!empezo) {
          sintesis.cancel();
          cerrar("bloqueado");
        }
      }, ESPERA_INICIO_MS);

      frases.forEach((frase, i) => {
        const dicho = new SpeechSynthesisUtterance(frase);
        dicho.voice = voz;
        dicho.lang = voz.lang;
        dicho.pitch = TONO;
        dicho.rate = 1;
        dicho.onstart = () => {
          if (miTurno !== turno) return;
          empezo = true;
          alFrase(frase, "voz");
          alPulso();
          if (!ritmo) iniciarRitmo(1);
        };
        dicho.onboundary = (evento) => {
          if (miTurno !== turno || (evento.name && evento.name !== "word")) return;
          ultimoPulso = performance.now();
          alNivel(1);
          alPulso();
        };
        dicho.onend = () => {
          if (i === frases.length - 1) cerrar("voz");
        };
        dicho.onerror = (evento) => {
          if (evento.error === "not-allowed") {
            sintesis.cancel();
            cerrar("bloqueado");
          } else if (evento.error === "canceled" || evento.error === "interrupted") {
            cerrar("cortado");
          } else if (i === frases.length - 1) {
            cerrar(empezo ? "voz" : "bloqueado");
          }
        };
        vivas.push(dicho);
        sintesis.speak(dicho);
      });
    });
  }

  // Sin sonido: muestra cada frase el tiempo que tomaría decirla, con brillo suave.
  async function mostrar(frases, miTurno, resultado) {
    iniciarRitmo(0.55);
    for (const frase of frases) {
      if (miTurno !== turno) return "cortado";
      alFrase(frase, resultado);
      alPulso();
      const palabras = frase.split(/\s+/).length;
      await pausa(Math.max(1300, palabras * 340));
    }
    if (miTurno !== turno) return "cortado";
    terminar(miTurno, resultado);
    return resultado;
  }

  // Resultado: "voz" (habló), "silencio", "sin-voz" (el equipo no tiene voz de
  // hombre en español), "bloqueado" (el navegador pide un toque) o "cortado".
  async function decir(texto) {
    callar();
    const frases = partirEnFrases(texto);
    if (!frases.length) return "voz";
    const miTurno = ++turno;
    activa = true;
    if (silencio()) return mostrar(frases, miTurno, "silencio");
    const voz = await vozActual();
    if (miTurno !== turno) return "cortado";
    if (!voz) return mostrar(frases, miTurno, "sin-voz");
    return hablar(frases, voz, miTurno);
  }

  function callar() {
    const estabaActiva = activa;
    turno += 1;
    activa = false;
    detenerRitmo();
    vivas = [];
    if (sintesis) sintesis.cancel();
    if (estabaActiva) alTerminar("cortado");
  }

  // ---------- Preferencias (se guardan en este equipo) ----------

  function silencio() {
    return leer(CLAVE_SILENCIO) === "1";
  }

  return {
    decir,
    callar,
    voces,
    vozActual,
    activa: () => activa,
    silencio,
    ponerSilencio(valor) {
      guardar(CLAVE_SILENCIO, valor ? "1" : null);
      if (valor) callar();
    },
    elegir(voiceURI) {
      guardar(CLAVE_VOZ, voiceURI || null);
    },
    disponible: () => Boolean(sintesis),
  };
}
