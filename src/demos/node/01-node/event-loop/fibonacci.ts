// Un cálculo pesado a propósito (recursivo, sin memoria)
export function fibonacci(n: number): number {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}
