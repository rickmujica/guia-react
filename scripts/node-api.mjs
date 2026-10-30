// Lo usa node-salidas.mjs, en un proceso aparte por ejemplo (así cada uno arranca de cero):
// carga la app de Express del ejemplo, la levanta en un puerto libre, le hace los pedidos
// y devuelve las respuestas. Lo que la app imprime queda separado por pedido con marcas.
import { pathToFileURL } from 'node:url'

const [archivo, pedidosJson] = process.argv.slice(2)
const pedidos = JSON.parse(pedidosJson)

// Lo que la app escribe con console.error también es parte de su consola
console.error = (...args) => console.log(...args)

// {variable} en un pedido se reemplaza por ese campo de una respuesta JSON anterior
// (por ejemplo, el token que devolvió un login).
const variables = {}
const completar = (texto) => texto?.replace(/\{(\w+)\}/g, (todo, nombre) => variables[nombre] ?? todo)

const modulo = await import(pathToFileURL(archivo).href)
const app = modulo.app ?? modulo.default ?? modulo.crearApp?.() // una app, o una función que la arma
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s))
})
const { port } = server.address()

const ignorar = new Set(['date', 'connection', 'keep-alive']) // cambian en cada corrida
const respuestas = []
for (const [i, { metodo, ruta, headers, body }] of pedidos.entries()) {
  process.stdout.write(`⟦PEDIDO ${i}⟧\n`)
  const r = await fetch(`http://localhost:${port}${completar(ruta)}`, {
    method: metodo,
    headers: Object.fromEntries(Object.entries(headers).map(([nombre, valor]) => [nombre, completar(valor)])),
    body: completar(body),
  })
  const texto = await r.text()
  try {
    for (const [nombre, valor] of Object.entries(JSON.parse(texto))) {
      if (typeof valor === 'string' || typeof valor === 'number') variables[nombre] = String(valor)
    }
  } catch {} // la respuesta no era JSON
  await new Promise((listo) => setTimeout(listo, 20)) // por si la app loguea al terminar la respuesta
  respuestas.push({
    status: r.status,
    statusText: r.statusText,
    headers: Object.fromEntries([...r.headers].filter(([nombre]) => !ignorar.has(nombre))),
    body: texto,
  })
}
process.stdout.write(`⟦RESULTADO⟧ ${JSON.stringify(respuestas)}\n`)
server.closeAllConnections()
process.exit(0)
