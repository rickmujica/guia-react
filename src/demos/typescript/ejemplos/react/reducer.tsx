import { useReducer } from 'react'

type Item = { id: number; empresa: string; estado: 'postulado' | 'entrevista' | 'oferta' }
type State = { items: Item[]; filtro: string }

// Las acciones son una unión discriminada por "type".
type Action =
  | { type: 'agregado'; item: Item }
  | { type: 'avanzado'; id: number }
  | { type: 'borrado'; id: number }
  | { type: 'filtrado'; texto: string }

const siguiente = { postulado: 'entrevista', entrevista: 'oferta', oferta: 'oferta' } as const

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'agregado':
      return { ...state, items: [...state.items, action.item] } // action.item existe acá
    case 'avanzado':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, estado: siguiente[i.estado] } : i)),
      }
    case 'borrado':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'filtrado':
      return { ...state, filtro: action.texto }
  }
}

export function Pipeline() {
  // useReducer infiere todo a partir del reducer y del estado inicial.
  const [state, dispatch] = useReducer(reducer, { items: [], filtro: '' })

  function probar() {
    dispatch({ type: 'avanzado', id: 1 })
    // @ts-expect-error: a 'avanzado' le falta el id.
    dispatch({ type: 'avanzado' })
    // @ts-expect-error: '"movido"' no es un tipo de acción.
    dispatch({ type: 'movido', id: 1 })
  }

  return (
    <button onClick={probar}>
      {state.items.length} postulaciones (filtro: {state.filtro})
    </button>
  )
}
