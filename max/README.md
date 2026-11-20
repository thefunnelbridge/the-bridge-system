# Max

Asistente personal y centro de mando de Javier Riffo, asesor de Servicio Técnico.
Max es una herramienta personal de Javier, no un sistema de Salfa.

Sitio estático + Netlify Functions + Netlify Blobs (base de datos incluida en Netlify).
Sin framework y sin paso de compilación.

## La idea

Max es para Javier lo que Jarvis para Tony Stark: un copiloto que lo recibe, le dice
cómo va el mes, le muestra dónde está la plata que falta facturar y lo ayuda a
ordenarse para ser el mejor asesor. Cuando Max habla, resplandece: el núcleo se
enciende, salen ondas y la luz tiñe toda la pantalla.

## Estado

| Parte | Qué incluye | Estado |
|---|---|---|
| 1 | Clave de entrada, guardia, centro de mando, núcleo, instalable como app | Lista |
| Voz | Saludo hablado según la hora, voz gratis de hombre (primero Lorenzo, Chile), resplandor al hablar, silencio, elegir y probar voz | Lista |
| 2 | Meta del departamento, carga de datos (formulario y Excel), ajustes, gráfico por día, terminados sin facturar con alerta | Lista |
| 3 | Mi mes: zona privada con PIN, autobloqueo a los 3 minutos, comisión, sueldo y proyección | Lista |
| Cartera | Clientes, atenciones y solicitudes de Toyota; oportunidades de hoy (citas y a quién llamar), buscador y ficha del cliente | Lista |
| 4 | Resumen hablado y barra para escribir o hablar (Claude) | Pendiente |
| 5 | Cerebro y Radar diario | Pendiente |
| 6 | Modo demo, estructura de Etapa 2 | Pendiente |

## Cómo se usan los datos

- **Meta del mes**: botón de ajustes (arriba a la derecha). Ahí también se dice si
  los sábados cuentan y se agregan días sin trabajo. Los feriados de Chile ya vienen.
- **Cargar datos**: dos campos, la facturación del departamento y la de Javier.
  La de Javier se escribe a ciegas y se guarda en la zona privada: no aparece en
  el tablero, en la actividad ni en lo que Max dice.
- **Excel**: se puede subir un archivo. Max muestra primero qué encontró y solo
  guarda al confirmar. "Descargar plantilla" entrega un Excel listo para llenar.
  Columnas que reconoce: Fecha, Facturación departamento, Facturación Javier; y
  para terminados: OT, Cliente, Patente, Modelo, Fecha término.
- **Terminados sin facturar**: se agregan a mano o por Excel. "Facturado" (dos
  toques) los saca de la lista. Max los avisa en el saludo. No llevan montos.
- **Mi mes** (candado, arriba a la derecha): pide el PIN privado (`MAX_PIN_PRIVADO`,
  distinto de la clave). Muestra "hasta hoy tu sueldo va en", la comisión, una
  proyección al cierre y cuánto suma cada millón extra. Las reglas de sueldo las
  define Javier ahí mismo. Se bloquea sola a los 3 minutos sin uso, al cerrarla
  o al cambiar de ventana, y Max nunca dice esos montos en voz alta.
- **Cartera y oportunidades de hoy**: en "Cargar datos" se suben los archivos de
  clientes, atenciones y solicitudes de Toyota (CSV o Excel); cada uno reemplaza
  al anterior. Max muestra las citas de hoy y del próximo día hábil, y a quién
  llamar porque su mantención anual venció hace menos de 90 días o vence en los
  próximos 30 y todavía no tiene hora. Cada cliente trae botones para llamar,
  WhatsApp y correo, y para marcarlo "Contactado" (30 días) o "Después" (7 días).
  El buscador abre la ficha del cliente con su historial. Los archivos con datos
  reales de clientes no van en GitHub: se cargan dentro de Max.
- **No contactar**: en Ajustes se anota un nombre y apellido, o un RUT. Esa persona
  desaparece de la cartera, las oportunidades, el buscador y el historial, y no
  vuelve aunque se carguen de nuevo los archivos. También se puede hacer desde la
  ficha de un cliente ("No contactar más").
- **Varios archivos a la vez**: en "Cargar datos" se pueden elegir los tres
  archivos de la cartera juntos.
