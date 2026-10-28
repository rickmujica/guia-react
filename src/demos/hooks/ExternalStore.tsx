import { useSyncExternalStore } from 'react'

// Un "store" mínimo fuera de React (así funcionan Zustand, Redux, etc. por dentro)
function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    getState: () => state,
    setState(next: T) {
      state = next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const savedJobsStore = createStore<string[]>(['Nubelia'])

function useSavedJobs() {
  return useSyncExternalStore(savedJobsStore.subscribe, savedJobsStore.getState)
}

// Dos componentes que NO comparten padre ni props, pero leen el mismo store
function SaveButtons() {
  const saved = useSavedJobs()
  return (
    <div className="row">
      {['Nubelia', 'Pagos Sur', 'Datalab'].map((company) => (
        <button
          key={company}
          className={saved.includes(company) ? 'active' : ''}
          onClick={() =>
            savedJobsStore.setState(
              saved.includes(company) ? saved.filter((c) => c !== company) : [...saved, company],
            )
          }
        >
          {saved.includes(company) ? '★' : '☆'} {company}
        </button>
      ))}
    </div>
  )
}

function SavedCounter() {
  const saved = useSavedJobs()
  return <p className="muted">Guardadas: {saved.length ? saved.join(', ') : 'ninguna'}</p>
}

export default function ExternalStoreDemo() {
  return (
    <div className="stack">
      <SaveButtons />
      <SavedCounter />
    </div>
  )
}
