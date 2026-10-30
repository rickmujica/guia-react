import { useEffect, useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { crearStore, pedidoConTimeout, pollingDetenido, pollingIniciado, type RootState } from './saga/patrones'

export default function SagaPatrones() {
  const [store] = useState(crearStore)
  // Al desmontar la demo, cortamos el polling (si no, seguiría pidiendo para siempre).
  useEffect(() => () => void store.dispatch(pollingDetenido()), [store])
  return (
    <Provider store={store}>
      <Panel />
    </Provider>
  )
}

function Panel() {
  const { log, ofertas, polling } = useSelector((state: RootState) => state.patrones)
  const dispatch = useDispatch()
  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => dispatch(pedidoConTimeout())}>Pedido con timeout (race)</button>
        <button onClick={() => dispatch(polling ? pollingDetenido() : pollingIniciado())}>
          {polling ? 'Detener polling' : 'Iniciar polling'}
        </button>
        <span className="pill">ofertas nuevas: {ofertas ?? '–'}</span>
      </div>
      <ol className="log">
        {log.length ? log.slice(-8).map((l, i) => <li key={i}>{l}</li>) : <li>(tocá un botón)</li>}
      </ol>
    </div>
  )
}
