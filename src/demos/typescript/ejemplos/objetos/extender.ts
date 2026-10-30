// Extender: interface usa extends, type usa intersección (&). El resultado es el mismo.
interface Persona {
  nombre: string
  email: string
}

interface Reclutador extends Persona {
  empresa: string
}

type Candidato = Persona & {
  seniority: 'junior' | 'semi' | 'senior'
}

const ana: Reclutador = { nombre: 'Ana', email: 'ana@acme.com', empresa: 'Acme' }
const yo: Candidato = { nombre: 'Rick', email: 'rick@mail.com', seniority: 'senior' }

// Diferencia 1: solo type puede ser una unión, una tupla o un alias de un primitivo.
type Id = string | number
type Par = [string, number]

// Diferencia 2: las interfaces con el mismo nombre se fusionan ("declaration merging").
// Sirve para ampliar tipos de librerías (por ejemplo, Window); en tu código suele ser una sorpresa.
interface Config {
  tema: string
}
interface Config {
  idioma: string
}
const config: Config = { tema: 'oscuro', idioma: 'es' } // necesita las dos
