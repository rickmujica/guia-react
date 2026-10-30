import { useState, type ReactNode } from 'react'

// Un Select genérico: sirve para cualquier tipo de opción y devuelve la opción entera, no un string.
type SelectProps<T> = {
  opciones: T[]
  valor: T
  onChange: (opcion: T) => void
  getKey: (opcion: T) => string
  getLabel: (opcion: T) => string
}

function Select<T>({ opciones, valor, onChange, getKey, getLabel }: SelectProps<T>) {
  return (
    <select
      value={getKey(valor)}
      onChange={(e) => {
        const elegida = opciones.find((o) => getKey(o) === e.target.value)
        if (elegida !== undefined) onChange(elegida)
      }}
    >
      {opciones.map((o) => (
        <option key={getKey(o)} value={getKey(o)}>
          {getLabel(o)}
        </option>
      ))}
    </select>
  )
}

function Lista<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{render(item)}</li>
      ))}
    </ul>
  )
}

type Oferta = { id: number; empresa: string; salario: number }
type Moneda = { codigo: 'USD' | 'PYG' | 'ARS'; porDolar: number }

const ofertas: Oferta[] = [
  { id: 1, empresa: 'Nubelia', salario: 3200 },
  { id: 2, empresa: 'Pagos Sur', salario: 2800 },
  { id: 3, empresa: 'Andes Labs', salario: 4000 },
]
const monedas: Moneda[] = [
  { codigo: 'USD', porDolar: 1 },
  { codigo: 'PYG', porDolar: 7300 },
  { codigo: 'ARS', porDolar: 1400 },
]

export default function ListaGenerica() {
  const [oferta, setOferta] = useState(ofertas[0]) // Oferta
  const [moneda, setMoneda] = useState(monedas[0]) // Moneda

  return (
    <div className="stack">
      <div className="row">
        {/* T = Oferta */}
        <Select
          opciones={ofertas}
          valor={oferta}
          onChange={setOferta}
          getKey={(o) => String(o.id)}
          getLabel={(o) => o.empresa}
        />
        {/* T = Moneda */}
        <Select
          opciones={monedas}
          valor={moneda}
          onChange={setMoneda}
          getKey={(m) => m.codigo}
          getLabel={(m) => m.codigo}
        />
      </div>
      <p>
        {oferta.empresa} paga{' '}
        <strong>
          {(oferta.salario * moneda.porDolar).toLocaleString('es')} {moneda.codigo}
        </strong>{' '}
        por mes
        <span className="muted"> (tipos de cambio inventados)</span>
      </p>
      <Lista items={ofertas} render={(o) => `${o.empresa}: USD ${o.salario}`} />
    </div>
  )
}
