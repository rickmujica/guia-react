// Un módulo ES: lo que no se exporta queda privado a este archivo.
const IVA = 0.1

export type Moneda = 'USD' | 'PYG'

export function conIva(monto: number) {
  return Math.round(monto * (1 + IVA))
}

export function formatear(monto: number, moneda: Moneda = 'USD') {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: moneda }).format(monto)
}

// Un export por defecto (como mucho uno por archivo)
export default function rango(min: number, max: number) {
  return `${formatear(min)} – ${formatear(max)}`
}
