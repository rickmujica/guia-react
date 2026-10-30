// Una unión es "uno de estos tipos". Antes de usarla, hay que achicarla (narrowing).
function formatearSalario(salario: number | string) {
  // @ts-expect-error: toFixed no existe en string, y salario podría ser un string.
  salario.toFixed(0)

  if (typeof salario === 'string') {
    return salario // acá es string
  }
  return `USD ${salario.toFixed(0)}` // y acá, number
}

// Las formas de achicar una unión:
function ejemplos(valor: string | string[] | Date | null | undefined) {
  if (valor == null) return // == null descarta null y undefined a la vez
  if (Array.isArray(valor)) return valor.join(', ') // string[]
  if (valor instanceof Date) return valor.toISOString() // Date
  return valor.toUpperCase() // solo queda string
}

type Remoto = { modalidad: 'remoto'; zonaHoraria: string }
type Presencial = { modalidad: 'presencial'; ciudad: string }

// "in" pregunta si el objeto tiene una propiedad.
function donde(trabajo: Remoto | Presencial) {
  if ('ciudad' in trabajo) return trabajo.ciudad
  return trabajo.zonaHoraria
}
