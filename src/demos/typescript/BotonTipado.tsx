import { useState, type ComponentProps, type CSSProperties } from 'react'

// Todas las props de un <button> nativo, más las nuestras.
type BotonProps = ComponentProps<'button'> & {
  variante?: 'primario' | 'secundario' | 'peligro'
  compacto?: boolean
  cargando?: boolean
}

const colores = {
  primario: { background: '#087ea4', color: '#fff', borderColor: '#087ea4' },
  secundario: {},
  peligro: { background: '#b91c1c', color: '#fff', borderColor: '#b91c1c' },
} satisfies Record<NonNullable<BotonProps['variante']>, CSSProperties>

function Boton({
  variante = 'secundario',
  compacto = false,
  cargando = false,
  disabled,
  children,
  style,
  ...resto
}: BotonProps) {
  return (
    <button
      {...resto} // onClick, type, aria-*, title… pasan tal cual al <button>
      disabled={disabled || cargando}
      aria-busy={cargando}
      style={{ ...colores[variante], padding: compacto ? '2px 8px' : undefined, ...style }}
    >
      {cargando ? 'Guardando…' : children}
    </button>
  )
}

export default function BotonTipado() {
  const [cargando, setCargando] = useState(false)
  const [clicks, setClicks] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <Boton variante="primario" onClick={() => setClicks((c) => c + 1)}>
          Primario ({clicks})
        </Boton>
        <Boton title="Un atributo nativo cualquiera" onClick={() => setClicks((c) => c + 1)}>
          Secundario
        </Boton>
        <Boton variante="peligro" compacto onClick={() => setClicks(0)}>
          Reiniciar
        </Boton>
      </div>
      <div className="row">
        <Boton
          variante="primario"
          cargando={cargando}
          onClick={() => {
            setCargando(true)
            setTimeout(() => setCargando(false), 1200)
          }}
        >
          Guardar
        </Boton>
        <span className="muted">cargando también lo deshabilita</span>
      </div>
    </div>
  )
}
