import express from 'express'
import { ofertas as iniciales, type Oferta } from './datos.ts'

export const app = express()
app.use(express.json())

let ofertas: Oferta[] = structuredClone(iniciales)
let ultimoId = ofertas.length

const buscar = (id: string) => ofertas.find((o) => o.id === Number(id))

// Listar, con filtro y paginación: GET /ofertas?modalidad=remoto&pagina=1&porPagina=2
app.get('/ofertas', (req, res) => {
  const { modalidad } = req.query
  const pagina = Number(req.query.pagina ?? 1)
  const porPagina = Number(req.query.porPagina ?? 10)
  const lista = modalidad ? ofertas.filter((o) => o.modalidad === modalidad) : ofertas
  res.json({
    datos: lista.slice((pagina - 1) * porPagina, pagina * porPagina),
    total: lista.length,
    pagina,
    porPagina,
  })
})

// Leer una
app.get('/ofertas/:id', (req, res) => {
  const oferta = buscar(req.params.id)
  if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' })
  res.json(oferta)
})

// Crear: 201 Created y dónde quedó el recurso nuevo
app.post('/ofertas', (req, res) => {
  const nueva: Oferta = { ...req.body, id: ++ultimoId }
  ofertas.push(nueva)
  res.status(201).location(`/ofertas/${nueva.id}`).json(nueva)
})

// Reemplazar entera (PUT) o cambiar algunos campos (PATCH)
app.put('/ofertas/:id', (req, res) => {
  const oferta = buscar(req.params.id)
  if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' })
  const reemplazo: Oferta = { ...req.body, id: oferta.id }
  ofertas = ofertas.map((o) => (o.id === oferta.id ? reemplazo : o))
  res.json(reemplazo)
})

app.patch('/ofertas/:id', (req, res) => {
  const oferta = buscar(req.params.id)
  if (!oferta) return res.status(404).json({ error: 'Oferta no encontrada' })
  Object.assign(oferta, req.body, { id: oferta.id })
  res.json(oferta)
})

// Borrar: 204 No Content (no hay nada que devolver)
app.delete('/ofertas/:id', (req, res) => {
  if (!buscar(req.params.id)) return res.status(404).json({ error: 'Oferta no encontrada' })
  ofertas = ofertas.filter((o) => o.id !== Number(req.params.id))
  res.status(204).end()
})
