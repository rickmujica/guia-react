import type { ComponentProps } from 'react'

// ComponentProps<'button'> son TODAS las props de un <button> nativo:
// onClick, disabled, type, aria-*, className… y desde React 19 también ref.
type BotonProps = ComponentProps<'button'> & {
  variante?: 'primario' | 'secundario'
}

export function Boton({ variante = 'primario', className = '', ...resto }: BotonProps) {
  // El resto (onClick, disabled, children…) pasa directo al <button>.
  return <button className={`boton boton--${variante} ${className}`} {...resto} />
}

// Para sacar o reemplazar alguna prop nativa, Omit:
type InputProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  onChange: (valor: string) => void // en vez del evento, te paso el texto
}

export function Input({ onChange, ...resto }: InputProps) {
  return <input {...resto} onChange={(e) => onChange(e.target.value)} />
}

// También funciona con componentes: las props de otro componente.
type PropsDelBoton = ComponentProps<typeof Boton>

export function Uso() {
  return (
    <>
      <Boton variante="secundario" onClick={() => alert('hola')} disabled>
        Guardar
      </Boton>
      <Input placeholder="Empresa" onChange={(texto) => console.log(texto.toUpperCase())} />
      {/* @ts-expect-error: '"peligro"' no es una variante válida. */}
      <Boton variante="peligro" />
    </>
  )
}
