// Las dos formas describen la forma de un objeto.
type Empresa = {
  nombre: string
  web?: string // opcional: puede no estar (su tipo es string | undefined)
  readonly id: number // no se puede reasignar
}

interface Postulacion {
  id: number
  empresa: Empresa
  puesto: string
  salario?: number
}

const acme: Empresa = { id: 1, nombre: 'Acme' }

// @ts-expect-error: Cannot assign to 'id' because it is a read-only property.
acme.id = 2

// @ts-expect-error: Property 'puesto' is missing in type ... but required in type 'Postulacion'.
const incompleta: Postulacion = { id: 1, empresa: acme }

// Los objetos literales no pueden traer propiedades de más (excess property check):
// @ts-expect-error: Object literal may only specify known properties, and 'pais' does not exist.
const conDeMas: Empresa = { id: 2, nombre: 'Globex', pais: 'PY' }
