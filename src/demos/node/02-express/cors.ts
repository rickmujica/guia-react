import express from 'express'

export const app = express()

const permitidos = ['http://localhost:5173', 'https://mi-front.vercel.app']

// CORS a mano, para ver qué hace: el navegador manda el header Origin y solo deja que
// el JavaScript de esa página lea la respuesta si el servidor lo autoriza.
app.use((req, res, next) => {
  const origen = req.get('origin')
  if (origen && permitidos.includes(origen)) {
    res.set('Access-Control-Allow-Origin', origen)
    res.set('Vary', 'Origin')
  }
  // Antes de un PUT, DELETE o un pedido con headers propios, el navegador pregunta con OPTIONS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(204).end()
  }
  next()
})

app.get('/ofertas', (_req, res) => {
  res.json([{ id: 1, titulo: 'Frontend React Senior' }])
})
