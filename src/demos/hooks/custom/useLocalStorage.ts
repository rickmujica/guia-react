import { useEffect, useState } from 'react'

/** Como useState, pero el valor sobrevive a recargar la página. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initialValue : (JSON.parse(saved) as T)
    } catch {
      return initialValue // modo privado, JSON corrupto, etc.
    }
  })

  // Sincronizamos el estado con un sistema externo: localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // sin espacio o sin permisos: seguimos funcionando en memoria
    }
  }, [key, value])

  return [value, setValue] as const
}
