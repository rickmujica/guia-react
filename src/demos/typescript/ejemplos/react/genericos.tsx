import type { ReactNode } from 'react'

// Un componente genérico: el tipo de los items lo decide quien lo usa.
type ListaProps<T> = {
  items: T[]
  getKey: (item: T) => string | number
  renderItem: (item: T) => ReactNode
  vacio?: ReactNode
}

export function Lista<T>({ items, getKey, renderItem, vacio = 'Nada por acá' }: ListaProps<T>) {
  if (items.length === 0) return <p>{vacio}</p>
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

type Oferta = { id: number; empresa: string; salario: number }
type Contacto = { email: string; nombre: string }

export function Uso({ ofertas, contactos }: { ofertas: Oferta[]; contactos: Contacto[] }) {
  return (
    <>
      {/* T se infiere como Oferta: dentro de renderItem, "o" tiene empresa y salario. */}
      <Lista items={ofertas} getKey={(o) => o.id} renderItem={(o) => `${o.empresa}: USD ${o.salario}`} />

      {/* Y acá T es Contacto. */}
      <Lista items={contactos} getKey={(c) => c.email} renderItem={(c) => c.nombre} />

      {/* @ts-expect-error: Property 'salario' does not exist on type 'Contacto'. */}
      <Lista items={contactos} getKey={(c) => c.email} renderItem={(c) => c.salario} />
    </>
  )
}

// En un archivo .tsx, una arrow function genérica necesita una coma (<T,>)
// para que no se confunda con una etiqueta JSX:
export const Primero = <T,>({ items }: { items: T[] }) => <>{String(items[0])}</>
