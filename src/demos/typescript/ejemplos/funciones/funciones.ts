// Parámetros con tipo; el retorno se infiere (anotalo en funciones exportadas si querés un contrato claro).
function sumar(a: number, b: number): number {
  return a + b
}

// Opcionales (?) y valores por defecto. Los opcionales van al final.
function saludar(nombre: string, saludo = 'Hola', firma?: string) {
  return `${saludo}, ${nombre}${firma ? ` — ${firma}` : ''}`
}

// Rest parameters
function promedio(...valores: number[]) {
  return valores.reduce((a, b) => a + b, 0) / valores.length
}

// Parámetro objeto desestructurado: el patrón más común en React (así son las props).
function crearPostulacion({ empresa, remoto = true }: { empresa: string; remoto?: boolean }) {
  return { empresa, remoto, fecha: new Date() }
}

// Tipo de una función: (parámetros) => retorno
type Filtro = (texto: string) => boolean
const esRemoto: Filtro = (texto) => texto.includes('remoto') // texto se infiere como string

// Callbacks: TypeScript infiere los parámetros del contexto.
const largos = ['Acme', 'Globex'].map((empresa) => empresa.length) // empresa: string

// async: siempre devuelve una Promise.
async function cargarOfertas(): Promise<string[]> {
  const respuesta = await fetch('/api/ofertas')
  return respuesta.json()
}

// @ts-expect-error: Expected 2 arguments, but got 1.
sumar(1)
