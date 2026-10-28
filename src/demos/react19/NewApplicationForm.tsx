import { useActionState } from 'react'
import { createApplication, initialFormState } from './applications-api'

export default function NewApplicationForm() {
  // [estado, acción para el form, ¿está pendiente?]
  const [state, formAction, isPending] = useActionState(createApplication, initialFormState)

  return (
    <div className="grid-2">
      {/* Sin onSubmit, sin preventDefault, sin useState por campo */}
      <form action={formAction} className="stack">
        <label className="stack">
          Empresa
          <input name="company" defaultValue={state.values.company} />
          {state.errors.company && <span className="error-text">{state.errors.company}</span>}
        </label>
        <label className="stack">
          Puesto
          <input name="role" defaultValue={state.values.role} />
          {state.errors.role && <span className="error-text">{state.errors.role}</span>}
        </label>
        <label className="stack">
          Salario mensual (USD)
          <input name="salary" type="number" defaultValue={state.values.salary} />
          {state.errors.salary && <span className="error-text">{state.errors.salary}</span>}
        </label>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Guardando…' : 'Guardar postulación'}
        </button>
        {state.message && (
          <p className={state.status === 'error' ? 'error-text' : 'ok-text'}>{state.message}</p>
        )}
      </form>

      <div className="card">
        <strong>Guardadas ({state.saved.length})</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: '1.2em' }}>
          {state.saved.map((app) => (
            <li key={app.id}>
              {app.company} · {app.role} · USD {app.salary}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
