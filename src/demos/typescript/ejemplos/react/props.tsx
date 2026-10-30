import type { ReactNode } from 'react'

// Las props son un objeto: se tipan con type (o interface) y se desestructuran.
type TarjetaProps = {
  empresa: string
  puesto: string
  salario?: number // opcional
  etiquetas?: string[]
  children?: ReactNode // cualquier cosa que React pueda renderizar
}

export function Tarjeta({ empresa, puesto, salario, etiquetas = [], children }: TarjetaProps) {
  return (
    <article>
      <h3>
        {puesto} en {empresa}
      </h3>
      {salario !== undefined && <p>USD {salario}</p>}
      <p>{etiquetas.join(' · ')}</p>
      {children}
    </article>
  )
}

export function Lista() {
  return (
    <>
      <Tarjeta empresa="Acme" puesto="Frontend" salario={3000}>
        <button>Postularme</button>
      </Tarjeta>

      {/* @ts-expect-error: Property 'puesto' is missing. */}
      <Tarjeta empresa="Globex" />

      {/* @ts-expect-error: Type 'string' is not assignable to type 'number'. */}
      <Tarjeta empresa="Initech" puesto="React Dev" salario="3000" />
    </>
  )
}
