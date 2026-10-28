import { chapters, parts } from '../chapters'
import { Version } from './Callouts'
import { mdxComponents } from '../lib/mdxComponents'

const today = new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })

// Versión "libro" de toda la guía, pensada para exportar a PDF (abrí la app con ?print).
export function PrintBook() {
  return (
    <div className="book">
      <section className="book-cover">
        <svg viewBox="-11.5 -10.23 23 20.46" className="book-logo" aria-hidden="true">
          <circle r="2.05" fill="currentColor" />
          <g stroke="currentColor" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
        <p className="book-kicker">Guía interactiva</p>
        <h1 className="book-title">React moderno</h1>
        <p className="book-subtitle">Repaso de hooks y React 19 a fondo, hasta React 19.3 y el React Compiler</p>
        <p className="book-meta">
          Versión PDF · {today}
          <br />
          {chapters.length} capítulos · Las demos interactivas están en la app (npm run dev)
        </p>
      </section>

      <nav className="book-toc" aria-label="Índice">
        <h1>Índice</h1>
        {parts.map((part) => (
          <div key={part.id} className="book-toc-part">
            <p className="book-toc-part-title">{part.title}</p>
            <ol start={part.chapters[0].index + 1}>
              {part.chapters.map((chapter) => (
                <li key={chapter.slug}>
                  <a href={`#cap-${chapter.slug}`}>{chapter.title}</a>
                  {chapter.since && <span className="book-toc-since"> · {chapter.since}</span>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </nav>

      {parts.map((part) => (
        <section key={part.id} className="book-part">
          <h1 className="book-part-title">{part.title}</h1>
          <p className="book-part-intro">{part.intro}</p>
          {part.chapters.map(({ slug, index, title, summary, since, Content }) => (
            <article key={slug} id={`cap-${slug}`} className="book-chapter doc">
              <header className="doc-header">
                <p className="doc-eyebrow">Capítulo {index + 1}</p>
                <h2 className="doc-title">{title}</h2>
                {since && <Version v={since} />}
                <p className="doc-summary">{summary}</p>
              </header>
              <Content components={mdxComponents} />
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}
