import { useState } from 'react'

type Usuario = { id: number; nombre: string }

export function Estado() {
  // Se infiere del valor inicial: number.
  const [contador, setContador] = useState(0)

  // Cuando el inicial no alcanza (null, [] o {}), pasá el tipo como genérico.
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [tags, setTags] = useState<string[]>([]) // sin <string[]> sería never[]

  // Uniones de literales para estados con pocas opciones.
  const [vista, setVista] = useState<'lista' | 'tablero'>('lista')

  function sumar() {
    // @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<number>'.
    setContador('1')

    // La función actualizadora recibe el valor anterior, ya tipado.
    setContador((anterior) => anterior + 1)
    setTags((anteriores) => [...anteriores, 'react'])
  }

  return (
    <div>
      {/* usuario puede ser null: hay que revisarlo antes de leer nombre */}
      <p>{usuario ? usuario.nombre : 'Sin sesión'}</p>
      <p>{usuario?.nombre ?? 'Sin sesión'}</p>
      <button onClick={() => setVista(vista === 'lista' ? 'tablero' : 'lista')}>Vista: {vista}</button>
      <button onClick={() => setUsuario({ id: 1, nombre: 'Rick' })}>Entrar</button>
      <button onClick={sumar}>{contador}</button>
      <p>{tags.join(', ')}</p>
    </div>
  )
}
