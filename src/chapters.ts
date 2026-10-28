import type { MDXContent } from 'mdx/types'

import Bienvenida from './content/00-empeza-aca/bienvenida.mdx'
import QueCambio from './content/00-empeza-aca/que-cambio.mdx'
import ComponentesYProps from './content/01-fundamentos/componentes-y-props.mdx'
import UseState from './content/01-fundamentos/use-state.mdx'
import PensarEnReact from './content/01-fundamentos/pensar-en-react.mdx'
import UseEffect from './content/02-hooks/use-effect.mdx'
import UseRef from './content/02-hooks/use-ref.mdx'
import UseContext from './content/02-hooks/use-context.mdx'
import UseReducer from './content/02-hooks/use-reducer.mdx'
import CustomHooks from './content/02-hooks/custom-hooks.mdx'
import Rendimiento from './content/02-hooks/rendimiento.mdx'
import Transiciones from './content/02-hooks/transiciones.mdx'
import SuspenseYErrores from './content/02-hooks/suspense-y-errores.mdx'
import OtrosHooks from './content/02-hooks/otros-hooks.mdx'
import Actions from './content/03-react-19/actions.mdx'
import UseActionState from './content/03-react-19/use-action-state.mdx'
import Formularios from './content/03-react-19/formularios.mdx'
import UseOptimistic from './content/03-react-19/use-optimistic.mdx'
import Use from './content/03-react-19/use.mdx'
import RefsYContext from './content/03-react-19/refs-y-context.mdx'
import Metadatos from './content/03-react-19/metadatos.mdx'
import Migracion from './content/03-react-19/migracion.mdx'
import ActivityChapter from './content/04-novedades/activity.mdx'
import UseEffectEvent from './content/04-novedades/use-effect-event.mdx'
import ViewTransitionChapter from './content/04-novedades/view-transition.mdx'
import FragmentRefs from './content/04-novedades/fragment-refs.mdx'
import ReactCompiler from './content/04-novedades/react-compiler.mdx'
import OtrasNovedades from './content/04-novedades/otras-novedades.mdx'
import ServerComponents from './content/05-next/server-components.mdx'
import ServerFunctions from './content/05-next/server-functions.mdx'
import Chuleta from './content/05-next/chuleta.mdx'

type ChapterDef = {
  slug: string
  title: string
  summary: string
  /** Versión de React donde apareció lo que explica el capítulo. */
  since?: string
  /** El capítulo renderiza su propio <title> (ver capítulo de metadatos). */
  ownsTitle?: boolean
  Content: MDXContent
}

