import { sleep } from '../shared/utils'

// "Servidor" falso para las demos de React 19. Cada función tarda como una API real.

export async function updateName(name: string): Promise<string | null> {
  await sleep(1000)
  if (name.trim().length < 3) return 'El nombre tiene que tener al menos 3 letras.'
  return null // null = sin error
}

export async function saveOffer(company: string) {
  await sleep(900)
  return `Oferta de ${company} guardada a las ${new Date().toLocaleTimeString('es')}`
}

export async function updateInterviews(current: number, delta: number) {
  await sleep(600)
  return Math.max(0, current + delta)
}
