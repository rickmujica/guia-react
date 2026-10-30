import { legacy_createStore as createStore } from 'redux'
import { siguienteEtapa, type Postulacion } from '../api'

// 1) El estado: un objeto con TODO lo que la app necesita recordar.
export type State = { postulaciones: Postulacion[]; filtro: string }

const estadoInicial: State = {
  postulaciones: [{ id: 1, empresa: 'Nubelia', etapa: 'entrevista' }],
  filtro: '',
}

// 2) Las acciones: objetos que describen "qué pasó". El type es obligatorio.
export type Action =
  | { type: 'postulaciones/agregada'; payload: { id: number; empresa: string } }
  | { type: 'postulaciones/avanzada'; payload: number }
  | { type: 'filtro/cambiado'; payload: string }

// 3) El reducer: una función PURA (estado, acción) => estado nuevo. Nunca muta.
export function reducer(state: State = estadoInicial, action: Action): State {
  switch (action.type) {
    case 'postulaciones/agregada':
      return {
        ...state,
        postulaciones: [...state.postulaciones, { ...action.payload, etapa: 'postulado' }],
      }
    case 'postulaciones/avanzada':
      return {
        ...state,
        postulaciones: state.postulaciones.map((p) =>
          p.id === action.payload ? { ...p, etapa: siguienteEtapa[p.etapa] } : p,
        ),
      }
    case 'filtro/cambiado':
      return { ...state, filtro: action.payload }
    default:
      return state // acciones que no son de este reducer: el estado no cambia
  }
}

// 4) El store: guarda el estado, recibe acciones con dispatch y avisa a los suscriptores.
export function crearStore() {
  return createStore(reducer)
}
