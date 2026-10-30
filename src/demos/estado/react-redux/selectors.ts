import { createSelector } from 'reselect'
import type { State } from '../redux-vanilla/store'

// Selectores: funciones que leen (o calculan) algo del estado.
export const selectFiltro = (state: State) => state.filtro
export const selectPostulaciones = (state: State) => state.postulaciones
export const selectTotal = (state: State) => state.postulaciones.length

// createSelector memoriza: solo recalcula si cambian sus entradas. Así devuelve
// el MISMO array mientras nada cambie, y useSelector no re-renderiza de más.
export const selectFiltradas = createSelector([selectPostulaciones, selectFiltro], (postulaciones, filtro) =>
  postulaciones.filter((p) => p.empresa.toLowerCase().includes(filtro.toLowerCase())),
)
