import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { call, cancelled, delay, put, takeLatest } from 'redux-saga/effects'
import { api } from '../api'

// El slice solo guarda datos: la lógica async vive en la saga.
const busquedaSlice = createSlice({
  name: 'busqueda',
  initialState: { texto: '', resultados: [] as string[], buscando: false, log: [] as string[] },
  reducers: {
    textoCambiado(state, action: PayloadAction<string>) {
      state.texto = action.payload
    },
    busquedaIniciada(state, action: PayloadAction<string>) {
      state.buscando = true
      state.log.push(`▶ buscando "${action.payload}"`)
    },
    resultadosRecibidos(state, action: PayloadAction<{ texto: string; resultados: string[] }>) {
      state.buscando = false
      state.resultados = action.payload.resultados
      const n = action.payload.resultados.length
      state.log.push(`✓ ${n} resultado${n === 1 ? '' : 's'} para "${action.payload.texto}"`)
    },
    busquedaCancelada(state, action: PayloadAction<string>) {
      state.log.push(`✕ cancelada "${action.payload}" (llegó otra tecla)`)
    },
  },
})

export const { textoCambiado } = busquedaSlice.actions
const { busquedaIniciada, resultadosRecibidos, busquedaCancelada } = busquedaSlice.actions

// Una saga es una función generadora. Cada yield le pide algo al middleware (un "efecto")
// y el middleware lo ejecuta: llamar a una función, despachar una acción, esperar…
function* buscar(action: PayloadAction<string>) {
  const texto = action.payload.trim()
  if (!texto) return
  try {
    yield delay(300) // debounce: si llega otra tecla antes, takeLatest cancela esta saga acá
    yield put(busquedaIniciada(texto))
    const resultados: string[] = yield call(api.buscarEmpresas, texto)
    yield put(resultadosRecibidos({ texto, resultados }))
  } finally {
    // finally corre siempre; cancelled() dice si fue porque la cancelaron.
    const fueCancelada: boolean = yield cancelled()
    if (fueCancelada) yield put(busquedaCancelada(texto))
  }
}

// La saga raíz: por cada textoCambiado arranca buscar, cancelando la anterior si sigue viva.
function* rootSaga() {
  yield takeLatest(textoCambiado.type, buscar)
}

export function crearStore() {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: { busqueda: busquedaSlice.reducer },
    middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
  })
  sagaMiddleware.run(rootSaga)
  return store
}

export type RootState = ReturnType<ReturnType<typeof crearStore>['getState']>
