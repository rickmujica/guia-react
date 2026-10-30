import { useEffect, useState } from 'react'
import { crearStore, type Action, type State } from './redux-vanilla/store'

// Redux sin React: el store, dispatch y subscribe. Así funciona por dentro react-redux.
export default function ReduxVanilla() {
  const [store] = useState(crearStore) // un store nuevo por demo (se reinicia con el botón)
  const [state, setState] = useState<State>(store.getState())
  const [log, setLog] = useState<string[]>([])
  const [empresa, setEmpresa] = useState('')

  useEffect(() => {
    // subscribe avisa después de CADA dispatch. Devuelve la función para desuscribirse.
    return store.subscribe(() => setState(store.getState()))
  }, [store])

  function despachar(action: Action) {
    store.dispatch(action)
    setLog((l) => [JSON.stringify(action), ...l].slice(0, 6))
  }

  return (
    <div className="stack">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          if (!empresa.trim()) return
          despachar({ type: 'postulaciones/agregada', payload: { id: Date.now(), empresa: empresa.trim() } })
          setEmpresa('')
        }}
      >
        <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Empresa" />
        <button type="submit">dispatch(agregada)</button>
        <input
          value={state.filtro}
          onChange={(e) => despachar({ type: 'filtro/cambiado', payload: e.target.value })}
          placeholder="Filtro"
        />
      </form>
      <ul>
        {state.postulaciones
          .filter((p) => p.empresa.toLowerCase().includes(state.filtro.toLowerCase()))
          .map((p) => (
            <li key={p.id}>
              {p.empresa} · {p.etapa}{' '}
              <button onClick={() => despachar({ type: 'postulaciones/avanzada', payload: p.id })}>avanzar</button>
            </li>
          ))}
      </ul>
      <div className="grid-2">
        <div>
          <strong>Acciones despachadas</strong>
          <ol className="log">{log.length ? log.map((l, i) => <li key={i}>{l}</li>) : <li>(ninguna)</li>}</ol>
        </div>
        <div>
          <strong>store.getState()</strong>
          <pre className="log">{JSON.stringify(state, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
