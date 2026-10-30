import { findChapter, findGuide, guides, type Chapter } from '../guides'

// Rutas con el hash de la URL:
//   #/                     → la home con todas las guías
//   #/react                → primer capítulo de la guía de React
//   #/react/use-state      → un capítulo
//   #/use-state            → links viejos (de antes de que hubiera varias guías): guía de React
export type Route = { kind: 'home' } | { kind: 'chapter'; chapter: Chapter }

export function readRoute(hash = window.location.hash): Route {
  const [first = '', second = ''] = hash.replace(/^#\/?/, '').split('/')
  if (!first) return { kind: 'home' }

  const guide = findGuide(first)
  if (guide) {
    return { kind: 'chapter', chapter: findChapter(guide, second) ?? guide.chapters[0] }
  }

  const legacy = findChapter(guides[0], first)
  return legacy ? { kind: 'chapter', chapter: legacy } : { kind: 'home' }
}

export function chapterHref(chapter: Pick<Chapter, 'slug' | 'guide'>) {
  return `#/${chapter.guide.id}/${chapter.slug}`
}
