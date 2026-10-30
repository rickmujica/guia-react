import { z } from 'zod'

// response.json() devuelve Promise<any>. Anotarlo con "as" no valida nada:
type Oferta = { id: number; empresa: string; salario: number }

async function cargarConfiando(): Promise<Oferta[]> {
  const res = await fetch('/api/ofertas')
  return (await res.json()) as Oferta[] // si el backend cambia, el error aparece lejos de acá
}

// Mejor: tratarlo como unknown y validarlo en el borde. Con Zod, el esquema ES el tipo.
const OfertaSchema = z.object({
  id: z.number(),
  empresa: z.string().min(1),
  salario: z.number().positive().optional(),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']),
})

// El tipo se deriva del esquema: no hay que escribirlo dos veces.
type OfertaValidada = z.infer<typeof OfertaSchema>
// { id: number; empresa: string; salario?: number | undefined; modalidad: 'remoto' | 'hibrido' | 'presencial' }

export async function cargarOfertas(): Promise<OfertaValidada[]> {
  const res = await fetch('/api/ofertas')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json: unknown = await res.json()
  return z.array(OfertaSchema).parse(json) // tira un error claro si algo no coincide
}

// safeParse no tira: devuelve una unión discriminada por success.
export function validar(json: unknown) {
  const resultado = OfertaSchema.safeParse(json)
  if (!resultado.success) {
    return resultado.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
  }
  return resultado.data.empresa // OfertaValidada
}
