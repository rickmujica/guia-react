import { useDispatch, useSelector } from 'react-redux'
import type { Dispatch } from 'redux'
import type { Action, State } from '../redux-vanilla/store'

// Versiones tipadas de los hooks: así no hay que escribir los tipos en cada componente.
export const useAppSelector = useSelector.withTypes<State>()
export const useAppDispatch = useDispatch.withTypes<Dispatch<Action>>()
