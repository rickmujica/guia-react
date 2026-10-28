import { startTransition, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { sleep } from '../shared/utils'

// Un botón reutilizable que "sabe" si su <form> se está enviando.
// Tiene que renderizarse DENTRO del form: useFormStatus lee el form padre.
function SubmitButton() {
  const { pending, data } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? `Suscribiendo ${data?.get('email')}…` : 'Suscribirme'}
    </button>
  )
}

export default function SubscribeForm() {
  const [subscribed, setSubscribed] = useState<string[]>([])

  // La action recibe el FormData del formulario: no hace falta estado por input
  async function subscribe(formData: FormData) {
    const email = String(formData.get('email'))
    await sleep(1200) // "llamada a la API"
    startTransition(() => setSubscribed((list) => [...list, email]))
    // Al terminar con éxito, React resetea el form solo (los inputs no controlados)
  }

  return (
    <div className="stack">
      <form action={subscribe} className="row">
        <input name="email" type="email" required placeholder="tu@email.com" />
        <SubmitButton />
      </form>
      {subscribed.length > 0 && (
        <p className="ok-text">Alertas de empleo activadas para: {subscribed.join(', ')}</p>
      )}
    </div>
  )
}
