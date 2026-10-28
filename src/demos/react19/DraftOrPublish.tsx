import { startTransition, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { sleep } from '../shared/utils'

function FormStatusLine() {
  const { pending } = useFormStatus()
  return <span className="muted">{pending ? '⏳ Enviando…' : ''}</span>
}

export default function DraftOrPublish() {
  const [log, setLog] = useState<string[]>([])

  async function saveDraft(formData: FormData) {
    await sleep(700)
    startTransition(() => setLog((l) => [...l, `📝 Borrador guardado: "${formData.get('note')}"`]))
  }

  async function publish(formData: FormData) {
    await sleep(700)
    startTransition(() => setLog((l) => [...l, `🚀 Publicado: "${formData.get('note')}"`]))
  }

  return (
    <div className="stack">
      {/* formAction en cada botón pisa el action del form */}
      <form action={publish} className="stack">
        <textarea name="note" rows={2} required defaultValue="Busco rol Frontend remoto" />
        <div className="row">
          <button formAction={saveDraft}>Guardar borrador</button>
          <button type="submit" className="primary">
            Publicar
          </button>
          <FormStatusLine />
        </div>
      </form>
      <ul className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
