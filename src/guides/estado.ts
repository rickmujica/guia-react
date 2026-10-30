import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/estado/00-empeza-aca/bienvenida.mdx'
import Conceptos from '../content/estado/01-redux/conceptos.mdx'
import ReactRedux from '../content/estado/01-redux/react-redux.mdx'
import MiddlewareYThunks from '../content/estado/01-redux/middleware-y-thunks.mdx'
import Slices from '../content/estado/02-toolkit/slices.mdx'
import Async from '../content/estado/02-toolkit/async.mdx'
import RtkQuery from '../content/estado/02-toolkit/rtk-query.mdx'
import Sagas from '../content/estado/03-saga/sagas.mdx'
import Patrones from '../content/estado/03-saga/patrones.mdx'
import Zustand from '../content/estado/04-zustand/zustand.mdx'
import Comparacion from '../content/estado/05-comparar/comparacion.mdx'
import Chuleta from '../content/estado/05-comparar/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Qué estado necesita una librería (y cuál no) y cómo está armada la guía.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'Estado local, compartido, del servidor y global: qué herramienta va con cada uno.',
        Content: Bienvenida,
      },
    ],
  },
  {
    id: 'redux',
    title: 'Parte 1 · Redux clásico',
    intro: 'Los conceptos de Redux y cómo se escribía antes de Redux Toolkit: lo que vas a ver en código legacy.',
    chapters: [
      {
        slug: 'conceptos',
        title: 'Store, acciones y reducers',
        summary: 'Las tres ideas de Redux con un store sin React: dispatch, reducer y subscribe.',
        Content: Conceptos,
      },
      {
        slug: 'react-redux',
        title: 'React Redux: hooks y connect',
        summary: 'Provider, useSelector, useDispatch, selectores memorizados y connect().',
        Content: ReactRedux,
      },
      {
        slug: 'middleware-y-thunks',
        title: 'Middleware y thunks',
        summary: 'Dónde va lo async en Redux, un logger a mano y el problema del boilerplate.',
        Content: MiddlewareYThunks,
      },
    ],
  },
  {
    id: 'toolkit',
    title: 'Parte 2 · Redux Toolkit',
    intro: 'La forma oficial de escribir Redux: slices, thunks generados y RTK Query para los datos del servidor.',
    chapters: [
      {
        slug: 'slices',
        title: 'configureStore y createSlice',
        summary: 'El mismo Redux con mucho menos código: slices, Immer y tipos que salen del store.',
        Content: Slices,
      },
      {
        slug: 'async',
        title: 'createAsyncThunk y compañía',
        summary: 'pending, fulfilled y rejected generados, unwrap, entity adapter y listener middleware.',
        Content: Async,
      },
      {
        slug: 'rtk-query',
        title: 'RTK Query',
        summary: 'Fetching y caché: queries, mutations, tags e invalidación. Comparado con TanStack Query.',
        Content: RtkQuery,
      },
    ],
  },
  {
    id: 'saga',
    title: 'Parte 3 · Redux Saga',
    intro: 'Efectos async con generadores: cancelación, carreras, procesos de fondo y tests sin mocks.',
    chapters: [
      {
        slug: 'sagas',
        title: 'Generadores y efectos',
        summary: 'call, put, take, takeEvery y takeLatest, con un buscador con debounce y cancelación.',
        Content: Sagas,
      },
      {
        slug: 'patrones',
        title: 'Patrones: race, fork y cancel',
        summary: 'Timeout, polling, manejo de errores, testing y cuándo usar Saga hoy.',
        Content: Patrones,
      },
    ],
  },
  {
    id: 'zustand',
    title: 'Parte 4 · Zustand',
    intro: 'Un store global en un hook, sin Provider ni boilerplate.',
    chapters: [
      {
        slug: 'zustand',
        title: 'Zustand',
        summary: 'create, set y get, selectores, useShallow, persist y cómo organizar un store grande.',
        Content: Zustand,
      },
    ],
  },
  {
    id: 'comparar',
    title: 'Parte 5 · Comparar y decidir',
    intro: 'La misma feature con las cuatro herramientas, una tabla para decidir y la chuleta.',
    chapters: [
      {
        slug: 'comparacion',
        title: 'Las cuatro, lado a lado',
        summary: 'La misma feature en Redux, Redux Toolkit, Saga y Zustand, cómo elegir y cómo migrar.',
        Content: Comparacion,
      },
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'Las APIs de las cuatro librerías en snippets cortos y respuestas para entrevistas.',
        Content: Chuleta,
      },
    ],
  },
]

export const estadoGuide: GuideDef = {
  id: 'estado',
  title: 'Redux, Redux Toolkit, Saga y Zustand',
  description: 'Estado global de punta a punta: Redux clásico, Redux Toolkit con RTK Query, Redux Saga y Zustand, comparados.',
  badge: 'RTK 2 · Zustand 5',
  icon: 'RX',
  color: '#764abc',
  pdf: 'guia-estado-global.pdf',
  parts: partDefs,
}
