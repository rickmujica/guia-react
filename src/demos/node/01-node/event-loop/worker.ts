import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads'
import { fibonacci } from './fibonacci.ts'

if (isMainThread) {
  // Hilo principal: manda el cálculo a otro hilo y sigue atendiendo lo suyo
  const worker = new Worker(import.meta.filename, { workerData: 35 })
  worker.on('message', (resultado) => {
    console.log(`Worker: fibonacci(35) = ${resultado}`)
    clearInterval(latido)
  })

  let latidos = 0
  const latido = setInterval(() => {
    latidos++
    if (latidos === 1) console.log('Principal: sigo libre mientras el worker calcula')
  }, 10)
} else {
  // Este mismo archivo, ejecutado en el worker
  parentPort?.postMessage(fibonacci(workerData))
}
