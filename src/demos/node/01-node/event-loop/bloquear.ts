const inicio = performance.now()
const redondear = (ms: number) => Math.round(ms / 100) * 100

setTimeout(() => {
  console.log(`El timer de 100 ms se ejecutó a los ~${redondear(performance.now() - inicio)} ms`)
}, 100)

// Medio segundo de cálculo sincrónico: mientras tanto, el event loop no puede hacer NADA
// (ni timers, ni responder pedidos HTTP, ni leer archivos).
let vueltas = 0
while (performance.now() - inicio < 500) vueltas++
console.log(`Bucle sincrónico terminado (~${redondear(performance.now() - inicio)} ms)`)
