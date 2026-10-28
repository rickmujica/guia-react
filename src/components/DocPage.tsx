import type { Chapter } from '../chapters'
import { chapters } from '../chapters'
import { Version } from './Callouts'
import { mdxComponents } from '../lib/mdxComponents'

export function DocPage({ chapter }: { chapter: Chapter }) {
  const { Content } = chapter
  const prev = chapters[chapter.index - 1]
  const next = chapters[chapter.index + 1]

  return (
    <article className="doc">
      {/* React 19: <title> se puede renderizar en cualquier componente y React lo sube al <head>. */}
      {!chapter.ownsTitle && <title>{`${chapter.title} · Guía de React moderno`}</title>}

      <header className="doc-header">
        <p className="doc-eyebrow">
          {chapter.part.title} · Capítulo {chapter.index + 1}
        </p>
        <h1>{chapter.title}</h1>
        {chapter.since && <Version v={chapter.since} />}
        <p className="doc-summary">{chapter.summary}</p>
      </header>

      <Content components={mdxComponents} />

      <nav className="prev-next" aria-label="Capítulos">
        {prev ? (
          <a href={`#/${prev.slug}`} className="prev-next-link">
            <span>← Anterior</span>
            {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={`#/${next.slug}`} className="prev-next-link prev-next-link--next">
            <span>Siguiente →</span>
            {next.title}
          </a>
        )}
      </nav>
    </article>
  )
}
