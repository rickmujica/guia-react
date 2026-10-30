import { readFile } from 'node:fs/promises' // los módulos de Node, con el prefijo node:
import { basename } from 'node:path'
import rango, { conIva, formatear, type Moneda } from './precios.ts' // con la extensión

const moneda: Moneda = 'PYG'
console.log(rango(3000, 4000))
console.log(formatear(conIva(1000)))
console.log(formatear(18_000_000, moneda))

// Dónde está este archivo (en CommonJS eran __dirname y __filename)
console.log('Carpeta:', basename(import.meta.dirname))
console.log('Archivo:', basename(import.meta.filename))

// await afuera de una función: se puede en el nivel superior de un módulo ES
const paquete = JSON.parse(await readFile(new URL('../../../../../package.json', import.meta.url), 'utf8'))
console.log('Proyecto:', paquete.name, '· type:', paquete.type)
