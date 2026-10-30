// Utilidades compartidas entre <Salida>/<Api> y scripts/node-salidas.mjs.

/** Lo que imprimió un script de la guía de Node al ejecutarlo. */
export type SalidaScript = { stdout: string; stderr: string; codigo: number }

/** Un pedido HTTP de un bloque ```http: `MÉTODO /ruta [Header: valor] cuerpo`. */
export type Pedido = { metodo: string; ruta: string; headers: Record<string, string>; body?: string }

export type Respuesta = {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  /** Lo que la app imprimió en la consola mientras atendía este pedido. */
  consola: string
}

export type Salidas = {
  node: string
  express: string
  scripts: Record<string, SalidaScript>
  apis: Record<string, { pedido: Pedido; respuesta: Respuesta }[]>
}

/** Clave de un script en salidas.json: el archivo y sus argumentos. */
export const claveScript = (archivo: string, args = '', flags = '') =>
  [flags, archivo, args].filter(Boolean).join(' ')

/** Clave de una API en salidas.json: el archivo y los pedidos tal cual están escritos. */
export const claveApi = (archivo: string, pedidos: string) => `${archivo}\n${pedidos.trim()}`

/**
 * Un pedido por línea:
 *   GET /ofertas?modalidad=remoto
 *   POST /ofertas {"titulo": "Frontend"}
 *   GET /privado [Authorization: Bearer abc123]
 */
export function parsearPedidos(texto: string): Pedido[] {
  return texto
    .trim()
    .split('\n')
    .filter((linea) => linea.trim() && !linea.trim().startsWith('#'))
    .map((linea) => {
      const [, metodo, ruta, resto = ''] = linea.trim().match(/^([A-Z]+)\s+(\S+)\s*(.*)$/) ?? []
      if (!metodo) throw new Error(`Pedido mal escrito: ${linea}`)
      const headers: Record<string, string> = {}
      let body = resto
      for (let m; (m = body.match(/^\[([^:\]]+):\s*([^\]]*)\]\s*/)); body = body.slice(m[0].length)) {
        headers[m[1].toLowerCase()] = m[2]
      }
      if (body && !headers['content-type']) {
        headers['content-type'] = /^[[{]/.test(body) ? 'application/json' : 'text/plain'
      }
      return { metodo, ruta, headers, ...(body ? { body } : {}) }
    })
}
