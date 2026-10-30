import express, { type ErrorRequestHandler, type RequestHandler } from 'express'
import { ofertas } from './datos.ts'

export const app = express()

// 1) Para todos los pedidos: loguear cada uno cuando termina
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} → ${res.statusCode}`))
  next() // sin esto, el pedido se queda colgado acá
})
app.use(express.json())

// 2) Solo para algunas rutas: pedir una API key
const requiereApiKey: RequestHandler = (req, res, next) => {
  if (req.get('x-api-key') !== 'clave-de-prueba') {
    return res.status(401).json({ error: 'Falta la API key o es incorrecta' })
  }
  next()
}

app.get('/ofertas', (_req, res) => {
  res.json(ofertas.map((o) => o.titulo))
})

app.delete('/ofertas/:id', requiereApiKey, (req, res) => {
  const i = ofertas.findIndex((o) => o.id === Number(req.params.id))
  if (i === -1) return res.status(404).json({ error: 'Oferta no encontrada' })
  ofertas.splice(i, 1)
  res.status(204).end()
})

// 3) Una ruta async que falla: Express 5 manda el error al manejador de errores solo
app.get('/postulaciones', async () => {
  throw new Error('La base de datos no responde')
})

// 4) Si ninguna ruta respondió: 404
app.use((req, res) => {
  res.status(404).json({ error: `No existe ${req.method} ${req.path}` })
})

// 5) El manejador de errores: 4 parámetros, y va al final de todo
const manejarErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error.status ?? 500 // express.json() usa 400 para un JSON mal escrito
  console.error(`Error ${status}: ${error.message}`)
  res.status(status).json({ error: status === 500 ? 'Error interno' : error.message })
}
app.use(manejarErrores)
