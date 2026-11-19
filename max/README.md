# Max

Asistente personal y centro de mando de Javier Riffo, asesor de Servicio Técnico.
Max es una herramienta personal de Javier, no un sistema de Salfa.

Sitio estático + Netlify Functions + Netlify Blobs (base de datos incluida en Netlify).
Sin framework y sin paso de compilación.

## Estado

| Parte | Qué incluye | Estado |
|---|---|---|
| 1 | Clave de entrada, guardia, centro de mando, núcleo, instalable como app | Lista (núcleo provisional hasta recibir el demo aprobado) |
| 2 | Meta del departamento, carga de datos, ajustes, terminados sin facturar | Pendiente |
| 3 | Mi mes (PIN, autobloqueo, comisión y sueldo) | Pendiente |
| 4 | Voz (gratis, del navegador; primero "Lorenzo", Chile), saludo y pulso | Pendiente |
| 5 | Resumen hablado y barra para escribir o hablar (Claude) | Pendiente |
| 6 | Cerebro y Radar diario | Pendiente |
| 7 | Modo demo, estructura de Etapa 2 | Pendiente |

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
│   ├── js/                    app.js, nucleo.js, login.js
│   ├── manifest.webmanifest   app instalable
│   ├── sw.js                  guarda solo la interfaz, nunca datos
│   └── icons/
├── netlify/
│   ├── edge-functions/guardia.js   sin sesión no se entrega ninguna página
│   └── functions/                  login, logout, actividad
├── lib/                       sesión firmada, almacén, utilidades
└── tests/                     pruebas automáticas
```

## Seguridad

- La sesión dura 12 horas y va en una cookie firmada que el código del navegador no puede leer.
- Tras 5 claves incorrectas, la entrada se bloquea 15 minutos.
- Sin sesión solo existe la pantalla de clave; todo lo demás redirige a ella.
- Las páginas no quedan guardadas en el navegador al salir.
