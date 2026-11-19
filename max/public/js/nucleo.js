// Núcleo de Max: tacómetro con un centro que resplandece cuando Max habla.
// PROVISIONAL en la forma: se ajustará al demo aprobado (index.html) cuando llegue.
//
// Uso:
//   const nucleo = crearNucleo(contenedor);
//   nucleo.irA(62);            aguja y arco al 62 % de la meta
//   nucleo.texto("62%", "DE LA META");
//   nucleo.estado("hablando"); espera | hablando | toque
//   nucleo.nivel(0.8);         golpe de intensidad (0 a 1); se apaga solo
//   nucleo.pulso();            suelta una onda desde el centro
//
// El nivel se publica en la variable CSS --nivel de toda la página, así el
// resplandor también tiñe el fondo y los paneles.

const NS = "http://www.w3.org/2000/svg";
const C = 200;
const INICIO = -135; // grados; 0 = arriba, sentido horario
const BARRIDO = 270;
const R_AVANCE = 124;

const BARRAS = 72;
const R_BARRA = 76;
const LARGO_MIN = 2.5;
const LARGO_MAX = 30;
const MAX_ONDAS = 7;

function punto(r, grados) {
  const rad = (grados * Math.PI) / 180;
  return [C + r * Math.sin(rad), C - r * Math.cos(rad)];
}

function crear(nombre, atributos = {}, padre) {
  const elemento = document.createElementNS(NS, nombre);
  for (const [clave, valor] of Object.entries(atributos)) elemento.setAttribute(clave, String(valor));
  if (padre) padre.appendChild(elemento);
  return elemento;
}

