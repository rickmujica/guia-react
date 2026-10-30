import { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { cargarPostulaciones, crearStore, type AppDispatch, type State } from './thunk/store'

export default function ThunkClasico() {
  const [log, setLog] = useState<string[]>([])
  const [store] = useState(() => crearStore((linea) => setLog((l) => [...l, linea])))
  return (
    <Provider store={store}>
      <div className="stack">
        <Postulaciones />
        <ol className="log">
          {log.length ? log.map((l, i) => <li key={i}>{l}</li>) : <li>(el logger todavía no vio nada)</li>}
        </ol>
      </div>
    </Provider>
  )
}

function Postulaciones() {
  const { postulaciones, status, error } = useSelector((s: State) => s)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      <div className="row">
        <button onClick={() => dispatch(cargarPostulaciones(false))}>Cargar</button>
        <button onClick={() => dispatch(cargarPostulaciones(true))}>Cargar (con error)</button>
        <span className="pill">status: {status}</span>
      </div>
      {status === 'loading' && <p>Cargando…</p>}
      {error && <p className="error-text">{error}</p>}
      <ul>
        {postulaciones.map((p) => (
          <li key={p.id}>
            {p.empresa} · {p.etapa}
          </li>
        ))}
      </ul>
    </>
  )
}
