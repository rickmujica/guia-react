import type { Chapter } from '../guides'
import { guideProgress, useProgress } from '../lib/progress'
import { chapterHref } from '../lib/route'
import { ProgressBar } from './ProgressBar'

export function Sidebar({ chapter: current, open }: { chapter: Chapter; open: boolean }) {
  const { guide } = current
  const completed = guideProgress(useProgress(), guide.id).completed

  return (
    <nav className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Índice">
      <a href="#/" className="sidebar-back">
        ← Todas las guías
      </a>
      <div className="sidebar-guide">
        <p className="sidebar-guide-title">{guide.title}</p>
        <ProgressBar done={completed.length} total={guide.chapters.length} color={guide.color} />
      </div>

      {guide.parts.map((part) => (
        <div key={part.id} className="sidebar-part">
          <p className="sidebar-part-title">{part.title}</p>
          <ul>
            {part.chapters.map((chapter) => {
              const active = chapter.slug === current.slug
              const done = completed.includes(chapter.slug)
              return (
                <li key={chapter.slug}>
                  <a
                    href={chapterHref(chapter)}
                    className={`sidebar-link${active ? ' sidebar-link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={`sidebar-num${done ? ' sidebar-num--done' : ''}`}>
                      {done ? <span aria-label="Leído">✓</span> : chapter.index + 1}
                    </span>
                    <span className="sidebar-text">{chapter.title}</span>
                    {chapter.since && <span className="sidebar-since">{chapter.since}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
