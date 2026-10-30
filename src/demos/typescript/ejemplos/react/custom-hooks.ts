import { useEffect, useState } from 'react'

// Un custom hook que devuelve una tupla: as const para que sea [T, setter] y no (T | setter)[].
export function useToggle(inicial = false) {
  const [valor, setValor] = useState(inicial)
  const alternar = () => setValor((v) => !v)
  return [valor, alternar] as const // readonly [boolean, () => void]
}

// Si devuelve varias cosas, un objeto se lee mejor que una tupla.
export function useContador(inicial = 0) {
  const [cuenta, setCuenta] = useState(inicial)
  return { cuenta, sumar: () => setCuenta((c) => c + 1), reiniciar: () => setCuenta(inicial) }
}

// Genérico: el tipo del valor guardado lo decide quien usa el hook.
export function useLocalStorage<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const guardado = localStorage.getItem(clave)
    return guardado ? (JSON.parse(guardado) as T) : inicial
  })

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor] as const
}

export function useEjemplo() {
  const [abierto, alternar] = useToggle()
  const [tema, setTema] = useLocalStorage<'claro' | 'oscuro'>('tema', 'claro')
  const [favoritos, setFavoritos] = useLocalStorage('favoritos', [] as number[])

  // @ts-expect-error: '"azul"' no es un tema válido.
  setTema('azul')

  setFavoritos((f) => [...f, 3])
  return { abierto, alternar, tema }
}
