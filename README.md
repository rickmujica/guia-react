# Guías de repaso

Guías interactivas para repasar el stack de front end y algo de back end. Es una app de Vite con aspecto de documentación: cada capítulo explica un tema, muestra una **demo funcionando** y, debajo, el **código fuente real** de esa demo. El snippet que ves en la página es el mismo archivo de `src/demos/` que se está ejecutando, así que podés leerlo en la guía o en tu editor, y si lo cambiás, cambian los dos.

La home muestra todas las guías con su progreso. Cada guía recuerda **el último capítulo que abriste** (y hasta dónde bajaste) y **los capítulos que marcaste como leídos**, así que con **Continuar** retomás donde dejaste. Pasar al capítulo siguiente lo marca como leído.

| Guía | Estado | PDF para el celular |
| --- | --- | --- |
| React moderno (hooks, React 19 a 19.3, React Compiler, puente a Next.js) | Lista | [`docs/guia-react-moderno.pdf`](docs/guia-react-moderno.pdf) |
| TypeScript para React (el lenguaje y cómo tipar cada pieza de React, con ejemplos chequeados por el compilador) | Lista | [`docs/guia-typescript-react.pdf`](docs/guia-typescript-react.pdf) |
| Redux, Redux Toolkit, Redux Saga y Zustand (con RTK Query y una comparación de las cuatro) | Lista | [`docs/guia-estado-global.pdf`](docs/guia-estado-global.pdf) |
| MySQL (básico e intermedio) | Próximamente | |
| Node.js y Express | Próximamente | |

## Guía de React moderno

| Parte | Capítulos |
| --- | --- |
| Empezá acá | Cómo usar la guía · Qué cambió desde el React "legacy" |
| 1 · Fundamentos | Componentes, JSX y props · useState · Estado derivado y levantar el estado |
| 2 · Hooks a fondo | useEffect · useRef · useContext · useReducer · Custom hooks · memo, useMemo y useCallback · useTransition y useDeferredValue · Suspense, lazy y Error Boundaries · useId, useLayoutEffect, portales y más |
| 3 · React 19 a fondo | Actions · useActionState · Formularios con action y useFormStatus · useOptimistic · use() · ref como prop y `<Context>` · Metadatos · Errores y migración |
| 4 · React 19.1 → 19.3 | `<Activity>` · useEffectEvent · `<ViewTransition>` y addTransitionType · Fragment refs · React Compiler · Otras novedades |
| 5 · Puente a Next.js | Server Components · Server Functions y formularios · Chuleta y preguntas de entrevista |

## Guía de TypeScript para React

| Parte | Capítulos |
| --- | --- |
| Empezá acá | Cómo usar la guía |
| 1 · El lenguaje | Tipos básicos e inferencia · Objetos: type e interface · Uniones y narrowing · Funciones · Genéricos · Utility types y tipos calculados · Módulos, tsconfig y declaraciones |
| 2 · TypeScript en React | Componentes y props · Estado y eventos · Refs y el DOM · Context, useReducer y custom hooks · Componentes genéricos · React 19 con TypeScript · Datos de APIs con Zod |
| 3 · Repaso | Chuleta y preguntas de entrevista |

Los snippets son archivos reales en `src/demos/typescript/ejemplos/` y se chequean con su propio `tsconfig.ejemplos.json` en cada `npm run build`. Las líneas con `// @ts-expect-error` tienen que dar error: si dejan de darlo, el build falla.

## Guía de estado global

| Parte | Capítulos |
| --- | --- |
| Empezá acá | Qué estado necesita una librería y cuál no |
| 1 · Redux clásico | Store, acciones y reducers · React Redux: hooks y connect · Middleware y thunks |
| 2 · Redux Toolkit | configureStore y createSlice · createAsyncThunk y compañía · RTK Query |
| 3 · Redux Saga | Generadores y efectos · Patrones: race, fork y cancel |
| 4 · Zustand | Zustand |
| 5 · Comparar y decidir | Las cuatro, lado a lado · Chuleta y preguntas de entrevista |

Cada demo crea su propio store (salvo Zustand, que es global como en una app real) y usa una API falsa con demoras (`src/demos/estado/api.ts`).

## Cómo correrla

Necesitás Node.js 20.19 o superior (o 22.12+).

```bash
npm install
npm run dev
```

Abrí http://localhost:5173. La app siempre usa ese puerto: el progreso de lectura se guarda en el navegador y es distinto para cada dirección, así que si el puerto está ocupado, cerrá la otra app en lugar de cambiarlo.

Para verla en el celular, conectado a la misma red Wi-Fi:

```bash
npm run dev -- --host
```

y abrí desde el teléfono la dirección `Network` que aparece en la terminal. El celular lleva su propio progreso.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga instantánea. |
| `npm run build` | Chequeo de tipos y build de producción en `dist/`. |
| `npm run preview` | Sirve el build de `dist/`. |
| `npm run lint` | Revisa el código con oxlint. |
| `npm run pdf` | Build + genera el PDF de cada guía en `docs/` (`npm run pdf -- react` para una sola). |

## Los PDF

Cada guía tiene su PDF en `docs/`, con páginas de 104 × 185 mm (proporción de celular), índice con links a cada capítulo y marcadores para navegar desde el lector de PDF. Las demos no se pueden tocar en el PDF, pero todo el código está.

Para regenerarlo después de cambiar algo:

```bash
npx playwright install chromium   # solo la primera vez: descarga el navegador
npm run pdf
```

El script (`scripts/export-pdf.mjs`) abre cada guía con `?print=<guía>` (por ejemplo `?print=react`) en un Chromium automático y la imprime. Esa misma versión imprimible está en el link **Versión imprimible** de la app, por si preferís usar Imprimir → Guardar como PDF del navegador.

## Estructura

```text
src/
  guides/        Una guía por archivo (índice: partes, capítulos, títulos) + el registro en index.ts
  content/       Los capítulos en MDX (Markdown + JSX): una carpeta por guía y una por parte
  demos/         Una carpeta por parte y un archivo por demo: el código para practicar
  components/    Home, layout, bloques de código, <Demo>, recuadros y la versión imprimible
  lib/           Rutas, progreso de lectura, lectura de los archivos fuente, tema, modo impresión
  App.tsx        Router mínimo con el hash de la URL (#/guía/capítulo) y <ViewTransition> entre páginas
scripts/
  export-pdf.mjs Genera los PDF
docs/            Un PDF por guía
vite.config.ts   Vite con MDX y el React Compiler en modo "annotation"
```

## Agregar una demo o un capítulo

1. Creá la demo en `src/demos/<parte>/MiDemo.tsx`, con un `export default` del componente.
2. Usala en el capítulo:

   ```mdx
   <Demo file="hooks/MiDemo" title="Qué muestra" highlight="5,8-12" />
   ```

   `highlight` resalta líneas del archivo. Con `extra={['hooks/otro-archivo.ts']}` se muestran más archivos en pestañas.

3. Para un capítulo nuevo, creá el `.mdx` en `src/content/<guía>/` y agregalo en el índice de la guía (`src/guides/<guía>.ts`).

Para una guía nueva, creá `src/guides/<guía>.ts` con su `GuideDef` y sumala a la lista `guides` de `src/guides/index.ts`. Los links entre capítulos del MDX (`[texto](#/slug)`) apuntan a la misma guía; para ir a otra, usá `#/<guía>/<slug>`.

## Versiones

Escrita en octubre de 2026 con React 19.3, Vite 8, TypeScript 7 y React Compiler 1.0.