- **Supuestos que se pueden cambiar**: días hábiles de lunes a viernes y montos
  tal como se ingresen (se recomienda netos, sin IVA, igual que la meta).

## Lo que viene después de la Etapa 1

- Etapa 2: cartera de clientes, "Oportunidades del día" y agenda con Google Calendar.
- Después: correo en solo lectura, WhatsApp oficial y recordatorio de cursos.
- Más adelante: que Max pueda llamar a Javier por teléfono y hablar con él.
  La voz ya está separada del resto (`public/js/voz.js`), así que cambiarla por
  una voz de mayor calidad o por una línea telefónica no obliga a rehacer Max.

## La voz

- Gratis: usa la voz del navegador. En Microsoft Edge habla con "Lorenzo", de Chile.
- Solo voces de hombre en español. Si el equipo no tiene ninguna, Max no usa otra:
  escribe lo que diría y avisa.
- Tocar el núcleo: Max saluda; tocarlo mientras habla: se calla.
- Botón de silencio: Max escribe y brilla suave, sin sonido.
- Si el navegador no deja hablar al abrir, Max pide un toque en el núcleo.

## Probarlo en tu computador

Necesitas Node.js 20 o más nuevo (https://nodejs.org).

1. Instala la herramienta de Netlify (una sola vez):

   ```
   npm install -g netlify-cli
   ```

2. Entra a la carpeta de Max e instala lo que necesita:

   ```
   cd max
   npm install
   ```

3. Copia `.env.example` como `.env` y completa al menos:

   - `MAX_USER`: el usuario para entrar (si lo dejas vacío, es `javier`).
   - `MAX_PASSWORD`: la clave para entrar.
   - `SESSION_SECRET`: un texto largo al azar. Para generarlo:

     ```
     node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
     ```

4. Levanta Max:

   ```
   netlify dev
   ```

5. Abre http://localhost:8888 en el navegador (para Javier: Microsoft Edge).

Para correr las pruebas automáticas: `npm test`.

## Desplegar en Netlify

1. En Netlify: **Add new project > Import an existing project > GitHub** y elige este repositorio.
2. **Branch to deploy**: la rama donde está Max.
3. **Base directory**: `max`. El resto lo toma de `max/netlify.toml`.
4. En **Project configuration > Environment variables**, agrega:
   - `MAX_USER` (opcional; por defecto `javier`)
   - `MAX_PASSWORD`
   - `MAX_PIN_PRIVADO`
   - `SESSION_SECRET`
   - `ANTHROPIC_API_KEY` (desde la parte 5)
   - `ELEVENLABS_API_KEY` (opcional; sin ella Max usa la voz del navegador)
5. Despliega. Cada vez que cambie el código en GitHub, Netlify lo actualiza solo.

Las claves nunca van en el código ni en el navegador: solo en esas variables.

## Instalar como app

En Edge o Chrome, con Max abierto, aparece un ícono de "Instalar" en la barra de direcciones.
En iPhone: Compartir > Agregar a inicio.

## Cómo está armado

```
max/
├── netlify.toml               configuración y cabeceras de seguridad
├── public/                    lo que se ve
│   ├── login.html             pantalla de clave
│   ├── index.html             centro de mando
│   ├── css/max.css
│   ├── js/                    app.js, nucleo.js (resplandor), voz.js, tablero.js, grafico.js, carga.js, excel.js...
│   ├── js/vendor/             lector de Excel (SheetJS, licencia Apache 2.0)
│   ├── manifest.webmanifest   app instalable
│   ├── sw.js                  guarda solo la interfaz, nunca datos
│   └── icons/
├── netlify/
│   ├── edge-functions/guardia.js   sin sesión no se entrega ninguna página
│   └── functions/                  login, logout, actividad, tablero, cargar, ajustes, terminados, mi-mes, cartera
├── lib/                       sesión, almacén, cálculos de días hábiles y meta, feriados, zona privada
└── tests/                     pruebas automáticas
```

## Seguridad

- La sesión dura 12 horas y va en una cookie firmada que el código del navegador no puede leer.
- Tras 5 claves incorrectas, la entrada se bloquea 15 minutos.
- Sin sesión solo existe la pantalla de clave; todo lo demás redirige a ella.
- Las páginas no quedan guardadas en el navegador al salir.
