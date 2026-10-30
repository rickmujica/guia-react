import { useState } from 'react'
import { Provider } from 'react-redux'
import { useRenderFlash } from '../shared/useRenderFlash'
import { useAppDispatch, useAppSelector } from './react-redux/hooks'
import { selectFiltradas, selectFiltro, selectTotal } from './react-redux/selectors'
import TotalConectado from './react-redux/TotalConectado'
import { crearStore } from './redux-vanilla/store'

export default function ReactRedux() {
  const [store] = useState(crearStore)
  // El Provider pone el store a disposición de todo el árbol (por context).
  return (
    <Provider store={store}>
      <div className="stack">
        <Filtro />
        <div className="grid-2">
          <Lista />
          <Total />
        </div>
        <TotalConectado />
      </div>
    </Provider>
  )
}

const nuevas = ['Pagos Sur', 'Andes Labs', 'Mate Cloud', 'Tereré Tech']

function Filtro() {
  const filtro = useAppSelector(selectFiltro)
  const dispatch = useAppDispatch()
  const ref = useRenderFlash<HTMLDivElement>()
  return (
    <div ref={ref} className="row card">
      <input
        value={filtro}
        onChange={(e) => dispatch({ type: 'filtro/cambiado', payload: e.target.value })}
        placeholder="Filtrar"
      />
      <button
        onClick={() => {
          const empresa = nuevas[Math.floor(Math.random() * nuevas.length)]
          dispatch({ type: 'postulaciones/agregada', payload: { id: Date.now(), empresa } })
        }}
      >
        Agregar una
      </button>
    </div>
  )
}

function Lista() {
  // useSelector re-renderiza el componente solo si lo que devuelve el selector cambió (===).
  const postulaciones = useAppSelector(selectFiltradas)
  const dispatch = useAppDispatch()
  const ref = useRenderFlash<HTMLDivElement>()
  return (
    <div ref={ref} className="card">
      <strong>Lista</strong>
      <ul>
        {postulaciones.map((p) => (
          <li key={p.id}>
            {p.empresa} · {p.etapa}{' '}
            <button onClick={() => dispatch({ type: 'postulaciones/avanzada', payload: p.id })}>avanzar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Total() {
  // Este componente solo lee el total: escribir en el filtro NO lo re-renderiza.
  const total = useAppSelector(selectTotal)
  const ref = useRenderFlash<HTMLDivElement>()
  return (
    <div ref={ref} className="card">
      <strong>Total</strong>
      <p style={{ fontSize: '2rem', margin: 0 }}>{total}</p>
    </div>
  )
}
