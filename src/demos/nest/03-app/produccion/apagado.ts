import { crearApp } from './app.js'

// Simula lo que hace Docker o Kubernetes al apagar un contenedor: le manda SIGTERM al proceso
const app = await crearApp()
await app.listen(0)
console.log('Escuchando. Mandando SIGTERM…')
process.kill(process.pid, 'SIGTERM')
