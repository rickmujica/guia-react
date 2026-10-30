// TypeScript infiere el tipo a partir del valor: no hace falta anotar todo.
let puesto = 'Frontend' // string
const modalidad = 'remoto' // "remoto": una const no cambia, así que el tipo es el literal
const postulaciones = [1, 2, 3] // number[]

// @ts-expect-error: Type 'number' is not assignable to type 'string'.
puesto = 42

// Las funciones infieren el tipo que devuelven.
function anual(mensual: number) {
  return mensual * 12 // devuelve number
}

// ¿Cuándo anotar? En los "bordes": parámetros, lo que exporta un módulo
// y cuando el valor inicial no alcanza para saber el tipo.
let seleccionado: string | null = null // sin la anotación sería solo null

// Si declarás sin valor, anotá: si no, queda como any implícito y se pierde el chequeo.
let respuesta: string
respuesta = 'Aceptada'
