import { createContext, use, useState } from 'react'

const CurrencyContext = createContext<'USD' | 'PYG'>('USD')

function Salary({ amountUsd, visible }: { amountUsd: number; visible: boolean }) {
  if (!visible) return <span className="muted">Salario oculto</span>

  // ✅ use() se puede llamar después de un return temprano o dentro de un if.
  // Con useContext esto rompería las reglas de los hooks.
  const currency = use(CurrencyContext)
  const amount = currency === 'USD' ? amountUsd : amountUsd * 7300
  return (
    <strong>
      {currency} {amount.toLocaleString('es')}
    </strong>
  )
}

export default function UseContextConditional() {
  const [currency, setCurrency] = useState<'USD' | 'PYG'>('USD')
  const [visible, setVisible] = useState(true)

  return (
    <CurrencyContext value={currency}>
      <div className="stack">
        <div className="row">
          <button onClick={() => setCurrency(currency === 'USD' ? 'PYG' : 'USD')}>Moneda: {currency}</button>
          <label className="row">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            Mostrar salario
          </label>
        </div>
        <p>
          Frontend Engineer en Nubelia · <Salary amountUsd={3200} visible={visible} />
        </p>
      </div>
    </CurrencyContext>
  )
}
