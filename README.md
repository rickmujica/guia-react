# Guía de React moderno

Una guía interactiva para repasar React y aprender a fondo React 19 (hasta 19.3), el React Compiler y lo que hace falta para pasar a Next.js.

Es una app de Vite con aspecto de documentación: cada capítulo explica un tema, muestra una **demo funcionando** y, debajo, el **código fuente real** de esa demo. El snippet que ves en la página es el mismo archivo de `src/demos/` que se está ejecutando, así que podés leerlo en la guía o en tu editor, y si lo cambiás, cambian los dos.

También viene en PDF para leer en el celular: [`docs/guia-react-moderno.pdf`](docs/guia-react-moderno.pdf).

## Contenido

| Parte | Capítulos |
| --- | --- |
| Empezá acá | Cómo usar la guía · Qué cambió desde el React "legacy" |
| 1 · Fundamentos | Componentes, JSX y props · useState · Estado derivado y levantar el estado |
| 2 · Hooks a fondo | useEffect · useRef · useContext · useReducer · Custom hooks · memo, useMemo y useCallback · useTransition y useDeferredValue · Suspense, lazy y Error Boundaries · useId, useLayoutEffect, portales y más |
| 3 · React 19 a fondo | Actions · useActionState · Formularios con action y useFormStatus · useOptimistic · use() · ref como prop y `<Context>` · Metadatos · Errores y migración |
| 4 · React 19.1 → 19.3 | `<Activity>` · useEffectEvent · `<ViewTransition>` y addTransitionType · Fragment refs · React Compiler · Otras novedades |
| 5 · Puente a Next.js | Server Components · Server Functions y formularios · Chuleta y preguntas de entrevista |

## Cómo correrla

Necesitás Node.js 20.19 o superior (o 22.12+).

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (normalmente http://localhost:5173).

Para verla en el celular, conectado a la misma red Wi-Fi:

```bash
npm run dev -- --host
```

y abrí desde el teléfono la dirección `Network` que aparece en la terminal.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga instantánea. |
| `npm run build` | Chequeo de tipos y build de producción en `dist/`. |
| `npm run preview` | Sirve el build de `dist/`. |
| `npm run lint` | Revisa el código con oxlint. |
| `npm run pdf` | Build + genera `docs/guia-react-moderno.pdf`. |

## El PDF

`docs/guia-react-moderno.pdf` tiene páginas de 104 × 185 mm (proporción de celular), índice con links a cada capítulo y marcadores para navegar desde el lector de PDF. Las demos no se pueden tocar en el PDF, pero todo el código está.

Para regenerarlo después de cambiar algo:

```bash
npx playwright install chromium   # solo la primera vez: descarga el navegador
npm run pdf
```

El script (`scripts/export-pdf.mjs`) abre la guía con `?print` en un Chromium automático y la imprime. Esa misma versión imprimible está en el link **Versión imprimible** de la app, por si preferís usar Imprimir → Guardar como PDF del navegador.

## Estructura

```text
src/
  content/       Los capítulos en MDX (Markdown + JSX), una carpeta por parte
  demos/         Una carpeta por parte y un archivo por demo: el código para practicar
  components/    Layout, bloques de código, <Demo>, recuadros y la versión imprimible
  lib/           Utilidades: lectura de los archivos fuente, tema claro/oscuro, modo impresión
  chapters.ts    El índice: orden, títulos y versión de React de cada capítulo
  App.tsx        Router mínimo con el hash de la URL y <ViewTransition> entre capítulos
scripts/
  export-pdf.mjs Genera el PDF
docs/
  guia-react-moderno.pdf
vite.config.ts   Vite con MDX y el React Compiler en modo "annotation"
```

## Agregar una demo o un capítulo

1. Creá la demo en `src/demos/<parte>/MiDemo.tsx`, con un `export default` del componente.
2. Usala en el capítulo:

   ```mdx
   <Demo file="hooks/MiDemo" title="Qué muestra" highlight="5,8-12" />
   ```

   `highlight` resalta líneas del archivo. Con `extra={['hooks/otro-archivo.ts']}` se muestran más archivos en pestañas.

3. Para un capítulo nuevo, creá el `.mdx` en `src/content/` y agregalo en `src/chapters.ts`.

## Versiones

Escrita en octubre de 2026 con React 19.3, Vite 8, TypeScript 7 y React Compiler 1.0.
