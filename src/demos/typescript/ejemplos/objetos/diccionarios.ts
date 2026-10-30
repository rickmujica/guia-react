// Objetos usados como diccionario: claves que no conocés de antemano.
type SalariosPorEmpresa = { [empresa: string]: number } // index signature
const salarios: SalariosPorEmpresa = { Acme: 3000, Globex: 3500 }

// Record<Clave, Valor> hace lo mismo y se lee mejor.
const conteo: Record<string, number> = {}
conteo['react'] = 3

// Con claves de una unión, Record obliga a completar todas.
type Estado = 'postulado' | 'entrevista' | 'oferta'
const colores: Record<Estado, string> = {
  postulado: 'gris',
  entrevista: 'azul',
  oferta: 'verde',
}

// @ts-expect-error: Property 'oferta' is missing.
const incompleto: Record<Estado, string> = { postulado: 'gris', entrevista: 'azul' }

// Ojo: con index signatures, acceder a una clave puede dar undefined aunque el tipo diga number.
// Activá "noUncheckedIndexedAccess" en tsconfig para que TypeScript te obligue a revisarlo.
const deGlobex = salarios['Globex'] // number (o number | undefined con esa opción)
