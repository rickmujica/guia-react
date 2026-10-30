import express from 'express'
import { ofertas } from './datos.ts'

export const app = express()
app.use(express.json()) // lee los cuerpos JSON y los deja en req.body

// Un Router agrupa las rutas de un recurso; después se "monta" en un camino
const rutasOfertas = express.Router()

// GET /api/ofertas?modalidad=remoto&q=front
rutasOfertas.get('/', (req, res) => {
  const { modalidad, q } = req.query // lo que va después del ?
  let resultado = ofertas
  if (typeof modalidad === 'string') resultado = resultado.filter((o) => o.modalidad === modalidad)
  if (typeof q === 'string') {
    resultado = resultado.filter((o) => o.titulo.toLowerCase().includes(q.toLowerCase()))
  }
  res.json(resultado)
})

// GET /api/ofertas/3: los :parametros de la ruta llegan en req.params (siempre como string)
rutasOfertas.get('/:id', (req, res) => {
  const oferta = ofertas.find((o) => o.id === Number(req.params.id))
  if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' })
  res.json(oferta)
})

// POST /api/ofertas con un JSON en el cuerpo
rutasOfertas.post('/', (req, res) => {
  const nueva = { id: ofertas.length + 1, ...req.body }
  ofertas.push(nueva)
  res.status(201).location(`/api/ofertas/${nueva.id}`).json(nueva)
})

app.use('/api/ofertas', rutasOfertas)
