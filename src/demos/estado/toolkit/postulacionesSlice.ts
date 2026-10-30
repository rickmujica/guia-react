import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api, siguienteEtapa, type Postulacion } from '../api'

type PostulacionesState = {
  items: Postulacion[]
  filtro: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PostulacionesState = { items: [], filtro: '', status: 'idle', error: null }

// createAsyncThunk genera el thunk y las tres acciones: pending, fulfilled y rejected.
export const cargarPostulaciones = createAsyncThunk(
  'postulaciones/cargar',
  async (falla: boolean) => api.listar({ falla }), // lo que devuelve va en action.payload
  {
    // Si ya está cargando, ni siquiera arranca (no despacha pending).
    condition: (_falla, { getState }) =>
      (getState() as { postulaciones: PostulacionesState }).postulaciones.status !== 'loading',
  },
)

export const agregarPostulacion = createAsyncThunk('postulaciones/agregar', (empresa: string) => api.crear(empresa))

// createSlice: el reducer y los action creators en un solo lugar.
const postulacionesSlice = createSlice({
  name: 'postulaciones',
  initialState,
  reducers: {
    // Gracias a Immer, se "muta" un borrador y RTK arma el estado nuevo inmutable.
    avanzada(state, action: PayloadAction<number>) {
      const postulacion = state.items.find((p) => p.id === action.payload)
      if (postulacion) postulacion.etapa = siguienteEtapa[postulacion.etapa]
    },
    rechazada(state, action: PayloadAction<number>) {
      const postulacion = state.items.find((p) => p.id === action.payload)
      if (postulacion) postulacion.etapa = 'rechazado'
    },
    filtroCambiado(state, action: PayloadAction<string>) {
      state.filtro = action.payload
    },
  },
  // Las acciones que NO genera este slice (como las del thunk) se manejan acá.
  extraReducers: (builder) => {
    builder
      .addCase(cargarPostulaciones.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(cargarPostulaciones.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(cargarPostulaciones.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Error'
      })
      .addCase(agregarPostulacion.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
  // Selectores escritos sobre el estado del slice. RTK los adapta para recibir el estado global.
  selectors: {
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectFiltro: (state) => state.filtro,
    // createSelector memoriza: devuelve el mismo array mientras items y filtro no cambien.
    selectFiltradas: createSelector(
      [(state: PostulacionesState) => state.items, (state: PostulacionesState) => state.filtro],
      (items, filtro) => items.filter((p) => p.empresa.toLowerCase().includes(filtro.toLowerCase())),
    ),
  },
})

export const { avanzada, rechazada, filtroCambiado } = postulacionesSlice.actions
export const { selectStatus, selectError, selectFiltro, selectFiltradas } = postulacionesSlice.selectors
export default postulacionesSlice
