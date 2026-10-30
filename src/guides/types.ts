import type { MDXContent } from 'mdx/types'

export type ChapterDef = {
  slug: string
  title: string
  summary: string
  /** Versión donde apareció lo que explica el capítulo (por ejemplo, de React). */
  since?: string
  /** El capítulo renderiza su propio <title> (ver capítulo de metadatos de React). */
  ownsTitle?: boolean
  Content: MDXContent
}

export type PartDef = { id: string; title: string; intro: string; chapters: ChapterDef[] }

export type GuideDef = {
  /** Va en la URL: #/<id>/<capítulo> */
  id: string
  title: string
  description: string
  /** Etiqueta corta que se muestra en la barra superior, por ejemplo "React 19.3". */
  badge: string
  /** Texto corto del ícono de la tarjeta (un emoji o dos letras). */
  icon: string
  color: string
  /** Nombre del PDF que genera `npm run pdf` dentro de docs/. */
  pdf: string
  parts: PartDef[]
}

/** Una guía que todavía no está escrita: aparece en la home como "próximamente". */
export type UpcomingGuide = Pick<GuideDef, 'id' | 'title' | 'description' | 'icon' | 'color'>

export type Chapter = ChapterDef & { index: number; part: PartDef; guide: Guide }
export type Part = Omit<PartDef, 'chapters'> & { chapters: Chapter[] }
export type Guide = Omit<GuideDef, 'parts'> & { parts: Part[]; chapters: Chapter[] }
