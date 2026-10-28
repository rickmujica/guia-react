import { startTransition, useOptimistic, useState } from 'react'
import { sleep } from '../shared/utils'

type Note = { id: string; text: string; sending?: boolean }

async function sendNote(text: string, shouldFail: boolean): Promise<Note> {
  await sleep(1500)
  if (shouldFail) throw new Error(`No se pudo enviar "${text}". Probá de nuevo.`)
  return { id: crypto.randomUUID(), text }
}

export default function OptimisticNotes() {
  const [notes, setNotes] = useState<Note[]>([{ id: '1', text: 'Hola, vi la oferta de Frontend 👋' }])
  const [error, setError] = useState<string | null>(null)
  const [shouldFail, setShouldFail] = useState(false)

  // optimisticNotes = notes + lo que agregamos mientras la Action está en curso
  const [optimisticNotes, addOptimisticNote] = useOptimistic(notes, (current: Note[], newNote: Note) => [
    ...current,
    newNote,
  ])

  async function sendAction(formData: FormData) {
    const text = String(formData.get('text') ?? '').trim()
    if (!text) return
    setError(null)
    addOptimisticNote({ id: crypto.randomUUID(), text, sending: true }) // aparece YA
    try {
      const saved = await sendNote(text, shouldFail)
      startTransition(() => setNotes((list) => [...list, saved])) // el dato real
    } catch (e) {
      startTransition(() => setError((e as Error).message))
    }
    // Cuando la Action termina, el estado optimista se descarta solo.
  }

  return (
    <div className="stack">
      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {optimisticNotes.map((note) => (
          <li key={note.id} className={`card ${note.sending ? 'pending' : ''}`}>
            {note.text} {note.sending && <small className="muted">· enviando…</small>}
          </li>
        ))}
      </ul>
      <form action={sendAction} className="row">
        <input name="text" placeholder="Escribile al recruiter…" autoComplete="off" />
        <button type="submit">Enviar</button>
      </form>
      <label className="row">
        <input type="checkbox" checked={shouldFail} onChange={(e) => setShouldFail(e.target.checked)} />
        Simular error del servidor
      </label>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
