import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/typescript/00-empeza-aca/bienvenida.mdx'
import TiposBasicos from '../content/typescript/01-lenguaje/tipos-basicos.mdx'
import Objetos from '../content/typescript/01-lenguaje/objetos.mdx'
import UnionesYNarrowing from '../content/typescript/01-lenguaje/uniones-y-narrowing.mdx'
import Funciones from '../content/typescript/01-lenguaje/funciones.mdx'
import Genericos from '../content/typescript/01-lenguaje/genericos.mdx'
import UtilityTypes from '../content/typescript/01-lenguaje/utility-types.mdx'
import ModulosYConfig from '../content/typescript/01-lenguaje/modulos-y-config.mdx'
import Props from '../content/typescript/02-react/props.mdx'
import EstadoYEventos from '../content/typescript/02-react/estado-y-eventos.mdx'
import Refs from '../content/typescript/02-react/refs.mdx'
import ContextReducerHooks from '../content/typescript/02-react/context-reducer-hooks.mdx'
import ComponentesGenericos from '../content/typescript/02-react/componentes-genericos.mdx'
import React19 from '../content/typescript/02-react/react-19.mdx'
import DatosDeApis from '../content/typescript/02-react/datos-de-apis.mdx'
import Chuleta from '../content/typescript/03-repaso/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Cómo está armada la guía y por qué cada ejemplo está chequeado por el compilador.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'Qué cubre, cómo se chequean los ejemplos y la configuración del proyecto.',
        Content: Bienvenida,
      },
    ],
  },
  {
    id: 'lenguaje',
    title: 'Parte 1 · El lenguaje',
    intro: 'Lo que hay que saber de TypeScript para escribir React con soltura, sin teoría de más.',
    chapters: [
      {
        slug: 'tipos-basicos',
        title: 'Tipos básicos e inferencia',
        summary: 'Primitivos, arrays, tuplas, any, unknown, never y cuándo anotar.',
        Content: TiposBasicos,
      },
      {
        slug: 'objetos',
        title: 'Objetos: type e interface',
        summary: 'Opcionales, readonly, extender tipos, Record y la eterna pregunta: ¿type o interface?',
        Content: Objetos,
      },
      {
        slug: 'uniones-y-narrowing',
        title: 'Uniones y narrowing',
        summary: 'Uniones discriminadas, chequeos exhaustivos, type predicates y satisfies.',
        Content: UnionesYNarrowing,
      },
      {
        slug: 'funciones',
        title: 'Funciones',
        summary: 'Parámetros, retorno, callbacks, tipos de función, sobrecargas y void.',
        Content: Funciones,
      },
      {
        slug: 'genericos',
        title: 'Genéricos',
        summary: 'Funciones y tipos que sirven para cualquier tipo sin perder información.',
        Content: Genericos,
      },
      {
        slug: 'utility-types',
        title: 'Utility types y tipos calculados',
        summary: 'Partial, Pick, Omit, ReturnType, keyof, typeof, mapped y conditional types.',
        Content: UtilityTypes,
      },
      {
        slug: 'modulos-y-config',
        title: 'Módulos, tsconfig y declaraciones',
        summary: 'import type, por qué no enum, las opciones del tsconfig y los archivos .d.ts.',
        Content: ModulosYConfig,
      },
    ],
  },
  {
    id: 'react',
    title: 'Parte 2 · TypeScript en React',
    intro: 'Cómo se tipa cada pieza de una app de React, de las props a las APIs de React 19.',
    chapters: [
      {
        slug: 'props',
        title: 'Componentes y props',
        summary: 'Props, children, ReactNode, extender elementos nativos y props discriminadas.',
        Content: Props,
      },
      {
        slug: 'estado-y-eventos',
        title: 'Estado y eventos',
        summary: 'useState con y sin genérico, tipos de eventos y un formulario tipado.',
        Content: EstadoYEventos,
      },
      {
        slug: 'refs',
        title: 'Refs y el DOM',
        summary: 'useRef para nodos y valores, ref como prop y useImperativeHandle.',
        Content: Refs,
      },
      {
        slug: 'context-reducer-hooks',
        title: 'Context, useReducer y custom hooks',
        summary: 'Context sin valores falsos, acciones tipadas y hooks que devuelven tuplas.',
        Content: ContextReducerHooks,
      },
      {
        slug: 'componentes-genericos',
        title: 'Componentes genéricos y patrones de props',
        summary: 'Listas y selects que sirven para cualquier tipo, render props y slots.',
        Content: ComponentesGenericos,
      },
      {
        slug: 'react-19',
        title: 'React 19 con TypeScript',
        since: 'React 19',
        summary: 'Los tipos de useActionState, useOptimistic y use, y los cambios que rompen código viejo.',
        Content: React19,
      },
      {
        slug: 'datos-de-apis',
        title: 'Datos de APIs: unknown y Zod',
        summary: 'Por qué as no alcanza y cómo validar en el borde con un esquema que también es el tipo.',
        Content: DatosDeApis,
      },
    ],
  },
  {
    id: 'repaso',
    title: 'Parte 3 · Repaso',
    intro: 'Todo en una página y las preguntas que te pueden hacer en una entrevista.',
    chapters: [
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'Los patrones de la guía en snippets cortos y respuestas para entrevistas.',
        Content: Chuleta,
      },
    ],
  },
]

export const typescriptGuide: GuideDef = {
  id: 'typescript',
  title: 'TypeScript para React',
  description: 'El lenguaje justo y necesario, y cómo tipar props, estado, eventos, refs, context, hooks y APIs.',
  badge: 'TypeScript 7',
  icon: 'TS',
  color: '#3178c6',
  pdf: 'guia-typescript-react.pdf',
  parts: partDefs,
}
