import { use, useActionState, useOptimistic, type Ref } from 'react'
import { useFormStatus } from 'react-dom'

// useActionState: el tipo del estado sale del estado inicial y de lo que devuelve la acción.
type EstadoForm = { error: string | null; enviado: boolean }

async function guardar(anterior: EstadoForm, datos: FormData): Promise<EstadoForm> {
  const empresa = datos.get('empresa')
  if (typeof empresa !== 'string' || empresa.trim() === '') {
    return { ...anterior, error: 'Falta la empresa' }
  }
  await fetch('/api/postulaciones', { method: 'POST', body: datos })
  return { error: null, enviado: true }
}

export function Formulario() {
  const [estado, accion, pendiente] = useActionState(guardar, { error: null, enviado: false })
  // estado: EstadoForm · accion: (payload: FormData) => void · pendiente: boolean
  return (
    <form action={accion}>
      <input name="empresa" />
      {estado.error && <p role="alert">{estado.error}</p>}
      <BotonEnviar />
      {pendiente && <p>Guardando…</p>}
    </form>
  )
}

function BotonEnviar() {
  const { pending, data } = useFormStatus() // data: FormData | null
  return <button disabled={pending}>{pending ? `Enviando ${data?.get('empresa')}…` : 'Guardar'}</button>
}

// useOptimistic: el segundo genérico es lo que recibe la función que agrega el valor optimista.
type Nota = { id: string; texto: string; pendiente?: boolean }

export function Notas({ notas, agregar }: { notas: Nota[]; agregar: (texto: string) => Promise<void> }) {
  const [optimistas, agregarOptimista] = useOptimistic<Nota[], string>(notas, (actuales, texto) => [
    ...actuales,
    { id: crypto.randomUUID(), texto, pendiente: true },
  ])

  async function accion(datos: FormData) {
    const texto = String(datos.get('texto'))
    agregarOptimista(texto)
    await agregar(texto)
  }

  return (
    <form action={accion}>
      {optimistas.map((n) => (
        <p key={n.id} style={{ opacity: n.pendiente ? 0.5 : 1 }}>
          {n.texto}
        </p>
      ))}
      <input name="texto" />
    </form>
  )
}

// use(promesa): el tipo sale de la Promise.
export function Detalle({ ofertaPromise }: { ofertaPromise: Promise<{ empresa: string }> }) {
  const oferta = use(ofertaPromise) // { empresa: string }
  return <h2>{oferta.empresa}</h2>
}

// ref como prop (sin forwardRef):
export function Campo({ ref, ...props }: { ref?: Ref<HTMLInputElement>; placeholder?: string }) {
  return <input ref={ref} {...props} />
}
