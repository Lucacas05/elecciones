# Decide Perú

Aplicación web hecha con Astro para explorar candidaturas presidenciales peruanas, revisar planes de gobierno y calcular afinidad política mediante un cuestionario temático.

## Qué incluye hoy

- **Landing** con presentación del proyecto y CTA al test.
- **Cuestionario electoral** de **8 ejes temáticos**.
- **Ranking de afinidad** con resultado principal, top de coincidencias y desglose por tema.
- **Página de candidatos** construida desde contenido Markdown.
- **Biblioteca de planes de gobierno en PDF** servidos desde `public/planes-gobierno/`.
- **Página de predicciones** con datos de **Polymarket**:
  - fetch desde un endpoint interno de Astro
  - refresco manual
  - polling periódico
  - actualización en vivo vía WebSocket

## Stack

- **Astro 5**
- **Tailwind CSS**
- **@astrojs/vercel**
- Contenido estructurado con **`astro:content`**

La app está configurada con el adapter oficial de **Vercel** para generar **páginas estáticas por defecto** y dejar solamente `/api/polymarket/peru-election.json` como ruta on-demand.

## Rutas principales

- `/` → inicio
- `/cuestionario` → test de afinidad
- `/candidatos` → perfiles de candidatura
- `/planes-de-gobierno` → listado de PDFs
- `/predicciones` → mercado predictivo de Polymarket
- `/api/polymarket/peru-election.json` → endpoint server-side que proxyea/normaliza Polymarket

## Estructura del proyecto

```text
.
├── candidatos/                     # Fuente editorial de candidaturas (.md)
├── public/
│   ├── img/
│   │   ├── candidatos/             # Fotos
│   │   └── partidos/               # Logos
│   ├── planes-gobierno/            # PDFs públicos
│   └── script.js                   # Lógica cliente del test + Polymarket
├── src/
│   ├── components/                 # UI Astro
│   ├── layouts/
│   ├── lib/
│   │   ├── planLinks.ts            # Resolución de PDF por partido/alias
│   │   └── polymarket/             # Fetch live, normalización y fallback del mercado
│   ├── data/
│   │   └── polymarket/             # Seed local de emergencia para Polymarket
│   ├── pages/
│   │   ├── api/polymarket/         # Endpoint JSON
│   │   ├── index.astro
│   │   ├── cuestionario.astro
│   │   ├── candidatos.astro
│   │   ├── planes-de-gobierno.astro
│   │   └── predicciones.astro
│   ├── styles/
│   └── content.config.ts           # Schema de candidatos
├── astro.config.mjs
└── tailwind.config.mjs
```

## Desarrollo local

Requisitos recomendados:

- **Node.js LTS**
- **npm**

Instalación:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview local del build:

> `astro preview` no está soportado por `@astrojs/vercel` en este proyecto.
> Para validar el deploy conviene usar `npm run build` y revisar `.vercel/output/`.

## Deploy en Vercel

Configuración recomendada en el panel de Vercel:

- **Framework Preset:** Astro
- **Build Command:** `npm run build` (o automático)
- **Output Directory:** dejar vacío / automático

No fuerces `dist` ni `dist/client` como carpeta de salida cuando Astro usa el adapter de Vercel, porque el adaptador genera la estructura que Vercel necesita para archivos estáticos y funciones.

## Cómo se edita el contenido

### 1) Candidatos

La fuente de verdad está en `candidatos/*.md`.

Cada archivo debe respetar el schema definido en `src/content.config.ts`.

Ejemplo mínimo:

```md
---
nombre: "Nombre Apellido"
partido: "Partido X"
logo_partido: "/img/partidos/partido-x.png"
foto: "/img/candidatos/nombre-apellido.webp"
edad: 50
profesion: "Economista"
experiencia_politica: "Exministro y excongresista"
propuestas:
  - "Propuesta 1"
  - "Propuesta 2"
  - "Propuesta 3"
dato_clave: "Resumen corto"
partido_ideologia: "Centro reformista"
plan_gobierno_url: "https://..."
hoja_vida_url: "https://..."
quiz_posiciones:
  seguridad: reforma_institucional
  economia: mixta
  educacion: publica_prioridad
  salud: mixto
  corrupcion: reforma_judicial
  mineria: consulta_previa
  descentralizacion: gradual
  politica_social: educacion_tecnica
  instituciones: reforma_estado
  empleo_formalizacion: capacitacion_formalizacion
---
```

### 2) Valores válidos de `quiz_posiciones`

