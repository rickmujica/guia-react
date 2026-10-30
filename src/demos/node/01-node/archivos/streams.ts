import { createReadStream, createWriteStream } from 'node:fs'
import { mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

const carpeta = await mkdtemp(join(tmpdir(), 'streams-'))
const csv = join(carpeta, 'visitas.csv')

// 1) Escribir un archivo grande de a pedazos, sin armarlo entero en memoria
function* filas() {
  yield 'fecha,pagina\n'
  for (let i = 0; i < 200_000; i++) yield `2026-10-${String((i % 30) + 1).padStart(2, '0')},/ofertas/${i % 15}\n`
}
await pipeline(Readable.from(filas()), createWriteStream(csv))
console.log(`CSV: ${((await stat(csv)).size / 1024 / 1024).toFixed(1)} MB`)

// 2) Leerlo línea por línea: en memoria hay un pedazo por vez, no el archivo entero
let visitasOferta3 = 0
for await (const linea of createInterface({ input: createReadStream(csv) })) {
  if (linea.endsWith('/ofertas/3')) visitasOferta3++
}
console.log('Visitas a la oferta 3:', visitasOferta3)

// 3) Una cadena de streams: leer → transformar → comprimir → escribir
const aMayusculas = new Transform({
  transform(pedazo, _codificacion, listo) {
    listo(null, pedazo.toString().toUpperCase())
  },
})
await pipeline(createReadStream(csv), aMayusculas, createGzip(), createWriteStream(`${csv}.gz`))
console.log(`Comprimido: ${((await stat(`${csv}.gz`)).size / 1024).toFixed(0)} KB`)

await rm(carpeta, { recursive: true })
