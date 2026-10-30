import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (clave: string, sal: Buffer, largo: number) => Promise<Buffer>

// Nunca se guarda la contraseña: se guarda un hash lento con una "sal" al azar.
export async function hashear(clave: string) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(clave, sal, 64)
  return `${sal.toString('hex')}:${hash.toString('hex')}`
}

export async function verificar(clave: string, guardado: string) {
  const [sal, hash] = guardado.split(':')
  const calculado = await scryptAsync(clave, Buffer.from(sal, 'hex'), 64)
  // timingSafeEqual tarda lo mismo aunque difieran en el primer byte (no da pistas)
  return timingSafeEqual(calculado, Buffer.from(hash, 'hex'))
}

if (import.meta.main) {
  const guardado = await hashear('secreto-123')
  console.log('Lo que se guarda:', guardado.length, 'caracteres (sal + hash en hexadecimal)')
  console.log('¿La misma clave da el mismo hash?', guardado === (await hashear('secreto-123')))
  console.log('Clave correcta:', await verificar('secreto-123', guardado))
  console.log('Clave incorrecta:', await verificar('secreto-124', guardado))
}
