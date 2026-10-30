// Sacar tipos de cosas que ya existen, en vez de escribirlos dos veces.

// typeof (en posición de tipo): el tipo de una variable.
const ofertaDeEjemplo = { id: 1, empresa: 'Acme', remoto: true }
type Oferta = typeof ofertaDeEjemplo // { id: number; empresa: string; remoto: boolean }

// keyof: la unión de las claves de un tipo.
type CampoOferta = keyof Oferta // 'id' | 'empresa' | 'remoto'

// Indexed access: el tipo de una propiedad.
type Empresa = Oferta['empresa'] // string

// ReturnType y Parameters: los tipos de una función.
function crearFiltro(texto: string, soloRemoto: boolean) {
  return { texto: texto.trim(), soloRemoto, creado: Date.now() }
}
type Filtro = ReturnType<typeof crearFiltro> // { texto: string; soloRemoto: boolean; creado: number }
type ArgsFiltro = Parameters<typeof crearFiltro> // [texto: string, soloRemoto: boolean]

// Awaited: lo que hay "adentro" de una Promise.
async function cargar() {
  return [ofertaDeEjemplo]
}
type Cargadas = Awaited<ReturnType<typeof cargar>> // { id; empresa; remoto }[]

// El elemento de un array: [number]
const etapas = ['postulado', 'entrevista', 'oferta'] as const
type Etapa = (typeof etapas)[number] // 'postulado' | 'entrevista' | 'oferta'
