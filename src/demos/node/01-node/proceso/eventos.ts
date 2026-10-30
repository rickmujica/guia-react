import { EventEmitter, once } from 'node:events'

type Postulacion = { empresa: string; estado: string }

// Los eventos que emite, con el tipo de sus argumentos
type Eventos = {
  nueva: [postulacion: Postulacion]
  cambio: [postulacion: Postulacion, anterior: string]
  error: [error: Error]
}

class Postulaciones extends EventEmitter<Eventos> {
  #lista: Postulacion[] = []

  agregar(empresa: string) {
    const postulacion = { empresa, estado: 'postulado' }
    this.#lista.push(postulacion)
    this.emit('nueva', postulacion)
  }

  avanzar(empresa: string, estado: string) {
    const postulacion = this.#lista.find((p) => p.empresa === empresa)
    if (!postulacion) return this.emit('error', new Error(`No hay postulación a ${empresa}`))
    const anterior = postulacion.estado
    postulacion.estado = estado
    this.emit('cambio', postulacion, anterior)
  }
}

const postulaciones = new Postulaciones()

// Varios oyentes para el mismo evento, cada uno con lo suyo
postulaciones.on('nueva', (p) => console.log(`Nueva postulación: ${p.empresa}`))
postulaciones.on('cambio', (p, anterior) => console.log(`${p.empresa}: ${anterior} → ${p.estado}`))
postulaciones.once('cambio', () => console.log('(once: este oyente se ejecuta solo la primera vez)'))
// Sin un oyente de 'error', emitir 'error' tira una excepción y corta el proceso
postulaciones.on('error', (error) => console.log('Error:', error.message))

postulaciones.agregar('Nubelia')
postulaciones.avanzar('Nubelia', 'entrevista')
postulaciones.avanzar('Nubelia', 'oferta')
postulaciones.avanzar('Pagos Sur', 'entrevista')

// once() de node:events devuelve una promesa: esperar un evento con await
setTimeout(() => postulaciones.agregar('Delta Pay'), 50)
const [nueva] = await once(postulaciones, 'nueva')
console.log('Llegó con await:', nueva.empresa)
