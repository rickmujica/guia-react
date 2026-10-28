import { startTransition, useState, useTransition, type ReactNode } from 'react'
import { saveOffer } from './api'

type ActionButtonProps = {
  /** Convención: las props que se ejecutan dentro de una transición se llaman "action" */
  action: () => void | Promise<void>
  children: ReactNode
}

// Componente de "design system": maneja su propio estado pendiente.
function ActionButton({ action, children }: ActionButtonProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await action() // puede ser sync o async
        })
      }}
    >
      {isPending ? '⏳ ' : ''}
      {children}
    </button>
  )
}

export default function ActionButtonDemo() {
  const [message, setMessage] = useState('')

  return (
    <div className="stack">
      <div className="row">
        {/* El padre solo dice QUÉ hacer; el botón se encarga del pending */}
        <ActionButton
          action={async () => {
            const result = await saveOffer('Nubelia')
            startTransition(() => setMessage(result))
          }}
        >
          Guardar oferta de Nubelia
        </ActionButton>
        <ActionButton
          action={async () => {
            const result = await saveOffer('Datalab')
            startTransition(() => setMessage(result))
          }}
        >
          Guardar oferta de Datalab
        </ActionButton>
      </div>
      {message && <p className="ok-text">{message}</p>}
    </div>
  )
}
