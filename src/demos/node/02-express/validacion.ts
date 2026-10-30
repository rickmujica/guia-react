import express, { type ErrorRequestHandler } from 'express'
import { z } from 'zod'
import { ofertas } from './datos.ts'

z.config(z.locales.es()) // mensajes de error en español

// El esquema describe y valida los datos; el tipo de TypeScript sale de ahí
const OfertaNueva = z.object({
  titulo: z.string().trim().min(3, 'El título necesita al menos 3 letras'),
  empresa: z.string().trim().min(1),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).default('remoto'),
  salarioMax: z.number().int().positive().nullable().default(null),
})
type OfertaNueva = z.infer<typeof OfertaNueva> // { titulo: string; empresa: string; ... }

// La query siempre llega como texto: z.coerce la convierte a número
const Filtros = z.object({
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).optional(),
  minimo: z.coerce.number().int().nonnegative().default(0),
})

export const app = express()
app.use(express.json())

app.get('/ofertas', (req, res) => {
  const { modalidad, minimo } = Filtros.parse(req.query) // si no es válida, lanza un ZodError
  res.json(
    ofertas.filter((o) => (!modalidad || o.modalidad === modalidad) && (o.salarioMax ?? 0) >= minimo),
  )
})

app.post('/ofertas', (req, res) => {
  const datos: OfertaNueva = OfertaNueva.parse(req.body)
  const nueva = { id: ofertas.length + 1, ...datos }
  ofertas.push(nueva)
  res.status(201).json(nueva)
})

// Un solo lugar convierte los errores de validación en un 400 con el detalle
const manejarErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: error.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message })),
    })
  }
  console.error(error)
  res.status(500).json({ error: 'Error interno' })
}
app.use(manejarErrores)
