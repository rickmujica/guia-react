import { createContext } from 'react'

/** El elemento de la pantalla del celular dibujado, donde se abren los Modal de las demos de React Native. */
export const PantallaTelefono = createContext<HTMLElement | null>(null)
