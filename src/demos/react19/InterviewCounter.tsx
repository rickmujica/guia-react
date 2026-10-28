import { startTransition, useActionState } from 'react'
import { updateInterviews } from './api'

type Payload = { type: 'add' } | { type: 'remove' }

// reducerAction: como un reducer, pero puede ser async y tener efectos secundarios
async function interviewsAction(current: number, payload: Payload) {
  return updateInterviews(current, payload.type === 'add' ? 1 : -1)
}

export default function InterviewCounter() {
  const [count, dispatch, isPending] = useActionState(interviewsAction, 0)

  function send(payload: Payload) {
    // dispatch tiene que llamarse dentro de una Action (transición)
    startTransition(() => dispatch(payload))
  }

  return (
    <div className="row">
      <button onClick={() => send({ type: 'remove' })}>−</button>
      <span style={{ fontSize: '1.6rem', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{count}</span>
      <button onClick={() => send({ type: 'add' })}>+</button>
      <span className={isPending ? 'muted' : 'ok-text'}>
        {isPending ? '⏳ Procesando la cola…' : 'Entrevistas agendadas'}
      </span>
    </div>
  )
}
