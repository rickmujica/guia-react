import { createContext } from 'react'
import type { Guide } from '../guides'

// La guía que se está mostrando. La usan los links entre capítulos del MDX
// (`[texto](#/use-state)`) para saber a qué guía pertenece el capítulo.
export const GuideContext = createContext<Guide | null>(null)
