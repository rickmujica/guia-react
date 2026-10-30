// import type: importa solo tipos. Se borra al compilar, así que no agrega nada al bundle.
// Con "verbatimModuleSyntax" (lo trae la plantilla de Vite) es obligatorio para los tipos.
import type { ReactNode } from 'react'
import { useState, type Dispatch, type SetStateAction } from 'react' // mezclado en una línea

type Props = { children: ReactNode }

// Exportar tipos es igual que exportar valores.
export type Oferta = { id: number; empresa: string }
export interface Filtros {
  texto: string
}

export function useFiltro(): [string, Dispatch<SetStateAction<string>>] {
  return useState('')
}
