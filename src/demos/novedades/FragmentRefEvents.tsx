import { Fragment, useEffect, useRef, useState, type FragmentInstance, type ReactNode } from 'react'

// Escucha los clicks de todos sus hijos SIN agregar un <div> envoltorio
function ClickTracker({ children, onAnyClick }: { children: ReactNode; onAnyClick: (e: Event) => void }) {
  const fragmentRef = useRef<FragmentInstance>(null)

  useEffect(() => {
    const fragment = fragmentRef.current
    if (!fragment) return
    // addEventListener se aplica a cada hijo DOM de primer nivel del Fragment
    fragment.addEventListener('click', onAnyClick)
    return () => fragment.removeEventListener('click', onAnyClick)
  }, [onAnyClick])

  return <Fragment ref={fragmentRef}>{children}</Fragment>
}

export default function FragmentRefEvents() {
  const [clicks, setClicks] = useState<string[]>([])

  return (
    <div className="stack">
      <div className="row">
        <ClickTracker
          onAnyClick={(e) => {
            const label = (e.currentTarget as HTMLElement).textContent ?? ''
            setClicks((list) => [...list, label])
          }}
        >
          <button>Nubelia</button>
          <button>Pagos Sur</button>
          <button>Datalab</button>
        </ClickTracker>
      </div>
      <p className="muted">
        Clicks registrados: {clicks.length ? clicks.join(', ') : 'ninguno'} · Inspeccioná el DOM: no hay ningún
        div extra alrededor de los botones.
      </p>
    </div>
  )
}
