export function rangoSalarial(min: number | null, max: number | null) {
  if (min === null && max === null) return 'A convenir'
  if (min === null) return `Hasta USD ${max}`
  if (max === null) return `Desde USD ${min}`
  if (min > max) throw new RangeError('El mínimo no puede ser mayor que el máximo')
  return `USD ${min} – ${max}`
}
