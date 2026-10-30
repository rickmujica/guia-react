import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import postulacionesSlice from './postulacionesSlice'

// configureStore ya trae thunk, Redux DevTools y chequeos de mutaciones en desarrollo.
export function crearStore() {
  return configureStore({
    reducer: {
      [postulacionesSlice.reducerPath]: postulacionesSlice.reducer, // reducerPath es 'postulaciones'
    },
  })
}

// Los tipos salen del store: no hay que escribirlos a mano.
export type AppStore = ReturnType<typeof crearStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
