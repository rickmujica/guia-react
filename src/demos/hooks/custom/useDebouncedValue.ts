import { useEffect, useState } from 'react'

/** Devuelve `value`, pero recién cuando dejó de cambiar durante `delayMs`. */
export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    // Si value cambia antes de que pase el tiempo, el cleanup cancela el timeout anterior.
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
