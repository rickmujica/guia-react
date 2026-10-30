// Redux Toolkit + Redux Saga: el slice guarda datos, la saga se encarga de lo async.
import { configureStore, createAction, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { api, type Postulacion } from '../api'

const favoritas = createSlice({
  name: 'favoritas',
  initialState: { lista: [] as string[], cargando: false },
  reducers: {
    cargando: (state) => void (state.cargando = true),
    cargadas: (_state, action: PayloadAction<string[]>) => ({ lista: action.payload, cargando: false }),
    agregar: (state, action: PayloadAction<string>) => void state.lista.push(action.payload),
    quitar: (state, action: PayloadAction<string>) => {
      state.lista = state.lista.filter((e) => e !== action.payload)
    },
  },
})
const { cargando, cargadas, agregar, quitar } = favoritas.actions
const cargar = createAction('favoritas/cargar') // solo la escucha la saga

function* cargarSaga() {
  yield put(cargando())
  const postulaciones: Postulacion[] = yield call(api.listar)
  yield put(cargadas(postulaciones.map((p) => p.empresa)))
}

function crearStore() {
  const saga = createSagaMiddleware()
  const store = configureStore({ reducer: favoritas.reducer, middleware: (d) => d().concat(saga) })
  saga.run(function* () {
    yield takeLatest(cargar.type, cargarSaga)
  })
  return store
}
type State = ReturnType<typeof favoritas.reducer>

export default function ConSaga() {
  const [store] = useState(crearStore)
  return (
    <Provider store={store}>
      <Favoritas />
    </Provider>
  )
}

function Favoritas() {
  const { lista, cargando } = useSelector((s: State) => s)
  const dispatch = useDispatch()
  return (
    <>
      <button onClick={() => dispatch(cargar())}>{cargando ? 'Cargando…' : 'Cargar'}</button>
      <button onClick={() => dispatch(agregar('Mate Cloud'))}>+ Mate Cloud</button>
      <ul>
        {lista.map((e) => (
          <li key={e} onClick={() => dispatch(quitar(e))}>
            {e}
          </li>
        ))}
      </ul>
    </>
  )
}
