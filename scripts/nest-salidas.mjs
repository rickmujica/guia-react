// Ejecuta los ejemplos de la guía de NestJS y guarda lo que imprimen en
// src/content/nest/salidas.json. La guía muestra esa salida debajo de cada ejemplo.
//
// Uso:  npm run salidas:nest
//
// Nest usa decoradores con metadatos de tipos (experimentalDecorators y emitDecoratorMetadata),
// que Node no puede ejecutar borrando los tipos: hay que compilar. Así que primero compila
// src/demos/nest con tsc (tsconfig.nest.json) a node_modules/.tmp/nest, como hace `nest build`,
// y después ejecuta el JavaScript compilado. Igual que en la guía de Node:
//
// - <Salida archivo="…" /> corre `node archivo.js` y guarda stdout, stderr y el código de salida.
// - <Api archivo="…"> con un bloque ```http levanta la app del archivo (su export `crearApp`),
//   le hace esos pedidos y guarda cada respuesta y lo que la app imprimió.
import { spawnSync } from 'node:child_process'
import { cp, glob, readFile, rm, writeFile } from 'node:fs/promises'
import { constants } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const fuentes = join(root, 'src/demos/nest')
const compilados = join(root, 'node_modules/.tmp/nest')
const { claveApi, claveScript, parsearPedidos } = await import('../src/lib/salidas.ts')

// 1. Compilar, como `nest build`
await rm(compilados, { recursive: true, force: true })
const tsc = spawnSync(
  process.execPath,
  [join(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.nest.json', '--noEmit', 'false', '--outDir', compilados],
  { cwd: root, encoding: 'utf8' },
)
if (tsc.status !== 0) {
  console.error(tsc.stdout, tsc.stderr)
  process.exit(1)
}
// Los archivos que no son .ts (JSON, .env de ejemplo) van al lado de los compilados
await cp(fuentes, compilados, { recursive: true, filter: (ruta) => !ruta.endsWith('.ts') })
const compilado = (archivo) => join(compilados, archivo.replace(/^nest\//, '').replace(/\.ts$/, '.js'))

// Rutas de esta máquina, números de proceso, fechas y tiempos, que cambian: así la salida es
// igual en cualquier lado.
const limpiar = (texto) =>
  texto
    .replaceAll(compilados, '~/proyecto/dist')
    .replaceAll(root.replace(/\/$/, ''), '~/guia-react')
    .replace(/\(node:\d+\)/g, '(node:4242)')
    .replace(/\[Nest\] \d+ +- [^\n]*?(?= +(LOG|ERROR|WARN|DEBUG|VERBOSE|FATAL) )/g, '[Nest] 4242  - 18/11/2026, 10:00:00')
    .replace(/ \+\d+ms$/gm, ' +0ms')
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
const version = async (paquete) =>
  JSON.parse(await readFile(join(root, 'node_modules', paquete, 'package.json'), 'utf8')).version

const salidas = {
  node: process.version,
  express: await version('express'),
  nest: await version('@nestjs/core'),
  scripts: {},
  apis: {},
}
const problemas = []

for await (const mdx of glob('src/content/nest/**/*.mdx', { cwd: root })) {
  const texto = await readFile(join(root, mdx), 'utf8')

  for (const m of texto.matchAll(/<Salida\b([^>]*?)\/>/g)) {
    const archivo = atributo(m[1], 'archivo')
    const args = atributo(m[1], 'args')
    const flags = atributo(m[1], 'flags')
    const ruta = compilado(archivo)
    const r = spawnSync(
      process.execPath,
      [...flags.split(' ').filter(Boolean), ruta, ...args.split(' ').filter(Boolean)],
      opciones(dirname(ruta)),
    )
    // Si lo terminó una señal (como SIGTERM), el código es 128 + el número de la señal, como en la terminal
    const codigo = r.status ?? (r.signal ? 128 + constants.signals[r.signal] : -1)
    const salida = { stdout: limpiar(r.stdout ?? ''), stderr: limpiar(r.stderr ?? ''), codigo }
    salidas.scripts[claveScript(archivo, args, flags)] = salida
    const esperaError = /\berror\b/.test(m[1].replace(/"[^"]*"/g, ''))
    if ((salida.codigo !== 0) !== esperaError) {
      problemas.push(`${mdx}: ${archivo} terminó con código ${salida.codigo}\n${salida.stdout}\n${salida.stderr}`)
    }
  }

  for (const m of texto.matchAll(/<Api\b([^>]*)>\s*```http\n([\s\S]*?)```\s*<\/Api>/g)) {
    const archivo = atributo(m[1], 'archivo')
    const pedidos = parsearPedidos(m[2])
    const ruta = compilado(archivo)
    const r = spawnSync(
      process.execPath,
      [join(root, 'scripts/node-api.mjs'), ruta, JSON.stringify(pedidos)],
      opciones(dirname(ruta)),
    )
    const [, resultado] = r.stdout?.match(/⟦RESULTADO⟧ (.*)\n/) ?? []
    if (!resultado) {
      problemas.push(`${mdx}: ${archivo} no respondió\n${limpiar(r.stdout ?? '')}\n${limpiar(r.stderr ?? '')}`)
      continue
    }
    // Lo que la app imprimió antes del primer pedido (el arranque) y entre la marca de un pedido
    // y la siguiente (la consola de ese pedido).
    const [arranque, ...consolas] = limpiar(r.stdout.slice(0, r.stdout.indexOf('⟦RESULTADO⟧'))).split(/⟦PEDIDO \d+⟧\n/)
    salidas.apis[claveApi(archivo, m[2])] = JSON.parse(resultado).map((respuesta, i) => ({
      pedido: pedidos[i],
      respuesta: { ...respuesta, consola: consolas[i] ?? '' },
      ...(i === 0 && arranque.trim() ? { arranque } : {}),
    }))
    if (r.stderr) problemas.push(`${mdx}: ${archivo} escribió en stderr\n${limpiar(r.stderr)}`)
  }
}

await writeFile(join(root, 'src/content/nest/salidas.json'), JSON.stringify(salidas, null, 1) + '\n')
console.log(
  `Node ${salidas.node}, NestJS ${salidas.nest}: ${Object.keys(salidas.scripts).length} scripts y ` +
    `${Object.keys(salidas.apis).length} APIs`,
)
if (problemas.length) {
  console.error(`\n${problemas.length} ejemplos no dieron lo esperado:\n\n${problemas.join('\n\n')}`)
  process.exit(1)
}
