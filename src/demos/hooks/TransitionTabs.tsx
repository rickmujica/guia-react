import { useState, useTransition } from 'react'
import { blockFor } from '../shared/utils'

type Tab = 'resumen' | 'postulaciones' | 'contacto'

function SlowRow({ index }: { index: number }) {
  blockFor(1.5) // 300 filas x 1.5 ms = casi medio segundo de render
  return <li>Postulación #{index + 1}</li>
}

function ApplicationsTab() {
  return (
    <ul style={{ margin: 0, paddingLeft: '1.2em', maxHeight: 180, overflow: 'auto' }}>
      {Array.from({ length: 300 }, (_, i) => (
        <SlowRow key={i} index={i} />
      ))}
    </ul>
  )
}

export default function TransitionTabs() {
  const [tab, setTab] = useState<Tab>('resumen')
  const [transitionOn, setTransitionOn] = useState(true)
  const [isPending, startTransition] = useTransition()

  function selectTab(next: Tab) {
    if (transitionOn) {
      // Actualización NO urgente: React puede interrumpirla si hacés otro click.
      startTransition(() => setTab(next))
    } else {
      setTab(next) // urgente: bloquea la UI hasta terminar de renderizar
    }
  }

  return (
    <div className="stack">
      <label className="row">
        <input type="checkbox" checked={transitionOn} onChange={(e) => setTransitionOn(e.target.checked)} />
        Usar startTransition
      </label>
      <div className="row">
        <button className={tab === 'resumen' ? 'active' : ''} onClick={() => selectTab('resumen')}>
          Resumen
        </button>
        <button className={tab === 'postulaciones' ? 'active' : ''} onClick={() => selectTab('postulaciones')}>
          Postulaciones (lenta)
        </button>
        <button className={tab === 'contacto' ? 'active' : ''} onClick={() => selectTab('contacto')}>
          Contacto
        </button>
        {isPending && <span className="muted">Cargando pestaña…</span>}
      </div>
      <div className={`card ${isPending ? 'pending' : ''}`}>
        {tab === 'resumen' && <p>3 entrevistas esta semana, 1 oferta pendiente.</p>}
        {tab === 'postulaciones' && <ApplicationsTab />}
        {tab === 'contacto' && <p>recruiting@ejemplo.com</p>}
      </div>
    </div>
  )
}
