import { estadoGuide } from './estado'
import { reactGuide } from './react'
import { typescriptGuide } from './typescript'
import type { Chapter, Guide, GuideDef, UpcomingGuide } from './types'

// Arma la guía con los datos que se calculan: número de capítulo y referencias a la parte y la guía.
function buildGuide(def: GuideDef): Guide {
  const guide: Guide = { ...def, parts: [], chapters: [] }
  let index = 0
  guide.parts = def.parts.map((part) => ({
    ...part,
    chapters: part.chapters.map((chapter) => ({ ...chapter, index: index++, part, guide })),
  }))
  guide.chapters = guide.parts.flatMap((part) => part.chapters)
  return guide
}

export const guides: Guide[] = [reactGuide, typescriptGuide, estadoGuide].map(buildGuide)

// Las que todavía no están escritas se muestran en la home como "próximamente".
export const upcomingGuides: UpcomingGuide[] = [
  {
    id: 'typescript',
    title: 'TypeScript para React',
    description: 'Tipos, genéricos, utility types y todo lo que vas a escribir en un proyecto de React con TS.',
    icon: 'TS',
    color: '#3178c6',
  },
  {
    id: 'estado',
    title: 'Redux, Redux Toolkit, Saga y Zustand',
    description: 'Manejo de estado global: del Redux clásico a Redux Toolkit, efectos con Saga y la alternativa liviana.',
    icon: 'RX',
    color: '#764abc',
  },
  {
    id: 'mysql',
    title: 'MySQL',
    description: 'Bases de datos relacionales desde cero: consultas, joins, índices, transacciones y más.',
    icon: 'SQL',
    color: '#00758f',
  },
  {
    id: 'node',
    title: 'Node.js y Express',
    description: 'JavaScript en el servidor: módulos, async, APIs REST con Express, middlewares y validación.',
    icon: 'JS',
    color: '#3c873a',
  },
].filter((upcoming) => !guides.some((guide) => guide.id === upcoming.id))

export function findGuide(id: string) {
  return guides.find((guide) => guide.id === id)
}

export function findChapter(guide: Guide, slug: string): Chapter | undefined {
  return guide.chapters.find((chapter) => chapter.slug === slug)
}

export type { Chapter, Guide, Part } from './types'
