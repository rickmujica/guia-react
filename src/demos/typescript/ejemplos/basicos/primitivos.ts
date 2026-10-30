// Los tipos primitivos van en minúscula: string, number, boolean.
let empresa: string = 'Acme'
let salario: number = 3000 // number cubre enteros y decimales
let remoto: boolean = true
let id: bigint = 10n // enteros enormes (poco común en el front)
let clave: symbol = Symbol('clave')

// null y undefined son tipos propios. Con "strict" (activado por defecto en TS 7)
// no se pueden asignar a un string: hay que decirlo con una unión.
let notas: string | null = null
notas = 'Entrevista el lunes'

// @ts-expect-error: Type 'null' is not assignable to type 'string'.
empresa = null

// Arrays: dos formas de escribir lo mismo.
const tags: string[] = ['react', 'remoto']
const salarios: Array<number> = [2500, 3000]

// Tuplas: arrays de largo fijo con un tipo por posición (como lo que devuelve useState).
const rango: [min: number, max: number] = [2500, 4000]
const [min, max] = rango
