import { useState } from 'react'

type Oferta = { id: number; empresa: string; puesto: string }

// Cada estado trae solo los datos que tienen sentido en ese momento.
type Pedido =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Oferta[] }
  | { status: 'error'; error: string }

const ofertas: Oferta[] = [
  { id: 1, empresa: 'Nubelia', puesto: 'Frontend React' },
  { id: 2, empresa: 'Pagos Sur', puesto: 'Fullstack (Next.js)' },
]

function buscar(falla: boolean) {
  return new Promise<Oferta[]>((resolve, reject) =>
    setTimeout(() => (falla ? reject(new Error('El servidor no responde')) : resolve(ofertas)), 900),
  )
}

export default function EstadoPedido() {
  const [pedido, setPedido] = useState<Pedido>({ status: 'idle' })

  async function cargar(falla: boolean) {
    setPedido({ status: 'loading' })
    try {
      setPedido({ status: 'success', data: await buscar(falla) })
    } catch (e) {
      // En un catch, e es unknown: puede ser cualquier cosa, no solo un Error.
      setPedido({ status: 'error', error: e instanceof Error ? e.message : String(e) })
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => cargar(false)}>Buscar ofertas</button>
        <button onClick={() => cargar(true)}>Buscar (con error)</button>
        <button onClick={() => setPedido({ status: 'idle' })}>Reiniciar</button>
      </div>
      <Resultado pedido={pedido} />
      <pre className="log">{JSON.stringify(pedido, null, 2)}</pre>
    </div>
  )
}

function Resultado({ pedido }: { pedido: Pedido }) {
  // Dentro de cada case, TypeScript sabe qué campos existen.
  switch (pedido.status) {
    case 'idle':
      return <p className="muted">Todavía no buscaste nada.</p>
    case 'loading':
      return <p>Cargando…</p>
    case 'success':
      return (
        <ul>
          {pedido.data.map((o) => (
            <li key={o.id}>
              {o.puesto} en <strong>{o.empresa}</strong>
            </li>
          ))}
        </ul>
      )
    case 'error':
      return <p className="error-text">Error: {pedido.error}</p>
  }
}
