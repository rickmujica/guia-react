import { applyMiddleware, legacy_createStore as createStore, type Middleware } from 'redux'
import { thunk, type ThunkAction, type ThunkDispatch } from 'redux-thunk'
import { api, type Postulacion } from '../api'

// Redux "a mano", como en muchos proyectos de 2016-2019: constantes, action creators y thunks.
export const CARGA_INICIADA = 'postulaciones/cargaIniciada'
export const CARGA_EXITOSA = 'postulaciones/cargaExitosa'
export const CARGA_FALLIDA = 'postulaciones/cargaFallida'

export type State = {
  postulaciones: Postulacion[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

type Action =
  | { type: typeof CARGA_INICIADA }
  | { type: typeof CARGA_EXITOSA; payload: Postulacion[] }
  | { type: typeof CARGA_FALLIDA; error: string }

// Action creators: funciones que arman la acción (para no escribir el objeto a mano cada vez).
const cargaIniciada = (): Action => ({ type: CARGA_INICIADA })
const cargaExitosa = (postulaciones: Postulacion[]): Action => ({ type: CARGA_EXITOSA, payload: postulaciones })
const cargaFallida = (error: string): Action => ({ type: CARGA_FALLIDA, error })

const inicial: State = { postulaciones: [], status: 'idle', error: null }

function reducer(state: State = inicial, action: Action): State {
  switch (action.type) {
    case CARGA_INICIADA:
      return { ...state, status: 'loading', error: null }
    case CARGA_EXITOSA:
      return { ...state, status: 'succeeded', postulaciones: action.payload }
    case CARGA_FALLIDA:
      return { ...state, status: 'failed', error: action.error }
    default:
      return state
  }
}

// Un thunk: una función que se despacha como si fuera una acción. El middleware
// redux-thunk la ejecuta pasándole dispatch y getState, así puede hacer cosas async.
export function cargarPostulaciones(falla: boolean): ThunkAction<Promise<void>, State, unknown, Action> {
  return async (dispatch, getState) => {
    if (getState().status === 'loading') return // ya hay una carga en curso
    dispatch(cargaIniciada())
    try {
      dispatch(cargaExitosa(await api.listar({ falla })))
    } catch (e) {
      dispatch(cargaFallida(e instanceof Error ? e.message : 'Error'))
    }
  }
}

// Un middleware se mete entre el dispatch y el reducer: ve pasar cada acción.
// Este anota cada una (como hace Redux DevTools, pero en la demo).
export function crearLogger(anotar: (linea: string) => void): Middleware<object, State> {
  return (api) => (next) => (action) => {
    const antes = api.getState().status
    const resultado = next(action) // pasa la acción al siguiente middleware (o al reducer)
    const tipo = typeof action === 'function' ? '(thunk)' : (action as Action).type
    anotar(`${tipo}  ·  status: ${antes} → ${api.getState().status}`)
    return resultado
  }
}

export function crearStore(anotar: (linea: string) => void) {
  // El orden importa: thunk primero, así el logger solo ve acciones (objetos).
  return createStore(reducer, applyMiddleware(thunk, crearLogger(anotar)))
}

export type AppDispatch = ThunkDispatch<State, unknown, Action>
