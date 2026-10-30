import { readFile } from 'node:fs'

console.log('1. Código sincrónico: corre de un tirón, primero que todo')

setTimeout(() => console.log('6. setTimeout(0): fase de timers'), 0)
Promise.resolve().then(() => console.log('3. Promesa resuelta: microtarea'))
queueMicrotask(() => console.log('4. queueMicrotask: otra microtarea'))
process.nextTick(() => console.log('5. process.nextTick'))

readFile(import.meta.filename, () => {
  console.log('7. Terminó de leer el archivo: callback de I/O')
  // Adentro de un callback de I/O, setImmediate siempre gana a setTimeout(0)
  setTimeout(() => console.log('9. setTimeout(0) desde el I/O'), 0)
  setImmediate(() => console.log('8. setImmediate desde el I/O: fase check'))
})

console.log('2. Más código sincrónico')
