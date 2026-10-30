import { configureStore, createAction, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import createSagaMiddleware, { type Task } from 'redux-saga'
import { call, cancel, delay, fork, put, race, take, takeEvery } from 'redux-saga/effects'
import { api } from '../api'

const patronesSlice = createSlice({
  name: 'patrones',
  initialState: { log: [] as string[], ofertas: null as number | null, polling: false },
  reducers: {
    anotado(state, action: PayloadAction<string>) {
      state.log.push(action.payload)
    },
    ofertasActualizadas(state, action: PayloadAction<number>) {
      state.ofertas = action.payload
    },
    pollingCambiado(state, action: PayloadAction<boolean>) {
      state.polling = action.payload
    },
  },
})
const { anotado, ofertasActualizadas, pollingCambiado } = patronesSlice.actions

// Acciones que solo escuchan las sagas (ningún reducer las maneja).
export const pedidoConTimeout = createAction('patrones/pedidoConTimeout')
export const pollingIniciado = createAction('patrones/pollingIniciado')
export const pollingDetenido = createAction('patrones/pollingDetenido')

// race: corre varios efectos y se queda con el primero que termina (los demás se cancelan).
function* pedirConTimeout() {
  yield put(anotado('▶ pidiendo… (timeout de 2 s)'))
  const { respuesta, timeout }: { respuesta?: string; timeout?: true } = yield race({
    respuesta: call(api.lenta),
    timeout: delay(2000, true),
  })
  yield put(anotado(timeout ? '⏱ timeout: el pedido se canceló' : `✓ ${respuesta}`))
}

// Polling: un loop infinito con delay. Corre en paralelo (fork) hasta que lo cancelan.
function* polling() {
  while (true) {
    const cantidad: number = yield call(api.ofertasNuevas)
    yield put(ofertasActualizadas(cantidad))
    yield delay(1500)
  }
}

function* controlarPolling() {
  while (true) {
    yield take(pollingIniciado.type) // espera a que alguien despache la acción
    yield put(pollingCambiado(true))
    const tarea: Task = yield fork(polling) // arranca sin bloquear
    yield take(pollingDetenido.type)
    yield cancel(tarea) // cancela el loop, aunque esté en medio de un call o un delay
    yield put(pollingCambiado(false))
  }
}

function* rootSaga() {
  yield fork(controlarPolling)
  yield takeEvery(pedidoConTimeout.type, pedirConTimeout)
}

export function crearStore() {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: { patrones: patronesSlice.reducer },
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
  })
  sagaMiddleware.run(rootSaga)
  return store
}

export type RootState = ReturnType<ReturnType<typeof crearStore>['getState']>
