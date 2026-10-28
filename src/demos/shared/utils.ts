// Utilidades compartidas por las demos.

/** Espera `ms` milisegundos. Simula la latencia de una API. */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** Bloquea el hilo principal `ms` milisegundos. Simula un componente "lento". */
export function blockFor(ms: number) {
  const end = performance.now() + ms
  while (performance.now() < end) {
    // no hacemos nada: solo gastamos tiempo a propósito
  }
}
