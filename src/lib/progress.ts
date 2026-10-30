import { useSyncExternalStore } from 'react'

// El progreso de lectura se guarda en el localStorage del navegador:
// por guía, el último capítulo abierto y los capítulos terminados.
// Es un "store externo" como el del capítulo de useSyncExternalStore de la guía de React.

export type GuideProgress = {
  /** Último capítulo abierto */
  last?: string
  /** Cuándo se abrió (Date.now()) */
  lastAt?: number
  completed: string[]
}
export type Progress = Record<string, GuideProgress>

const PROGRESS_KEY = 'guias:progreso'
const SCROLL_KEY = 'guias:scroll'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback // modo privado, almacenamiento bloqueado o JSON roto
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin almacenamiento: el progreso vale solo para esta pestaña.
  }
}

let progress: Progress = read(PROGRESS_KEY, {})
const listeners = new Set<() => void>()

function setProgress(next: Progress) {
  progress = next
  write(PROGRESS_KEY, next)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Si la guía está abierta en otra pestaña, el evento storage avisa de sus cambios.
  function onStorage(event: StorageEvent) {
    if (event.key !== PROGRESS_KEY) return
    progress = read(PROGRESS_KEY, {})
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => progress)
}

export function guideProgress(all: Progress, guideId: string): GuideProgress {
  return all[guideId] ?? { completed: [] }
}

function update(guideId: string, change: (current: GuideProgress) => GuideProgress) {
  setProgress({ ...progress, [guideId]: change(guideProgress(progress, guideId)) })
}

export function visitChapter(guideId: string, slug: string) {
  update(guideId, (current) => ({ ...current, last: slug, lastAt: Date.now() }))
}

export function setCompleted(guideId: string, slug: string, done: boolean) {
  update(guideId, (current) => {
    const others = current.completed.filter((s) => s !== slug)
    return { ...current, completed: done ? [...others, slug] : others }
  })
}

export function resetGuide(guideId: string) {
  const next = { ...progress }
  delete next[guideId]
  setProgress(next)
}

// La posición del scroll cambia muy seguido y ningún componente la muestra,
// así que va aparte y no avisa a los suscriptores (no provoca renders).
export function saveScroll(guideId: string, slug: string, y: number) {
  const all = read<Record<string, number>>(SCROLL_KEY, {})
  all[`${guideId}/${slug}`] = Math.round(y)
  write(SCROLL_KEY, all)
}

export function readScroll(guideId: string, slug: string) {
  return read<Record<string, number>>(SCROLL_KEY, {})[`${guideId}/${slug}`] ?? 0
}

// "Continuar" pide volver a la posición guardada. Se anota antes de navegar
// y el layout effect del capítulo la consume al abrirlo. Arranca en true:
// al cargar (o recargar) la página también se vuelve a donde estabas.
let resumeRequested = true
export function requestResume() {
  resumeRequested = true
}
export function takeResumeRequest() {
  const value = resumeRequested
  resumeRequested = false
  return value
}
