type Oferta = { id: number; empresa: string; salario?: number }

// Type predicate: una función que devuelve boolean y le "enseña" a TypeScript
// qué tipo tiene el valor cuando da true.
function tieneSalario(oferta: Oferta): oferta is Oferta & { salario: number } {
  return oferta.salario !== undefined
}

const ofertas: Oferta[] = [
  { id: 1, empresa: 'Acme', salario: 3000 },
  { id: 2, empresa: 'Globex' },
]

const conSalario = ofertas.filter(tieneSalario) // (Oferta & { salario: number })[]
const total = conSalario.reduce((suma, o) => suma + o.salario, 0) // sin "?." ni "!"

// Desde TS 5.5, TypeScript infiere el predicado en casos simples:
const nombres = ['Acme', null, 'Globex'].filter((n) => n !== null) // string[]

// Assertion function: si no tira error, de ahí en adelante el tipo queda achicado.
function asegurarDefinido<T>(valor: T, mensaje: string): asserts valor is NonNullable<T> {
  if (valor == null) throw new Error(mensaje)
}

const contenedor = document.getElementById('root') // HTMLElement | null
asegurarDefinido(contenedor, 'Falta el div#root')
contenedor.append('listo') // HTMLElement