Cada eje usa valores cerrados:

- `seguridad`: `mano_dura` | `reforma_institucional` | `prevencion`
- `economia`: `libre_mercado` | `intervencion_estatal` | `mixta`
- `educacion`: `publica_prioridad` | `privada_incentivo` | `mixta`
- `salud`: `sistema_universal` | `privado_complementario` | `mixto`
- `corrupcion`: `pena_muerte` | `cadena_perpetua` | `reforma_judicial`
- `mineria`: `pro_mineria` | `regulacion_estricta` | `consulta_previa`
- `descentralizacion`: `mas_poder_regiones` | `gobierno_central` | `gradual`
- `politica_social`: `bonos_directos` | `programas_empleo` | `educacion_tecnica`
- `instituciones`: `autoridad_ejecutiva` | `reforma_estado` | `transparencia_control`
- `empleo_formalizacion`: `inversion_privada` | `empleo_publico` | `capacitacion_formalizacion`

### 3) Imágenes y logos

- Fotos: `public/img/candidatos/`
- Logos: `public/img/partidos/`

Las rutas se referencian desde el frontmatter de cada candidato.

### 4) Planes de gobierno

Los PDFs públicos viven en:

```text
public/planes-gobierno/
```

La resolución de enlaces por nombre de partido y alias se hace en:

```text
src/lib/planLinks.ts
```

Si no existe una coincidencia directa, la UI deriva a `/planes-de-gobierno?partido=...`.
La página de planes está pensada para ser estable en deploy, así que lista todos los PDFs sin depender de resaltado dinámico por query string.

## Cómo funciona el test

La lógica del cuestionario vive en:

- `public/quiz-core.js` → motor puro del quiz, scoring y mapeos
- `public/script.js` → wrapper de DOM del cuestionario + Polymarket

### Flujo actual

1. Astro inyecta los candidatos cargados desde `astro:content`.
2. El cliente arma la colección `CANDIDATES`.
3. El usuario responde 10 preguntas de 3 opciones cada una.
4. Las respuestas se guardan en `localStorage`.
5. El resultado se muestra solo cuando el usuario completa 10/10 respuestas.
6. Se calcula una afinidad por candidatura y un ranking final.

### Algoritmo de afinidad

El score principal usa **posiciones estructuradas curadas** (`quiz_posiciones`) y una
**matriz categórica de compatibilidad** por tema.

- cada eje compara la respuesta del usuario con la posición editorial del candidato
- la afinidad por tema se convierte a porcentaje
- el score final es el promedio de los 10 temas
- las respuestas incompletas no generan ranking

La lectura contextual de texto vía palabras clave se mantiene solo como
**evidencia secundaria / desempate** y ya no modifica el score principal.

## Polymarket

La integración se reparte así:

- `src/lib/polymarket/fetch-live.ts` → fetch live con timeout, retries y logging
- `src/lib/polymarket/normalize.ts` → normalización y validación del evento
- `src/lib/polymarket/store.ts` → persistencia en Vercel Blob + lectura del seed local
- `src/lib/polymarket/index.ts` → orquestación `live -> cache -> seed`
- `src/data/polymarket/peru-election-winner.seed.json` → respaldo local mínimo
- `src/pages/api/polymarket/peru-election.json.ts` → endpoint de Astro
- `public/script.js` → render cliente, polling y WebSocket

### Importante

La página `/predicciones` es estática, pero **depende del endpoint server-side** `/api/polymarket/peru-election.json`.

El endpoint ahora intenta servir datos en este orden:

1. **Live** desde Polymarket
2. **Cache persistente** en Vercel Blob
3. **Seed local** versionado en el repo

Para que funcione el fallback persistente en Vercel Blob, el proyecto necesita un store conectado y `BLOB_READ_WRITE_TOKEN` disponible en runtime.

Para probar la integración correctamente en local, usa:

```bash
npm run dev
```

Para verificar la salida de producción, usa:

```bash
npm run build
```

## Notas de mantenimiento

- Hay tests automatizados con Vitest para:
  - motor del cuestionario y scoring de afinidad
  - normalización de payloads de Polymarket
  - fallback de store/cache/seed
  - respuesta del endpoint JSON
- Los comandos disponibles hoy son:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm run test`
- Si cambias nombres de partidos o PDFs, revisa también los alias de `src/lib/planLinks.ts`.

## Próximas mejoras razonables

- añadir validaciones/editorial tooling para candidatos y assets faltantes
- incorporar tests para la normalización de PDFs
