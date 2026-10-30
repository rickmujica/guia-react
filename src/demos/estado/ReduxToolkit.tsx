import { useState } from 'react'
import { Provider } from 'react-redux'
import {
  agregarPostulacion,
  avanzada,
  cargarPostulaciones,
  filtroCambiado,
  rechazada,
  selectError,
  selectFiltradas,
  selectFiltro,
  selectStatus,
} from './toolkit/postulacionesSlice'
import { crearStore, useAppDispatch, useAppSelector } from './toolkit/store'

export default function ReduxToolkit() {
  const [store] = useState(crearStore)
  return (
    <Provider store={store}>
      <Postulaciones />
    </Provider>
  )
}

function Postulaciones() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const error = useAppSelector(selectError)
  const filtro = useAppSelector(selectFiltro)
  const filtradas = useAppSelector(selectFiltradas)
  const [empresa, setEmpresa] = useState('')

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => dispatch(cargarPostulaciones(false))}>Cargar</button>
        <button onClick={() => dispatch(cargarPostulaciones(true))}>Cargar (con error)</button>
        <span className="pill">status: {status}</span>
        <input value={filtro} onChange={(e) => dispatch(filtroCambiado(e.target.value))} placeholder="Filtrar" />
      </div>
      {error && <p className="error-text">{error}</p>}
      <ul>
        {filtradas.map((p) => (
          <li key={p.id}>
            {p.empresa} · {p.etapa} <button onClick={() => dispatch(avanzada(p.id))}>avanzar</button>{' '}
            <button onClick={() => dispatch(rechazada(p.id))}>✕</button>
          </li>
        ))}
      </ul>
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!empresa.trim()) return
          // unwrap() devuelve el payload o tira el error: útil para reaccionar en el componente.
          await dispatch(agregarPostulacion(empresa.trim())).unwrap()
          setEmpresa('')
        }}
      >
        <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nueva empresa" />
        <button type="submit">Agregar</button>
      </form>
    </div>
  )
}
