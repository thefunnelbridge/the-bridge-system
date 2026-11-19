// Núcleo de Max: tacómetro con un centro brillante que pulsa.
// PROVISIONAL: se ajustará al demo aprobado (index.html) cuando llegue.
//
// Uso:
//   const nucleo = crearNucleo(contenedor);
//   nucleo.irA(62);          aguja y arco al 62 % de la meta
//   nucleo.texto("62%", "DE LA META");
//   nucleo.nivel(0.7);       intensidad del pulso (0 a 1), para la voz
//   nucleo.hablando(true);   apaga la respiración automática mientras habla

const NS = "http://www.w3.org/2000/svg";
const C = 200;
const INICIO = -135; // grados; 0 = arriba, sentido horario
const BARRIDO = 270;
const R_AVANCE = 124;

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

const limitar = (pct) => Math.max(0, Math.min(100, pct));
const angulo = (pct) => INICIO + (BARRIDO * limitar(pct)) / 100;
const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function gradientes(defs) {
  const cromo = crear("linearGradient", { id: "n-cromo", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  [["0", "#f6f7f9"], ["0.35", "#a3a9b1"], ["0.55", "#2e3137"], ["0.8", "#cfd3d9"], ["1", "#70757d"]].forEach(([o, c]) =>
    crear("stop", { offset: o, "stop-color": c }, cromo));

  const brillo = crear("radialGradient", { id: "n-brillo", cx: "50%", cy: "45%", r: "55%" }, defs);
  [["0", "#ffe1d6"], ["0.22", "#ff5a3c"], ["0.6", "#c80600"], ["1", "#3d0000"]].forEach(([o, c]) =>
    crear("stop", { offset: o, "stop-color": c }, brillo));

  const halo = crear("radialGradient", { id: "n-halo" }, defs);
  crear("stop", { offset: "0.45", "stop-color": "#ff2d1a", "stop-opacity": "0.55" }, halo);
  crear("stop", { offset: "1", "stop-color": "#ff2d1a", "stop-opacity": "0" }, halo);

  const aguja = crear("linearGradient", { id: "n-aguja", x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
  crear("stop", { offset: "0", "stop-color": "#ff2d1a" }, aguja);
  crear("stop", { offset: "1", "stop-color": "#ffd9d2" }, aguja);

  const filtro = crear("filter", { id: "n-glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
  crear("feGaussianBlur", { stdDeviation: 5, result: "difuso" }, filtro);
  const mezcla = crear("feMerge", {}, filtro);
  crear("feMergeNode", { in: "difuso" }, mezcla);
  crear("feMergeNode", { in: "SourceGraphic" }, mezcla);
}

export function crearNucleo(contenedor) {
  const svg = crear("svg", { viewBox: "0 0 400 400", class: "nucleo-svg", role: "img", "aria-label": "Núcleo de Max" });
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

  // Halo, anillos y centro brillante.
  crear("circle", { cx: C, cy: C, r: 112, class: "n-halo", fill: "url(#n-halo)" }, svg);
  crear("circle", { cx: C, cy: C, r: 96, class: "n-anillo n-anillo-1" }, svg);
  crear("circle", { cx: C, cy: C, r: 80, class: "n-anillo n-anillo-2" }, svg);
  crear("circle", { cx: C, cy: C, r: 64, class: "n-centro", fill: "url(#n-brillo)", filter: "url(#n-glow)" }, svg);

  // Aguja: segmento entre el centro y los números (no los tapa).
  const aguja = crear("g", { class: "n-aguja" }, svg);
  crear("path", { d: `M ${C - 3.4} ${C - 70} L ${C} ${C - 134} L ${C + 3.4} ${C - 70} Z`, fill: "url(#n-aguja)" }, aguja);

  // Texto central.
  const valor = crear("text", { x: C, y: C - 2, class: "n-valor" }, svg);
  const unidad = crear("text", { x: C, y: C + 26, class: "n-unidad" }, svg);
  valor.textContent = "MAX";

  contenedor.replaceChildren(svg);

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

  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  pintar(0);

  return {
    irA(pct, { ms = 900 } = {}) {
      if (sinMovimiento) return pintar(pct);
      return animar(limitar(pct), ms);
    },
    // Barrido de encendido, como el tablero de un auto al dar contacto.
    async encender(destino = 0) {
      if (sinMovimiento) return pintar(destino);
      await animar(100, 850);
      await animar(limitar(destino), 950);
    },
    texto(principal, secundario = "") {
      valor.textContent = principal;
      unidad.textContent = secundario;
    },
    nivel(n) {
      svg.style.setProperty("--nivel", Math.max(0, Math.min(1, n)).toFixed(3));
    },
    hablando(activo) {
      svg.classList.toggle("hablando", Boolean(activo));
      if (!activo) svg.style.setProperty("--nivel", "0");
    },
  };
}
