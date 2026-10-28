import { useState } from 'react'
import { ErrorBoundary } from '../shared/ErrorBoundary'

function OfferCounter() {
  const [offers, setOffers] = useState(0)
  if (offers === 3) {
    // Un error durante el render: lo atrapa el Error Boundary más cercano
    throw new Error('¡Demasiadas ofertas! (error de render simulado)')
  }
  return (
    <div className="row">
      <span>Ofertas: {offers}</span>
      <button onClick={() => setOffers((n) => n + 1)}>+1 (en la 3 explota)</button>
    </div>
  )
}

export default function ErrorBoundaryDemo() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="card stack">
          <p className="error-text">Algo salió mal: {error.message}</p>
          <button onClick={reset}>Reintentar</button>
        </div>
      )}
    >
      <OfferCounter />
    </ErrorBoundary>
  )
}
