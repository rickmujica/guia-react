import { createServer } from 'node:http'

// Un servidor de prueba, para tener a quién pedirle algo
const servidor = createServer((req, res) => {
  if (req.url === '/lento') return setTimeout(() => res.end('por fin'), 1000)
  if (req.url === '/ofertas') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify([{ id: 1, titulo: 'Frontend React Senior' }]))
  }
  res.writeHead(404).end()
}).listen(0)
const { port } = servidor.address() as { port: number }
const base = `http://localhost:${port}`

// fetch viene incluido en Node (desde la 18): la misma API que en el navegador
const res = await fetch(`${base}/ofertas`)
console.log(res.status, res.headers.get('content-type'))
console.log(await res.json())

// fetch NO falla con un 404 o un 500: hay que mirar res.ok
const noExiste = await fetch(`${base}/no-existe`)
console.log('ok:', noExiste.ok, '· status:', noExiste.status)

// Sin timeout, un servidor colgado te deja esperando para siempre
try {
  await fetch(`${base}/lento`, { signal: AbortSignal.timeout(200) })
} catch (error) {
  console.log('Timeout:', (error as Error).name)
}

servidor.close()
servidor.closeAllConnections()
