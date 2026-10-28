import { addTransitionType, startTransition, useState, ViewTransition } from 'react'
import './view-transitions.css'

const offers = [
  { company: 'Nubelia', role: 'Frontend Engineer', salary: 'USD 3.200' },
  { company: 'Datalab', role: 'UI Engineer', salary: 'USD 4.100' },
  { company: 'Pagos Sur', role: 'React Developer', salary: 'USD 2.800' },
  { company: 'Andes Cloud', role: 'Frontend Lead', salary: 'USD 5.000' },
]

export default function TransitionTypes() {
  const [index, setIndex] = useState(0)
  const offer = offers[index]

  function go(direction: 1 | -1) {
    startTransition(() => {
      // Le decimos a React POR QUÉ ocurre esta transición
      addTransitionType(direction === 1 ? 'siguiente' : 'anterior')
      setIndex((i) => (i + direction + offers.length) % offers.length)
    })
  }

  return (
    <div className="stack">
      <div style={{ overflow: 'hidden', borderRadius: 10 }}>
        {/* key distinta = componente nuevo: el viejo sale (exit) y el nuevo entra (enter) */}
        <ViewTransition
          key={index}
          enter={{ siguiente: 'vt-from-right', anterior: 'vt-from-left', default: 'none' }}
          exit={{ siguiente: 'vt-to-left', anterior: 'vt-to-right', default: 'none' }}
        >
          <div className="card" style={{ minHeight: 96 }}>
            <p className="muted">
              Oferta destacada {index + 1} de {offers.length}
            </p>
            <strong>
              {offer.role} · {offer.company}
            </strong>
            <p>{offer.salary}</p>
          </div>
        </ViewTransition>
      </div>
      <div className="row">
        <button onClick={() => go(-1)}>← Anterior</button>
        <button onClick={() => go(1)}>Siguiente →</button>
      </div>
    </div>
  )
}
