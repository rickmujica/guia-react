// Ejecuta los ejemplos de la guía de Node.js y Express y guarda lo que imprimen en
// src/content/node/salidas.json. La guía muestra esa salida debajo de cada ejemplo.
//
// Uso:  npm run salidas
// Necesita Node 24 o superior: los ejemplos son archivos .ts que Node ejecuta directamente.
//
// - <Salida archivo="…" /> corre `node archivo.ts` y guarda stdout, stderr y el código de salida.
// - <Api archivo="…"> con un bloque ```http levanta la app de Express del archivo (su export
//   `app`), le hace esos pedidos y guarda cada respuesta y lo que la app imprimió.
import { spawnSync } from 'node:child_process'
import { glob, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { claveApi, claveScript, parsearPedidos } = await import('../src/lib/salidas.ts')

// Rutas de esta máquina y números de proceso, que cambian: así la salida es igual en cualquier lado.
const limpiar = (texto) =>
  texto
    .replaceAll(root.replace(/\/$/, ''), '~/guia-react')
    .replace(/\(node:\d+\)/g, '(node:4242)')
    // Las líneas internas de Node en los errores (si una termina en " {", la llave queda)
    .replace(/\n +at [^\n]*node:internal[^\n]*?( \{)?(?=\n)/g, (_linea, llave) => llave ?? '')
    .replace(/\(\d+(\.\d+)?ms\)/g, '(…ms)') // tiempos de los tests
    .replace(/duration_ms \d+(\.\d+)?/g, 'duration_ms …')

const atributo = (atributos, nombre) => atributos.match(new RegExp(`\\b${nombre}="([^"]*)"`))?.[1] ?? ''
const opciones = (cwd) => ({
  cwd,
  encoding: 'utf8',
  timeout: 20_000,
  env: { PATH: process.env.PATH, HOME: process.env.HOME, TZ: 'UTC', LANG: 'C.UTF-8', NO_COLOR: '1' },
})

const salidas = {
  node: process.version,
  express: JSON.parse(await readFile(join(root, 'node_modules/express/package.json'), 'utf8')).version,
  scripts: {},
  apis: {},
}
const problemas = []

for await (const mdx of glob('src/content/node/**/*.mdx', { cwd: root })) {
  const texto = await readFile(join(root, mdx), 'utf8')

  for (const m of texto.matchAll(/<Salida\b([^>]*?)\/>/g)) {
    const archivo = atributo(m[1], 'archivo')
    const args = atributo(m[1], 'args')
    const flags = atributo(m[1], 'flags')
    const ruta = join(root, 'src/demos', archivo)
    const r = spawnSync(
      process.execPath,
      [...flags.split(' ').filter(Boolean), ruta, ...args.split(' ').filter(Boolean)],
      opciones(dirname(ruta)),
    )
    const salida = { stdout: limpiar(r.stdout ?? ''), stderr: limpiar(r.stderr ?? ''), codigo: r.status ?? -1 }
    salidas.scripts[claveScript(archivo, args, flags)] = salida
    const esperaError = /\berror\b/.test(m[1].replace(/"[^"]*"/g, ''))
    if ((salida.codigo !== 0) !== esperaError) {
      problemas.push(`${mdx}: ${archivo} terminó con código ${salida.codigo}\n${salida.stderr}`)
    }
  }

  for (const m of texto.matchAll(/<Api\b([^>]*)>\s*```http\n([\s\S]*?)```\s*<\/Api>/g)) {
    const archivo = atributo(m[1], 'archivo')
    const pedidos = parsearPedidos(m[2])
    const ruta = join(root, 'src/demos', archivo)
    const r = spawnSync(
      process.execPath,
      [join(root, 'scripts/node-api.mjs'), ruta, JSON.stringify(pedidos)],
      opciones(dirname(ruta)),
    )
    const [, resultado] = r.stdout?.match(/⟦RESULTADO⟧ (.*)\n/) ?? []
    if (!resultado) {
      problemas.push(`${mdx}: ${archivo} no respondió\n${limpiar(r.stderr ?? '')}`)
      continue
    }
    // Lo que la app imprimió entre la marca de un pedido y la siguiente es la consola de ese pedido.
    const consolas = limpiar(r.stdout.slice(0, r.stdout.indexOf('⟦RESULTADO⟧')))
      .split(/⟦PEDIDO \d+⟧\n/)
      .slice(1)
    salidas.apis[claveApi(archivo, m[2])] = JSON.parse(resultado).map((respuesta, i) => ({
      pedido: pedidos[i],
      respuesta: { ...respuesta, consola: consolas[i] ?? '' },
    }))
    if (r.stderr) problemas.push(`${mdx}: ${archivo} escribió en stderr\n${limpiar(r.stderr)}`)
  }
}

await writeFile(join(root, 'src/content/node/salidas.json'), JSON.stringify(salidas, null, 1) + '\n')
console.log(
  `Node ${salidas.node}, Express ${salidas.express}: ${Object.keys(salidas.scripts).length} scripts y ` +
    `${Object.keys(salidas.apis).length} APIs`,
)
if (problemas.length) {
  console.error(`\n${problemas.length} ejemplos no dieron lo esperado:\n\n${problemas.join('\n\n')}`)
  process.exit(1)
}
