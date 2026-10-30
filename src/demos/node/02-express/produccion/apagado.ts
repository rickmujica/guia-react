import express from 'express'
import { setTimeout as esperar } from 'node:timers/promises'

const app = express()
app.get('/salud', (_req, res) => {
  res.json({ ok: true })
})
app.get('/lento', async (_req, res) => {
  await esperar(300) // un pedido que tarda: no lo queremos cortar a la mitad
  res.json({ listo: true })
})

const servidor = app.listen(0, () => console.log('Servidor listo'))

// Docker, Kubernetes o el proveedor mandan SIGTERM antes de apagar o reemplazar la app.
// Apagado prolijo: dejar de aceptar pedidos, terminar los que están en curso y cerrar recursos.
process.on('SIGTERM', () => {
  console.log('SIGTERM: no acepto más pedidos, termino los que están en curso…')
  servidor.close(() => {
    console.log('Pedidos terminados. Cierro la base de datos y salgo.')
    process.exit(0)
  })
  // Si algo se cuelga, salir igual después de un tiempo
  setTimeout(() => process.exit(1), 10_000).unref()
})

// Para el ejemplo: un pedido lento y, mientras tanto, la señal de apagado
servidor.on('listening', async () => {
  const { port } = servidor.address() as { port: number }
  const pedido = fetch(`http://localhost:${port}/lento`).then((r) => r.json())
  await esperar(50)
  process.kill(process.pid, 'SIGTERM')
  console.log('El pedido lento igual respondió:', await pedido)
})
