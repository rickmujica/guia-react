import { startTransition, useEffect, useLayoutEffect, useState, ViewTransition } from 'react'
import { chapters, findChapter } from './chapters'
import { DocPage } from './components/DocPage'
import { PrintBook } from './components/PrintBook'
import { Sidebar } from './components/Sidebar'
import { IS_PRINT } from './lib/print'

function readSlug() {
  return window.location.hash.replace(/^#\/?/, '')
}

export default function App() {
  return IS_PRINT ? <PrintBook /> : <Docs />
}

function Docs() {
  const [slug, setSlug] = useState(readSlug)
  const [menuOpen, setMenuOpen] = useState(false)
  const chapter = findChapter(slug) ?? chapters[0]

  // Router mínimo con el hash de la URL (#/use-state).
  useEffect(() => {
    function onHashChange() {
      setMenuOpen(false)
      // El cambio de capítulo es una Transition: así se activa <ViewTransition>.
      startTransition(() => setSlug(readSlug()))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [chapter.slug])

  return (
    <div className="layout">
      <header className="topbar">
        <button
          type="button"
          className="menu-button"
          aria-label="Abrir índice"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
        <a href="#/" className="brand">
          <span className="brand-logo" aria-hidden="true">⚛</span>
          Guía de React moderno
        </a>
        <span className="topbar-versions">React 19.3 · Vite 8</span>
        <a className="topbar-print" href="?print" target="_blank" rel="noreferrer">
          Versión imprimible
        </a>
      </header>

      <Sidebar current={chapter.slug} open={menuOpen} />
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="main">
        {/* Cada capítulo entra y sale con una animación (React 19.3). default="none"
            evita que se anime la página entera cuando una demo interna cambia. */}
        <ViewTransition key={chapter.slug} enter="page-enter" exit="page-exit" default="none">
          <DocPage chapter={chapter} />
        </ViewTransition>
      </main>
    </div>
  )
}
