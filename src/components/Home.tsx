import type { CSSProperties } from 'react'
import { findChapter, guides, upcomingGuides, type Guide } from '../guides'
import { guideProgress, requestResume, resetGuide, useProgress, type GuideProgress } from '../lib/progress'
import { chapterHref } from '../lib/route'
import { ProgressBar } from './ProgressBar'

const colorVar = (color: string) => ({ '--guide-color': color }) as CSSProperties

// Dos letras ("TS") o un símbolo ("⚛"), que necesita ser más grande para verse igual.
function GuideIcon({ icon }: { icon: string }) {
  const glyph = [...icon].length === 1
  return (
    <span className={`guide-icon${glyph ? ' guide-icon--glyph' : ''}`} aria-hidden="true">
      {icon}
    </span>
  )
}

// El último capítulo abierto de una guía, si todavía existe.
function lastChapter(guide: Guide, progress: GuideProgress) {
  return progress.last ? findChapter(guide, progress.last) : undefined
}

export function Home() {
  const progress = useProgress()

  // La guía que tocaste más recientemente, para el atajo "Continuar donde dejaste".
  const recent = guides
    .map((guide) => ({ guide, progress: guideProgress(progress, guide.id) }))
    .filter(({ guide, progress }) => lastChapter(guide, progress))
    .sort((a, b) => (b.progress.lastAt ?? 0) - (a.progress.lastAt ?? 0))[0]
  const recentChapter = recent && lastChapter(recent.guide, recent.progress)

  return (
    <div className="home">
      <title>Guías de repaso</title>

      <header className="home-header">
        <h1>Guías de repaso</h1>
        <p className="home-lead">
          Elegí un tema. Cada guía recuerda el último capítulo que abriste y los que ya leíste, así podés retomar cuando
          quieras.
        </p>
      </header>

      {recent && recentChapter && (
        <section className="resume" style={colorVar(recent.guide.color)} aria-labelledby="resume-title">
          <p className="resume-kicker" id="resume-title">
            Continuar donde dejaste
          </p>
          <div className="resume-body">
            <GuideIcon icon={recent.guide.icon} />
            <div className="resume-text">
              <p className="resume-guide">
                {recent.guide.title} · Capítulo {recentChapter.index + 1}
              </p>
              <p className="resume-chapter">{recentChapter.title}</p>
            </div>
            <a href={chapterHref(recentChapter)} className="button button--primary" onClick={requestResume}>
              Continuar →
            </a>
          </div>
        </section>
      )}

      <div className="guide-grid">
        {guides.map((guide) => {
          const guideState = guideProgress(progress, guide.id)
          const last = lastChapter(guide, guideState)
          const started = last || guideState.completed.length > 0
          return (
            <article
              key={guide.id}
              className="guide-card"
              style={colorVar(guide.color)}
              data-pdf={guide.pdf}
              data-guide={guide.id}
            >
              <div className="guide-card-head">
                <GuideIcon icon={guide.icon} />
                <div>
                  <h2>{guide.title}</h2>
                  <p className="guide-card-meta">
                    {guide.badge} · {guide.chapters.length} capítulos
                  </p>
                </div>
              </div>
              <p className="guide-card-desc">{guide.description}</p>
              <ProgressBar done={guideState.completed.length} total={guide.chapters.length} color={guide.color} />
              <div className="guide-card-actions">
                {last ? (
                  <a href={chapterHref(last)} className="button button--primary" onClick={requestResume}>
                    Continuar: {last.title}
                  </a>
                ) : (
                  <a href={chapterHref(guide.chapters[0])} className="button button--primary">
                    Empezar
                  </a>
                )}
                {started && (
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => {
                      if (confirm(`¿Borrar el progreso de ${guide.title}?`)) resetGuide(guide.id)
                    }}
                  >
                    Reiniciar
                  </button>
                )}
              </div>
            </article>
          )
        })}

        {upcomingGuides.map((guide) => (
          <article key={guide.id} className="guide-card guide-card--upcoming" style={colorVar(guide.color)}>
            <div className="guide-card-head">
              <GuideIcon icon={guide.icon} />
              <div>
                <h2>{guide.title}</h2>
                <p className="guide-card-meta">Próximamente</p>
              </div>
            </div>
            <p className="guide-card-desc">{guide.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
