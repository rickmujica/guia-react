import { parts } from '../chapters'

export function Sidebar({ current, open }: { current: string; open: boolean }) {
  return (
    <nav className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Índice">
      {parts.map((part) => (
        <div key={part.id} className="sidebar-part">
          <p className="sidebar-part-title">{part.title}</p>
          <ul>
            {part.chapters.map((chapter) => (
              <li key={chapter.slug}>
                <a
                  href={`#/${chapter.slug}`}
                  className={`sidebar-link${chapter.slug === current ? ' sidebar-link--active' : ''}`}
                  aria-current={chapter.slug === current ? 'page' : undefined}
                >
                  <span className="sidebar-num">{chapter.index + 1}</span>
                  <span className="sidebar-text">{chapter.title}</span>
                  {chapter.since && <span className="sidebar-since">{chapter.since}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
