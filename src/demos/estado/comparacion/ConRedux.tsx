// Redux "clásico": constantes, action creators, reducer con switch, thunk a mano.
import { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { applyMiddleware, legacy_createStore as createStore } from 'redux'
import { thunk, type ThunkAction, type ThunkDispatch } from 'redux-thunk'
import { api } from '../api'

const CARGADAS = 'favoritas/cargadas'
const AGREGADA = 'favoritas/agregada'
const QUITADA = 'favoritas/quitada'

type State = { lista: string[]; cargando: boolean }
type Action =
  | { type: typeof CARGADAS; payload: string[] }
  | { type: typeof AGREGADA; payload: string }
  | { type: typeof QUITADA; payload: string }
  | { type: 'favoritas/cargando' }

const agregar = (empresa: string): Action => ({ type: AGREGADA, payload: empresa })
const quitar = (empresa: string): Action => ({ type: QUITADA, payload: empresa })
const cargar = (): ThunkAction<Promise<void>, State, unknown, Action> => async (dispatch) => {
  dispatch({ type: 'favoritas/cargando' })
  dispatch({ type: CARGADAS, payload: (await api.listar()).map((p) => p.empresa) })
}

function reducer(state: State = { lista: [], cargando: false }, action: Action): State {
  switch (action.type) {
    case 'favoritas/cargando':
      return { ...state, cargando: true }
    case CARGADAS:
      return { lista: action.payload, cargando: false }
    case AGREGADA:
      return { ...state, lista: [...state.lista, action.payload] }
    case QUITADA:
      return { ...state, lista: state.lista.filter((e) => e !== action.payload) }
    default:
      return state
  }
}

export default function ConRedux() {
  const [store] = useState(() => createStore(reducer, applyMiddleware(thunk)))
  return (
    <Provider store={store}>
      <Favoritas />
    </Provider>
  )
}

function Favoritas() {
  const { lista, cargando } = useSelector((s: State) => s)
  const dispatch = useDispatch<ThunkDispatch<State, unknown, Action>>()
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
