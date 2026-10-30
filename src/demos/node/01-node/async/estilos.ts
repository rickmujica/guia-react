import { readFile } from 'node:fs'
import { readFile as readFileAsync } from 'node:fs/promises'
import { promisify } from 'node:util'

const archivo = new URL('./ofertas.json', import.meta.url)

// 1) La API de promesas (node:fs/promises) con async/await: lo que se usa hoy
async function contarOfertas() {
  try {
    const texto = await readFileAsync(archivo, 'utf8')
    return JSON.parse(texto).length
  } catch (error) {
    console.error('No se pudo leer:', (error as Error).message)
    return 0
  }
}
console.log('1. async/await:', await contarOfertas(), 'ofertas')

// Si falla, el await lanza el error y lo agarra el catch
try {
  await readFileAsync(new URL('./no-existe.json', import.meta.url), 'utf8')
} catch (error) {
  console.log('   Un archivo que no existe:', (error as NodeJS.ErrnoException).code)
}

// 2) Una función vieja de callbacks convertida en promesa
const leer = promisify(readFile)
console.log('2. promisify:', JSON.parse(await leer(archivo, 'utf8')).length, 'ofertas')

// 3) Callback "error primero": el estilo original de Node, que vas a ver en código viejo
readFile(archivo, 'utf8', (error, texto) => {
  if (error) return console.error('No se pudo leer:', error.message)
  console.log('3. Callback:', JSON.parse(texto).length, 'ofertas')
})
console.log('   (el callback todavía no corrió: readFile no bloquea)')