type PartDef = { id: string; title: string; intro: string; chapters: ChapterDef[] }

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Cómo está armada la guía y qué cambió en React mientras trabajabas con código legacy.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'Cómo correr el proyecto, dónde está cada demo y cómo aprovecharla.',
        Content: Bienvenida,
      },
      {
        slug: 'que-cambio',
        title: 'Qué cambió desde el React "legacy"',
        summary: 'De las clases al React Compiler: la línea de tiempo y los cambios de mentalidad.',
        Content: QueCambio,
      },
    ],
  },
  {
    id: 'fundamentos',
    title: 'Parte 1 · Fundamentos',
    intro: 'Repaso rápido de lo que no cambió: componentes, props, estado y cómo pensar en React.',
    chapters: [
      {
        slug: 'componentes-y-props',
        title: 'Componentes, JSX y props',
        summary: 'Funciones que devuelven UI, props, children, condicionales y listas con key.',
        Content: ComponentesYProps,
      },
      {
        slug: 'use-state',
        title: 'Estado con useState',
        summary: 'El estado como foto, la función actualizadora e inmutabilidad en objetos y arrays.',
        Content: UseState,
      },
      {
        slug: 'pensar-en-react',
        title: 'Estado derivado y levantar el estado',
        summary: 'Guardar lo mínimo, calcular el resto y compartir estado entre componentes.',
        Content: PensarEnReact,
      },
    ],
  },
  {
    id: 'hooks',
    title: 'Parte 2 · Hooks a fondo',
    intro: 'Todos los hooks que vas a usar en el día a día, con sus trampas más comunes.',
    chapters: [
      {
        slug: 'use-effect',
        title: 'useEffect: sincronizar con el exterior',
        summary: 'Dependencias, cleanup, StrictMode, fetch sin race conditions y cuándo NO usarlo.',
        Content: UseEffect,
      },
      {
        slug: 'use-ref',
        title: 'useRef: el DOM y valores que no renderizan',
        summary: 'Acceder a nodos del DOM y guardar valores que no deben provocar renders.',
        Content: UseRef,
      },
      {
        slug: 'use-context',
        title: 'useContext: datos sin prop drilling',
        summary: 'Compartir datos con todo un subárbol sin pasar props nivel por nivel.',
        Content: UseContext,
      },
      {
        slug: 'use-reducer',
        title: 'useReducer: lógica de estado compleja',
        summary: 'Centralizar las transiciones de estado en una función pura.',
        Content: UseReducer,
      },
      {
        slug: 'custom-hooks',
        title: 'Custom hooks',
        summary: 'Extraer y reutilizar lógica con estado: useDebounce, useLocalStorage y más.',
        Content: CustomHooks,
      },
      {
        slug: 'rendimiento',
        title: 'memo, useMemo y useCallback',
        summary: 'Cuándo React vuelve a renderizar y cómo evitarlo (y por qué el Compiler lo cambia todo).',
        Content: Rendimiento,
      },
      {
        slug: 'transiciones',
        title: 'useTransition y useDeferredValue',
        summary: 'Actualizaciones urgentes y no urgentes para que la UI nunca se trabe.',
        Content: Transiciones,
      },
      {
        slug: 'suspense-y-errores',
        title: 'Suspense, lazy y Error Boundaries',
        summary: 'Estados de carga declarativos, code splitting y cómo atrapar errores de render.',
        Content: SuspenseYErrores,
      },
      {
        slug: 'otros-hooks',
        title: 'useId, useLayoutEffect, portales y más',
        summary: 'Los hooks menos frecuentes que igual conviene conocer.',
        Content: OtrosHooks,
      },
    ],
  },
  {
    id: 'react-19',
    title: 'Parte 3 · React 19 a fondo',
    intro: 'Actions, formularios, estado optimista, use() y todos los cambios de React 19.',
    chapters: [
      {
        slug: 'actions',
        title: 'Actions: la gran idea de React 19',
        summary: 'Transiciones async que manejan pending, errores y formularios por vos.',
        since: '19.0',
        Content: Actions,
      },
      {
        slug: 'use-action-state',
        title: 'useActionState',
        summary: 'Estado que se actualiza con el resultado de una Action: ideal para formularios.',
        since: '19.0',
        Content: UseActionState,
      },
      {
        slug: 'formularios',
        title: 'Formularios con action y useFormStatus',
        summary: '<form action={fn}>, FormData, reset automático y botones que saben si se está enviando.',
        since: '19.0',
        Content: Formularios,
      },
      {
        slug: 'use-optimistic',
        title: 'useOptimistic',
        summary: 'Mostrar el resultado al instante mientras la Action termina en segundo plano.',
        since: '19.0',
        Content: UseOptimistic,
      },
      {
        slug: 'use',
        title: 'use(): promesas y contexto',
        summary: 'Leer una promesa con Suspense y leer contexto incluso dentro de un if.',
        since: '19.0',
        Content: Use,
      },
      {
        slug: 'refs-y-context',
        title: 'ref como prop y <Context> como provider',
        summary: 'Adiós forwardRef y .Provider, y los refs con función de limpieza.',
        since: '19.0',
        Content: RefsYContext,
      },
      {
        slug: 'metadatos',
        title: 'Metadatos, estilos y recursos',
        summary: '<title> y <meta> desde cualquier componente, hojas de estilo y precarga de recursos.',
        since: '19.0',
        ownsTitle: true,
        Content: Metadatos,
      },
      {
        slug: 'migracion',
        title: 'Errores y migración desde código legacy',
        summary: 'Mejor reporte de errores, APIs eliminadas y cómo migrar un proyecto viejo.',
        since: '19.0',
        Content: Migracion,
      },
    ],
  },
  {
    id: 'novedades',
    title: 'Parte 4 · React 19.1 → 19.3 y el Compiler',
    intro: 'Lo que llegó después de React 19: Activity, useEffectEvent, View Transitions, Fragment refs y el React Compiler.',
    chapters: [
      {
        slug: 'activity',
        title: '<Activity>',
        summary: 'Ocultar partes de la UI sin perder su estado.',
        since: '19.2',
        Content: ActivityChapter,
      },
      {
        slug: 'use-effect-event',
        title: 'useEffectEvent',
        summary: 'Leer el valor más reciente dentro de un Effect sin volver a ejecutarlo.',
        since: '19.2',
        Content: UseEffectEvent,
      },
      {
        slug: 'view-transition',
        title: '<ViewTransition> y addTransitionType',
        summary: 'Animaciones de entrada, salida y reordenamiento con la View Transitions API.',
        since: '19.3',
        Content: ViewTransitionChapter,
      },
      {
        slug: 'fragment-refs',
        title: 'Fragment refs',
        summary: 'Eventos, foco y observers sobre un grupo de elementos sin un div envoltorio.',
        since: '19.3',
        Content: FragmentRefs,
      },
      {
        slug: 'react-compiler',
        title: 'React Compiler',
        summary: 'Memoización automática en tiempo de build: menos useMemo, menos useCallback.',
        since: 'Compiler 1.0',
        Content: ReactCompiler,
      },
      {
        slug: 'otras-novedades',
        title: 'Otras novedades de 19.1 a 19.3',
        summary: 'Owner Stack, Performance Tracks, prerender parcial, browser() y más.',
        since: '19.1+',
        Content: OtrasNovedades,
      },
    ],
  },
  {
    id: 'next',
    title: 'Parte 5 · Puente a Next.js',
    intro: 'Lo que no se puede correr en Vite pero vas a usar todos los días en Next.js, más una chuleta final.',
    chapters: [
      {
        slug: 'server-components',
        title: 'Server Components',
        summary: 'Componentes que corren en el servidor, async, sin JavaScript en el navegador.',
        since: '19.0',
        Content: ServerComponents,
      },
      {
        slug: 'server-functions',
        title: 'Server Functions y formularios',
        summary: '"use server", formularios que funcionan sin JavaScript y cómo validar en el servidor.',
        since: '19.0',
        Content: ServerFunctions,
      },
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'De clases a hooks, qué hook usar para cada caso y respuestas cortas para entrevistas.',
        Content: Chuleta,
      },
    ],
  },
]

export type Part = Omit<PartDef, 'chapters'> & { chapters: Chapter[] }
export type Chapter = ChapterDef & { index: number; part: PartDef }

let index = 0
export const parts: Part[] = partDefs.map((part) => ({
  ...part,
  chapters: part.chapters.map((chapter) => ({ ...chapter, index: index++, part })),
}))

export const chapters: Chapter[] = parts.flatMap((part) => part.chapters)

export function findChapter(slug: string) {
  return chapters.find((chapter) => chapter.slug === slug)
}
