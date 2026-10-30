import { configureStore } from '@reduxjs/toolkit'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { postulacionesApi, reiniciarDatos, useAvanzarMutation, useListarQuery } from './rtk-query/api'

function crearStore() {
  reiniciarDatos()
  return configureStore({
    reducer: { [postulacionesApi.reducerPath]: postulacionesApi.reducer },
    // El middleware de RTK Query maneja la caché, los reintentos y la invalidación.
    middleware: (getDefault) => getDefault().concat(postulacionesApi.middleware),
  })
}

export default function RtkQuery() {
  const [store] = useState(crearStore)
  const [mostrarSegunda, setMostrarSegunda] = useState(false)
  return (
    <Provider store={store}>
      <div className="stack">
        <div className="grid-2">
          <Lista titulo="Componente A" />
          {mostrarSegunda ? (
            <Lista titulo="Componente B (comparte la caché)" />
          ) : (
            <button onClick={() => setMostrarSegunda(true)}>Montar otro componente que pide lo mismo</button>
          )}
        </div>
      </div>
    </Provider>
  )
}

function Lista({ titulo }: { titulo: string }) {
  // data, isLoading (la primera vez), isFetching (cualquier pedido), error y refetch.
  const { data = [], isLoading, isFetching, error, refetch } = useListarQuery()
  const [avanzar, { isLoading: avanzando }] = useAvanzarMutation()

  return (
    <div className="card stack">
      <div className="row">
        <strong style={{ flex: 1 }}>{titulo}</strong>
        <span className="pill">{isLoading ? 'cargando' : isFetching ? 'actualizando' : 'en caché'}</span>
        <button onClick={refetch}>refetch</button>
      </div>
      {error && <p className="error-text">{'message' in error ? error.message : 'Error'}</p>}
      <ul style={{ opacity: isFetching ? 0.5 : 1 }}>
        {data.map((p) => (
          <li key={p.id}>
            {p.empresa} · {p.etapa}{' '}
            <button disabled={avanzando || p.etapa === 'oferta'} onClick={() => avanzar(p.id)}>
              avanzar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
