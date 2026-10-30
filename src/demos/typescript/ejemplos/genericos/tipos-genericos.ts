// Los tipos e interfaces también pueden ser genéricos.
type RespuestaApi<T> = {
  data: T
  pagina: number
  total: number
}

interface Caja<T> {
  valor: T
  actualizar: (nuevo: T) => void
}

type Oferta = { id: number; empresa: string }
const respuesta: RespuestaApi<Oferta[]> = { data: [], pagina: 1, total: 0 }

// Un tipo por defecto para el parámetro (como en las funciones):
type Resultado<T, E = Error> = { ok: true; valor: T } | { ok: false; error: E }

function dividir(a: number, b: number): Resultado<number, string> {
  if (b === 0) return { ok: false, error: 'No se puede dividir por cero' }
  return { ok: true, valor: a / b }
}

const r = dividir(10, 2)
if (r.ok) console.log(r.valor) // number
else console.log(r.error) // string

// Ya usaste genéricos sin darte cuenta: Array<T>, Promise<T>, useState<T>, Record<K, V>.
const pendiente: Promise<Oferta[]> = Promise.resolve([])
