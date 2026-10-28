import { startTransition, useOptimistic, useState } from 'react'
import { sleep } from '../shared/utils'

export default function OptimisticLike() {
  const [saved, setSaved] = useState(false)
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved)

  function toggle() {
    startTransition(async () => {
      setOptimisticSaved(!saved) // la UI cambia al instante
      await sleep(1000) // la API tarda
      startTransition(() => setSaved(!saved))
    })
  }

  return (
    <div className="row">
      <button onClick={toggle} className={optimisticSaved ? 'active' : ''}>
        {optimisticSaved ? '★ Guardada' : '☆ Guardar oferta'}
      </button>
      <span className="muted">
        Valor real: {saved ? 'guardada' : 'no guardada'}
        {optimisticSaved !== saved && ' (sincronizando…)'}
      </span>
    </div>
  )
}
