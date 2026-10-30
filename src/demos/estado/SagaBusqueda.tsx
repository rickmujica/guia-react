import { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { crearStore, textoCambiado, type RootState } from './saga/busqueda'

export default function SagaBusqueda() {
  const [store] = useState(crearStore)
  return (
    <Provider store={store}>
      <Buscador />
    </Provider>
  )
}

function Buscador() {
  const { texto, resultados, buscando, log } = useSelector((state: RootState) => state.busqueda)
  const dispatch = useDispatch()
  return (
    <div className="stack">
      <div className="row">
        <input
          value={texto}
          onChange={(e) => dispatch(textoCambiado(e.target.value))}
          placeholder="Buscá una empresa (probá escribir rápido)"
          style={{ flex: 1 }}
        />
        {buscando && <span className="pill">buscando…</span>}
      </div>
      <div className="grid-2">
        <ul>
          {resultados.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <ol className="log">
          {log.length ? log.slice(-8).map((l, i) => <li key={i}>{l}</li>) : <li>(escribí algo)</li>}
        </ol>
      </div>
    </div>
  )
}
