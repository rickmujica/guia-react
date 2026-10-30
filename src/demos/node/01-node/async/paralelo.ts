import { setTimeout as esperar } from 'node:timers/promises'

// Simula pedidos a APIs que tardan distinto
async function pedir(nombre: string, ms: number, falla = false) {
  await esperar(ms)
  if (falla) throw new Error(`${nombre} respondió 500`)
  return `${nombre} (${ms} ms)`
}

const reloj = () => {
  const inicio = performance.now()
  return () => `~${Math.round((performance.now() - inicio) / 100) * 100} ms`
}

// Uno después del otro: los tiempos se suman
let tiempo = reloj()
await pedir('empresas', 300)
await pedir('ofertas', 200)
await pedir('postulaciones', 100)
console.log('En serie:', tiempo())

// Todos a la vez: tarda lo que tarde el más lento
tiempo = reloj()
const resultados = await Promise.all([pedir('empresas', 300), pedir('ofertas', 200), pedir('postulaciones', 100)])
console.log('Promise.all:', tiempo(), resultados)

// Promise.all falla apenas falla uno
try {
  await Promise.all([pedir('empresas', 300), pedir('ofertas', 100, true)])
} catch (error) {
  console.log('Promise.all con un error:', (error as Error).message)
}

// allSettled espera a todos y te dice cuál salió bien y cuál no
const todos = await Promise.allSettled([pedir('empresas', 300), pedir('ofertas', 100, true)])
console.log('allSettled:', todos.map((r) => (r.status === 'fulfilled' ? r.value : `✗ ${r.reason.message}`)))

// race: el primero que termine (bien o mal). any: el primero que termine bien
console.log('race:', await Promise.race([pedir('lento', 300), pedir('rápido', 100)]))
console.log('any:', await Promise.any([pedir('falla', 50, true), pedir('anda', 150)]))
