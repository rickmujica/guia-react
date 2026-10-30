import { setTimeout as esperar } from 'node:timers/promises'

// Una operación lenta que acepta una señal para cancelarla (como fetch)
async function buscarOfertas(signal: AbortSignal) {
  await esperar(1000, undefined, { signal })
  return ['Frontend React Senior']
}

// AbortSignal.timeout: se cancela sola si tarda más de 200 ms
try {
  await buscarOfertas(AbortSignal.timeout(200))
} catch (error) {
  console.log('Con timeout:', (error as Error).name)
}

// AbortController: la cancelás vos (por ejemplo, el usuario cerró la página)
const controller = new AbortController()
setTimeout(() => controller.abort(), 100)
try {
  await buscarOfertas(controller.signal)
} catch (error) {
  console.log('Cancelada a mano:', (error as Error).name)
}
