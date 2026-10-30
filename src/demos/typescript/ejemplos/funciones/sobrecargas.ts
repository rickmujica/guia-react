// Overloads: varias firmas para una misma función. Se usan poco en código de apps;
// casi siempre una unión o un genérico lo resuelve mejor. Las vas a ver en tipos de librerías.
function parsear(valor: string): number
function parsear(valor: string[]): number[]
function parsear(valor: string | string[]) {
  return Array.isArray(valor) ? valor.map(Number) : Number(valor)
}

const uno = parsear('3') // number
const varios = parsear(['1', '2']) // number[]

// void en un tipo de callback significa "no me importa lo que devuelvas".
// Por eso esto compila aunque push devuelva un número:
const lista: number[] = []
const alHacerClick: () => void = () => lista.push(1)
