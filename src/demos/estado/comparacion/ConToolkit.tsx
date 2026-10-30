// Redux Toolkit: createSlice + createAsyncThunk. Mismo Redux, mucho menos código.
import { configureStore, createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { api } from '../api'

const cargar = createAsyncThunk('favoritas/cargar', async () => (await api.listar()).map((p) => p.empresa))

const favoritas = createSlice({
  name: 'favoritas',
  initialState: { lista: [] as string[], cargando: false },
  reducers: {
    agregar: (state, action: PayloadAction<string>) => void state.lista.push(action.payload),
    quitar: (state, action: PayloadAction<string>) => {
      state.lista = state.lista.filter((e) => e !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cargar.pending, (state) => void (state.cargando = true))
    builder.addCase(cargar.fulfilled, (_state, action) => ({ lista: action.payload, cargando: false }))
  },
})
const { agregar, quitar } = favoritas.actions

const crearStore = () => configureStore({ reducer: favoritas.reducer })
type State = ReturnType<typeof favoritas.reducer>
type AppDispatch = ReturnType<typeof crearStore>['dispatch']

export default function ConToolkit() {
  const [store] = useState(crearStore)
  return (
    <Provider store={store}>
      <Favoritas />
    </Provider>
  )
}

function Favoritas() {
  const { lista, cargando } = useSelector((s: State) => s)
  const dispatch = useDispatch<AppDispatch>()
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
