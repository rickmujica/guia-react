import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

const ofertas = [
  { id: 1, titulo: 'Frontend React Senior', modalidad: 'remoto' },
  { id: 2, titulo: 'Fullstack Node', modalidad: 'remoto' },
]

function responderJson(res: ServerResponse, status: number, datos: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(datos))
}

// El cuerpo de un pedido llega en pedazos (es un stream): hay que juntarlos
async function leerCuerpo(req: IncomingMessage) {
  let texto = ''
  for await (const pedazo of req) texto += pedazo
  return JSON.parse(texto)
}

// Una sola función atiende TODOS los pedidos: el "ruteo" es a mano
export const app = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  console.log(req.method, url.pathname)

  if (req.method === 'GET' && url.pathname === '/ofertas') {
    return responderJson(res, 200, ofertas)
  }
  const id = url.pathname.match(/^\/ofertas\/(\d+)$/)?.[1]
  if (req.method === 'GET' && id) {
    const oferta = ofertas.find((o) => o.id === Number(id))
    return oferta ? responderJson(res, 200, oferta) : responderJson(res, 404, { error: 'No existe' })
  }
  if (req.method === 'POST' && url.pathname === '/ofertas') {
    try {
      const nueva = { id: ofertas.length + 1, ...(await leerCuerpo(req)) }
      ofertas.push(nueva)
      return responderJson(res, 201, nueva)
    } catch {
      return responderJson(res, 400, { error: 'JSON inválido' })
    }
  }
  responderJson(res, 404, { error: `No existe ${req.method} ${url.pathname}` })
})

// Solo si se ejecuta este archivo (node servidor.ts), no cuando otro lo importa
if (import.meta.main) {
  app.listen(3000, () => console.log('Escuchando en http://localhost:3000'))
}
