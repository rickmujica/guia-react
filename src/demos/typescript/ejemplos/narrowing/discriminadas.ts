// Unión discriminada: todas las variantes comparten una propiedad literal (el "discriminante")
// y cada una trae solo los datos que tienen sentido en ese caso.
type Pedido<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function mensaje(pedido: Pedido<string[]>) {
  switch (pedido.status) {
    case 'idle':
      return 'Tocá buscar'
    case 'loading':
      return 'Cargando…'
    case 'success':
      return `${pedido.data.length} ofertas` // solo acá existe data
    case 'error':
      return `Error: ${pedido.error}` // y solo acá existe error
  }
}

// Comparalo con la versión "bolsa de opcionales": permite estados imposibles
// (loading y error a la vez, data sin terminar de cargar) y obliga a revisar todo con ?.
type PedidoMalModelado = {
  loading: boolean
  error?: string
  data?: string[]
}
