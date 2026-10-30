import type { Chapter } from '../guides'
import { GuideContext } from '../lib/guideContext'
import { mdxComponents } from '../lib/mdxComponents'
import { guideProgress, setCompleted, useProgress } from '../lib/progress'
import { chapterHref } from '../lib/route'
import { Version } from './Callouts'

export function DocPage({ chapter }: { chapter: Chapter }) {
  const { Content, guide } = chapter
  const prev = guide.chapters[chapter.index - 1]
  const next = guide.chapters[chapter.index + 1]
  const completed = guideProgress(useProgress(), guide.id).completed
  const done = completed.includes(chapter.slug)

  // Pasar al capítulo siguiente cuenta como haber terminado este.
  function markDone() {
    if (!done) setCompleted(guide.id, chapter.slug, true)
  }

  return (
    <GuideContext value={guide}>
      <article className="doc">
        {/* React 19: <title> se puede renderizar en cualquier componente y React lo sube al <head>. */}
        {!chapter.ownsTitle && <title>{`${chapter.title} · Guía de ${guide.title}`}</title>}

        <header className="doc-header">
          <p className="doc-eyebrow">
            {chapter.part.title} · Capítulo {chapter.index + 1}
          </p>
          <h1>{chapter.title}</h1>
          {chapter.since && <Version v={chapter.since} />}
          <p className="doc-summary">{chapter.summary}</p>
        </header>

        <Content components={mdxComponents} />

        <div className="doc-done">
          <button
            type="button"
            className={`done-button${done ? ' done-button--on' : ''}`}
            aria-pressed={done}
            onClick={() => setCompleted(guide.id, chapter.slug, !done)}
          >
            {done ? '✓ Leído' : 'Marcar como leído'}
          </button>
          <span className="doc-done-count">
            {completed.length} de {guide.chapters.length} capítulos leídos
          </span>
        </div>

        <nav className="prev-next" aria-label="Capítulos">
          {prev ? (
            <a href={chapterHref(prev)} className="prev-next-link">
              <span>← Anterior</span>
              {prev.title}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={chapterHref(next)} className="prev-next-link prev-next-link--next" onClick={markDone}>
              <span>Siguiente →</span>
              {next.title}
            </a>
          ) : (
            <a href="#/" className="prev-next-link prev-next-link--next" onClick={markDone}>
              <span>Terminaste la guía →</span>
              Volver a todas las guías
            </a>
          )}
        </nav>
      </article>
    </GuideContext>
  )
}
