import { startTransition, useEffect, useLayoutEffect, useRef, useState, ViewTransition } from 'react'
import { DocPage } from './components/DocPage'
import { Home } from './components/Home'
import { PrintBook } from './components/PrintBook'
import { Sidebar } from './components/Sidebar'
import { findGuide, guides } from './guides'
import { IS_PRINT, PRINT_GUIDE } from './lib/print'
import { readScroll, saveScroll, takeResumeRequest, visitChapter } from './lib/progress'
import { readRoute } from './lib/route'

export default function App() {
  return IS_PRINT ? <PrintBook guide={findGuide(PRINT_GUIDE) ?? guides[0]} /> : <Docs />
}

function Docs() {
  const [route, setRoute] = useState(() => readRoute())
  const [menuOpen, setMenuOpen] = useState(false)
  const chapter = route.kind === 'chapter' ? route.chapter : null
  const pageKey = chapter ? `${chapter.guide.id}/${chapter.slug}` : 'home'

  // Router mínimo con el hash de la URL (#/react/use-state).
  useEffect(() => {
    function onHashChange() {
      setMenuOpen(false)
      // El cambio de página es una Transition: así se activa <ViewTransition>.
      startTransition(() => setRoute(readRoute()))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Al abrir un capítulo, se anota como el último visto de su guía.
  useEffect(() => {
    if (chapter) visitChapter(chapter.guide.id, chapter.slug)
  }, [chapter])

  // Scroll: arriba de todo al cambiar de página, salvo al recargar o al tocar "Continuar",
  // que vuelven a la posición donde dejaste el capítulo.
  const scrollKey = useRef<string | null>(null)
  useLayoutEffect(() => {
    // En desarrollo, StrictMode corre los effects dos veces: la segunda no tiene que mover nada.
    if (scrollKey.current === pageKey) return
    scrollKey.current = pageKey
    const resume = takeResumeRequest()
    window.scrollTo(0, resume && chapter ? readScroll(chapter.guide.id, chapter.slug) : 0)
  }, [pageKey, chapter])

  useEffect(() => {
    let timer = 0
    function onScroll() {
      if (timer) return
      timer = window.setTimeout(() => {
        timer = 0
        const [guideId, slug] = (scrollKey.current ?? '').split('/')
        if (slug) saveScroll(guideId, slug, window.scrollY)
      }, 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="layout">
      <header className="topbar">
        {chapter && (
          <button
            type="button"
            className="menu-button"
            aria-label="Abrir índice"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        )}
        <a href="#/" className="brand">
          <span className="brand-logo" aria-hidden="true">
            ❖
          </span>
          Guías de repaso
        </a>
        {chapter && (
          <>
            <span className="topbar-guide">{chapter.guide.title}</span>
            <span className="topbar-versions">{chapter.guide.badge}</span>
            <a className="topbar-print" href={`?print=${chapter.guide.id}`} target="_blank" rel="noreferrer">
              Versión imprimible
            </a>
          </>
        )}
      </header>

      {chapter && <Sidebar chapter={chapter} open={menuOpen} />}
      {chapter && menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <main className={chapter ? 'main' : 'main main--home'}>
        {/* Cada página entra y sale con una animación (React 19.3). default="none"
            evita que se anime la página entera cuando una demo interna cambia. */}
        <ViewTransition key={pageKey} enter="page-enter" exit="page-exit" default="none">
          {chapter ? <DocPage chapter={chapter} /> : <Home />}
        </ViewTransition>
      </main>
    </div>
  )
}
