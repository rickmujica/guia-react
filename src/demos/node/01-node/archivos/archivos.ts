import { appendFile, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Una carpeta temporal para no ensuciar el proyecto
const carpeta = await mkdtemp(join(tmpdir(), 'postulaciones-'))

const postulaciones = [
  { empresa: 'Nubelia', estado: 'entrevista' },
  { empresa: 'Pagos Sur', estado: 'oferta' },
]
await writeFile(join(carpeta, 'postulaciones.json'), JSON.stringify(postulaciones, null, 2))
await writeFile(join(carpeta, 'notas.txt'), 'Preparar live coding\n')
await appendFile(join(carpeta, 'notas.txt'), 'Repasar el event loop\n')

const leidas = JSON.parse(await readFile(join(carpeta, 'postulaciones.json'), 'utf8'))
console.log('Postulaciones:', leidas.map((p: { empresa: string }) => p.empresa))
console.log('Notas:\n' + (await readFile(join(carpeta, 'notas.txt'), 'utf8')))

for (const nombre of (await readdir(carpeta)).sort()) {
  const info = await stat(join(carpeta, nombre))
  console.log(`${nombre}: ${info.size} bytes`)
}

await rm(carpeta, { recursive: true }) // borrar la carpeta con todo lo que tiene
