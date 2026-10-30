import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useRenderFlash } from '../shared/useRenderFlash'
import { totalActual, usePostulaciones } from './zustand/store'

export default function Zustand() {
  return (
    <div className="stack">
      <Controles />
      <div className="grid-2">
        <Lista />
        <Total />
      </div>
      <p className="muted">Recargá la página: las postulaciones siguen ahí (middleware persist).</p>
    </div>
  )
}

function Controles() {
  // Un selector por valor: el componente solo se re-renderiza si cambia lo que elegiste.
  const status = usePostulaciones((s) => s.status)
  const filtro = usePostulaciones((s) => s.filtro)
  const { cargar, setFiltro, reiniciar } = usePostulaciones(
    // useShallow: elegir varias cosas en un objeto sin re-renderizar si son las mismas.
    useShallow((s) => ({ cargar: s.cargar, setFiltro: s.setFiltro, reiniciar: s.reiniciar })),
  )
  const [leido, setLeido] = useState<number | null>(null)
  return (
    <div className="row">
      <button onClick={() => cargar()}>Cargar</button>
      <button onClick={() => cargar(true)}>Cargar (con error)</button>
      <button onClick={reiniciar}>Vaciar</button>
      <button onClick={() => setLeido(totalActual())}>getState(){leido !== null && ` → ${leido}`}</button>
      <span className="pill">status: {status}</span>
      <input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Filtrar" />
    </div>
  )
}

function Lista() {
  const items = usePostulaciones((s) => s.items)
  const filtro = usePostulaciones((s) => s.filtro)
  const avanzar = usePostulaciones((s) => s.avanzar)
  const ref = useRenderFlash<HTMLDivElement>()
  const filtradas = items.filter((p) => p.empresa.toLowerCase().includes(filtro.toLowerCase()))
  return (
    <div ref={ref} className="card">
      <ul>
        {filtradas.map((p) => (
          <li key={p.id}>
            {p.empresa} · {p.etapa} <button onClick={() => avanzar(p.id)}>avanzar</button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="muted">Vacío: tocá Cargar.</p>}
    </div>
  )
}

function Total() {
  const total = usePostulaciones((s) => s.items.length)
  const ref = useRenderFlash<HTMLDivElement>()
  return (
    <div ref={ref} className="card">
      <strong>Total</strong>
      <p style={{ fontSize: '2rem', margin: 0 }}>{total}</p>
    </div>
  )
}
