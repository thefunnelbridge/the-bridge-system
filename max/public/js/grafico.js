// Gráfico de facturación por día hábil del mes.
// Una sola serie (barras) y una línea de referencia: lo que hay que facturar
// en promedio por día para llegar a la meta.
import { clp, clpCorto, fechaLarga } from "./formato.js";

const NS = "http://www.w3.org/2000/svg";
const ANCHO = 340, ALTO = 150;
const MARGEN = { arriba: 16, derecha: 6, abajo: 20, izquierda: 6 };

function crear(nombre, atributos = {}, padre) {
  const el = document.createElementNS(NS, nombre);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, String(v));
  if (padre) padre.appendChild(el);
  return el;
}

// Barra con la punta superior redondeada y la base recta.
function barra(x, y, ancho, alto) {
  const r = Math.min(3, ancho / 2, alto);
  return `M ${x} ${y + alto} V ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + ancho - r} Q ${x + ancho} ${y} ${x + ancho} ${y + r} V ${y + alto} Z`;
}

export function pintarGrafico(contenedor, resumen, hoy) {
  const dias = resumen.serie.filter((d) => d.peso > 0 || d.monto !== null);
  const hayDatos = dias.some((d) => d.monto !== null);
  if (!hayDatos) {
    contenedor.className = "grafico vacio";
    contenedor.textContent = "Sin datos todavía.";
    return;
  }
  contenedor.className = "grafico";
  contenedor.replaceChildren();

  const referencia = resumen.promedioNecesario;
  const maximo = Math.max(...dias.map((d) => d.monto ?? 0), referencia ?? 0) * 1.12 || 1;
  const areaAncho = ANCHO - MARGEN.izquierda - MARGEN.derecha;
  const areaAlto = ALTO - MARGEN.arriba - MARGEN.abajo;
  const paso = areaAncho / dias.length;
  const anchoBarra = Math.max(3, Math.min(14, paso - 2));
  const base = MARGEN.arriba + areaAlto;
  const y = (monto) => base - (monto / maximo) * areaAlto;

  const svg = crear("svg", { viewBox: `0 0 ${ANCHO} ${ALTO}`, class: "grafico-svg", role: "img", "aria-label": "Facturación del departamento por día hábil" });
  crear("line", { x1: MARGEN.izquierda, x2: ANCHO - MARGEN.derecha, y1: base, y2: base, class: "g-base" }, svg);

  const globo = document.createElement("div");
  globo.className = "globo";
  globo.hidden = true;

  dias.forEach((dia, i) => {
    const centro = MARGEN.izquierda + paso * i + paso / 2;
    const grupo = crear("g", { class: "g-dia" }, svg);
    if (dia.fecha === hoy) crear("rect", { x: centro - paso / 2, y: MARGEN.arriba, width: paso, height: areaAlto, class: "g-hoy" }, grupo);
    if (dia.monto !== null && dia.monto > 0) {
      const alto = Math.max(2, base - y(dia.monto));
      crear("path", { d: barra(centro - anchoBarra / 2, base - alto, anchoBarra, alto), class: "g-barra" }, grupo);
    } else if (dia.monto === 0) {
      crear("rect", { x: centro - anchoBarra / 2, y: base - 2, width: anchoBarra, height: 2, class: "g-barra" }, grupo);
    } else if (dia.fecha <= hoy) {
      // Día hábil que ya pasó y no tiene dato cargado.
      crear("circle", { cx: centro, cy: base - 5, r: 1.6, class: "g-falta" }, grupo);
    }
    const numero = Number(dia.fecha.slice(8));
    if (numero === 1 || numero % 5 === 0 || i === dias.length - 1) {
      const t = crear("text", { x: centro, y: ALTO - 5, class: "g-eje" }, svg);
      t.textContent = String(numero);
    }
    // Zona sensible más grande que la barra.
    const zona = crear("rect", { x: centro - paso / 2, y: MARGEN.arriba, width: paso, height: areaAlto + 2, class: "g-zona", tabindex: "0" }, grupo);
    const detalle = dia.monto !== null ? clp(dia.monto) : dia.fecha <= hoy ? "Sin dato cargado" : "Todavía no llega";
    zona.setAttribute("aria-label", `${fechaLarga(dia.fecha)}: ${detalle}`);
    const mostrar = () => {
      globo.replaceChildren();
      const f = document.createElement("span");
      f.className = "globo-fecha";
      f.textContent = fechaLarga(dia.fecha);
      const v = document.createElement("strong");
      v.textContent = detalle;
      globo.append(f, v);
      globo.hidden = false;
      const izquierda = (centro / ANCHO) * 100;
      globo.style.left = `${Math.max(18, Math.min(82, izquierda))}%`;
      grupo.classList.add("activo");
    };
    const ocultar = () => { globo.hidden = true; grupo.classList.remove("activo"); };
    zona.addEventListener("pointerenter", mostrar);
    zona.addEventListener("pointerleave", ocultar);
    zona.addEventListener("focus", mostrar);
    zona.addEventListener("blur", ocultar);
  });

  const partes = [svg, globo];
  if (referencia) {
    const yRef = y(referencia);
    crear("line", { x1: MARGEN.izquierda, x2: ANCHO - MARGEN.derecha, y1: yRef, y2: yRef, class: "g-ref" }, svg);
    const nota = document.createElement("p");
    nota.className = "grafico-nota";
    nota.textContent = `Promedio diario para llegar a la meta: ${clpCorto(referencia)}`;
    partes.push(nota);
  }

  contenedor.append(...partes);
}