function arco(r, desde, hasta) {
  const [x1, y1] = punto(r, desde);
  const [x2, y2] = punto(r, hasta);
  const grande = hasta - desde > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${grande} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const limitar = (valor, min = 0, max = 100) => Math.max(min, Math.min(max, valor));
const angulo = (pct) => INICIO + (BARRIDO * limitar(pct)) / 100;
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function gradientes(defs) {
  const cromo = crear("linearGradient", { id: "n-cromo", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  [["0", "#f6f7f9"], ["0.35", "#a3a9b1"], ["0.55", "#2e3137"], ["0.8", "#cfd3d9"], ["1", "#70757d"]].forEach(([o, c]) =>
    crear("stop", { offset: o, "stop-color": c }, cromo));

  const brillo = crear("radialGradient", { id: "n-brillo", cx: "50%", cy: "45%", r: "55%" }, defs);
  [["0", "#fff1ea"], ["0.2", "#ff6a4a"], ["0.58", "#d00800"], ["1", "#3d0000"]].forEach(([o, c]) =>
    crear("stop", { offset: o, "stop-color": c }, brillo));

  const halo = crear("radialGradient", { id: "n-halo" }, defs);
  crear("stop", { offset: "0.4", "stop-color": "#ff2d1a", "stop-opacity": "0.6" }, halo);
  crear("stop", { offset: "1", "stop-color": "#ff2d1a", "stop-opacity": "0" }, halo);

  const destello = crear("radialGradient", { id: "n-destello" }, defs);
  crear("stop", { offset: "0", "stop-color": "#ffffff", "stop-opacity": "0.95" }, destello);
  crear("stop", { offset: "0.5", "stop-color": "#ffd2c4", "stop-opacity": "0.5" }, destello);
  crear("stop", { offset: "1", "stop-color": "#ff5a3c", "stop-opacity": "0" }, destello);

  const aguja = crear("linearGradient", { id: "n-aguja", x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
  crear("stop", { offset: "0", "stop-color": "#ff2d1a" }, aguja);
  crear("stop", { offset: "1", "stop-color": "#ffd9d2" }, aguja);

  const filtro = crear("filter", { id: "n-glow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
  crear("feGaussianBlur", { stdDeviation: 6, result: "difuso" }, filtro);
  const mezcla = crear("feMerge", {}, filtro);
  crear("feMergeNode", { in: "difuso" }, mezcla);
  crear("feMergeNode", { in: "SourceGraphic" }, mezcla);
}

export function crearNucleo(contenedor) {
  const svg = crear("svg", { viewBox: "0 0 400 400", class: "nucleo-svg", "aria-hidden": "true", focusable: "false" });
  gradientes(crear("defs", {}, svg));

  // Bisel cromado y cara.
  crear("circle", { cx: C, cy: C, r: 194, class: "n-bisel" }, svg);
  crear("circle", { cx: C, cy: C, r: 188, class: "n-cara" }, svg);

  // Marcas del tacómetro: cada 2 %, mayores cada 10 %, zona roja desde 90 %.
  const marcas = crear("g", {}, svg);
  for (let pct = 0; pct <= 100; pct += 2) {
    const mayor = pct % 10 === 0;
    const a = angulo(pct);
    const [x1, y1] = punto(178, a);
    const [x2, y2] = punto(mayor ? 160 : 169, a);
    const clases = ["n-marca", mayor ? "n-marca-mayor" : "", pct >= 90 ? "n-marca-roja" : ""].join(" ").trim();
    crear("line", { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), class: clases }, marcas);
    if (mayor) {
      const [tx, ty] = punto(145, a);
      const etiqueta = crear("text", { x: tx.toFixed(2), y: ty.toFixed(2), class: "n-etiqueta" }, marcas);
      etiqueta.textContent = String(pct / 10);
    }
  }

  // Pista y arco de avance.
  crear("path", { d: arco(R_AVANCE, INICIO, INICIO + BARRIDO), class: "n-pista" }, svg);
  const avance = crear("path", { d: "", class: "n-avance", filter: "url(#n-glow)" }, svg);

  // Halo del centro.
  crear("circle", { cx: C, cy: C, r: 118, class: "n-halo", fill: "url(#n-halo)" }, svg);

  // Anillo de voz: barras que crecen con la intensidad de lo que Max dice.
  const grupoBarras = crear("g", { class: "n-barras" }, svg);
  const barras = [];
  for (let i = 0; i < BARRAS; i++) {
    const a = (i * 360) / BARRAS;
    const [x1, y1] = punto(R_BARRA, a);
    const linea = crear("line", { x1: x1.toFixed(2), y1: y1.toFixed(2), class: "n-barra" }, grupoBarras);
    const espejo = Math.min(i, BARRAS - i);
    barras.push({ linea, a, fase: espejo * 1.7, ritmo: 1 + (espejo % 7) * 0.13 });
  }

  function pintarBarras(nivel, t) {
    for (const barra of barras) {
      const forma = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.011 * barra.ritmo + barra.fase));
      const [x2, y2] = punto(R_BARRA + LARGO_MIN + nivel * LARGO_MAX * forma, barra.a);
      barra.linea.setAttribute("x2", x2.toFixed(2));
      barra.linea.setAttribute("y2", y2.toFixed(2));
    }
  }

  // Ondas que salen del centro, anillo fino y centro brillante.
  const ondas = crear("g", { class: "n-ondas" }, svg);
  crear("circle", { cx: C, cy: C, r: 68, class: "n-anillo" }, svg);
  crear("circle", { cx: C, cy: C, r: 58, class: "n-centro", fill: "url(#n-brillo)", filter: "url(#n-glow)" }, svg);
  crear("circle", { cx: C, cy: C, r: 46, class: "n-destello", fill: "url(#n-destello)" }, svg);

  // Aguja: segmento entre el centro y los números (no los tapa).
  const aguja = crear("g", { class: "n-aguja" }, svg);
  crear("path", { d: `M ${C - 3.4} ${C - 72} L ${C} ${C - 134} L ${C + 3.4} ${C - 72} Z`, fill: "url(#n-aguja)" }, aguja);

  // Texto central.
  const valor = crear("text", { x: C, y: C - 2, class: "n-valor" }, svg);
  const unidad = crear("text", { x: C, y: C + 24, class: "n-unidad" }, svg);
  valor.textContent = "MAX";

  contenedor.replaceChildren(svg);

  const raiz = document.documentElement;
  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Aguja y arco ----------

  let actual = 0;
  let animacion = 0;

  function pintar(pct) {
    actual = limitar(pct);
    const a = angulo(actual);
    aguja.setAttribute("transform", `rotate(${a.toFixed(2)} ${C} ${C})`);
    avance.setAttribute("d", actual > 0.2 ? arco(R_AVANCE, INICIO, a) : "");
  }

  function animar(hacia, ms) {
    cancelAnimationFrame(animacion);
    const desde = actual;
    const inicio = performance.now();
    return new Promise((resolver) => {
      const paso = (ahora) => {
        const t = Math.min(1, (ahora - inicio) / ms);
        pintar(desde + (hacia - desde) * suavizar(t));
        if (t < 1) animacion = requestAnimationFrame(paso);
        else resolver();
      };
      animacion = requestAnimationFrame(paso);
    });
  }

  // ---------- Resplandor ----------
  // Cada llamada a nivel() es un golpe de luz. El núcleo sube rápido y se
  // apaga suave, así el brillo sigue el ritmo de la voz.

  let objetivo = 0;
  let nivelActual = 0;
  let ciclo = 0;

  function publicar(nivel, t) {
    raiz.style.setProperty("--nivel", nivel.toFixed(3));
    pintarBarras(nivel, t);
  }

  function paso(t) {
    const rapidez = objetivo > nivelActual ? 0.5 : 0.14;
    nivelActual += (objetivo - nivelActual) * rapidez;
    objetivo *= 0.88;
    if (nivelActual < 0.004 && objetivo < 0.004) {
      nivelActual = 0;
      objetivo = 0;
      ciclo = 0;
      publicar(0, t);
      return;
    }
    publicar(nivelActual, t);
    ciclo = requestAnimationFrame(paso);
  }

  function soltarOnda() {
    if (sinMovimiento || ondas.childElementCount >= MAX_ONDAS) return;
    const onda = crear("circle", { cx: C, cy: C, r: 60, class: "n-onda" }, ondas);
    onda.addEventListener("animationend", () => onda.remove(), { once: true });
  }

  pintar(0);
  publicar(0, 0);
  svg.dataset.estado = "espera";

  return {
    irA(pct, { ms = 900 } = {}) {
      if (sinMovimiento) return pintar(pct);
      return animar(limitar(pct), ms);
    },
    // Barrido de encendido, como el tablero de un auto al dar contacto.
    async encender(destino = 0) {
      if (sinMovimiento) return pintar(destino);
      soltarOnda();
      this.nivel(0.9);
      await animar(100, 850);
      await animar(limitar(destino), 950);
    },
    texto(principal, secundario = "") {
      valor.textContent = principal;
      unidad.textContent = secundario;
    },
    estado(nombre) {
      svg.dataset.estado = nombre;
    },
    nivel(n) {
      objetivo = Math.max(objetivo, limitar(n, 0, 1));
      if (!ciclo) ciclo = requestAnimationFrame(paso);
    },
    pulso() {
      soltarOnda();
    },
  };
}
