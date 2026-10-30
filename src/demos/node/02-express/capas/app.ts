import express, { type ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { ErrorDeNegocio, type Oferta } from './ofertas.ts'
import { crearRepoEnMemoria, type RepositorioOfertas } from './repositorio.ts'
import { crearRutasOfertas } from './rutas.ts'
import { crearServicioOfertas } from './servicio.ts'

const ejemplo: Oferta[] = [
  { id: 1, titulo: 'Frontend React Senior', empresa: 'Nubelia', modalidad: 'remoto', salarioMax: 4000 },
  { id: 2, titulo: 'React Native Developer', empresa: 'Pagos Sur', modalidad: 'hibrido', salarioMax: 3200 },
]

// La app recibe sus dependencias: en producción, el repo de MySQL; en los tests, uno en memoria.
export function crearApp({ repo = crearRepoEnMemoria(ejemplo) }: { repo?: RepositorioOfertas } = {}) {
  const app = express()
  app.use(express.json())
  app.use('/ofertas', crearRutasOfertas(crearServicioOfertas(repo)))
  app.use(manejarErrores)
  return app
}

const manejarErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: error.issues.map((i) => i.path.join('.')) })
  }
  if (error instanceof ErrorDeNegocio) return res.status(error.status).json({ error: error.message })
  console.error(error)
  res.status(500).json({ error: 'Error interno' })
}
