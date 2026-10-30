import express from 'express'

export const app = express()

// Una ruta = método HTTP + camino + función que responde
app.get('/', (_req, res) => {
  res.send('Hola desde Express')
})

app.get('/salud', (_req, res) => {
  res.json({ ok: true, version: '1.0.0' })
})

// Solo si se ejecuta este archivo (node hola.ts); los tests lo importan sin levantarlo
if (import.meta.main) {
  app.listen(3000, () => console.log('Escuchando en http://localhost:3000'))
}
