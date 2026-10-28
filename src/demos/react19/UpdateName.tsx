import { startTransition, useState, useTransition } from 'react'
import { updateName } from './api'

export default function UpdateName() {
  const [name, setName] = useState('')
  const [savedName, setSavedName] = useState('Ana')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startUpdate] = useTransition()

  function handleSubmit() {
    // Una Action: una función async dentro de una transición.
    // isPending es true desde que empieza hasta que termina TODA la función.
    startUpdate(async () => {
      setError(null)
      const error = await updateName(name)
      // Después de un await, envolvé los setState en startTransition
      // (limitación actual de React, documentada en react.dev).
      startTransition(() => {
        if (error) {
          setError(error)
        } else {
          setSavedName(name)
          setName('')
        }
      })
    })
  }

  return (
    <div className="stack">
      <p>
        Nombre guardado: <strong>{savedName}</strong>
      </p>
      <div className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nuevo nombre" />
        <button onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Guardando…' : 'Actualizar'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
