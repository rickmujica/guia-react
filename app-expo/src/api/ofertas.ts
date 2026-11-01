import { ofertas, type Oferta } from '@/demos/datos'

// Una API falsa que responde con demora, como un servidor. Para usar una de verdad,
// cada función hace un fetch a process.env.EXPO_PUBLIC_API_URL (ver el capítulo de datos).
const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))
const POR_PAGINA = 6

export type Pagina = { ofertas: Oferta[]; siguiente: number | null }

export async function buscarOfertas(texto: string, pagina: number): Promise<Pagina> {
  await esperar(500)
  const filtradas = ofertas.filter((o) =>
    `${o.titulo} ${o.empresa} ${o.stack.join(' ')}`.toLowerCase().includes(texto.trim().toLowerCase()),
  )
  const desde = pagina * POR_PAGINA
  return {
    ofertas: filtradas.slice(desde, desde + POR_PAGINA),
    siguiente: desde + POR_PAGINA < filtradas.length ? pagina + 1 : null,
  }
}

export async function obtenerOferta(id: number): Promise<Oferta> {
  await esperar(300)
  const oferta = ofertas.find((o) => o.id === id)
  if (!oferta) throw new Error('La oferta no existe')
  return oferta
}

export async function iniciarSesion(email: string, password: string) {
  await esperar(700)
  if (password !== 'expo1234') throw new Error('Email o contraseña incorrectos')
  return { token: `token-de-${email}`, nombre: email.split('@')[0] }
}
