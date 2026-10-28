import { useId } from 'react'

function Field({ label, hint }: { label: string; hint: string }) {
  // Un id único y estable por cada instancia del componente (también con SSR)
  const id = useId()
  return (
    <div className="stack" style={{ gap: 4 }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={`${id}-hint`} />
      <small id={`${id}-hint`} className="muted">
        {hint} · id generado: <code>{id}</code>
      </small>
    </div>
  )
}

export default function UseIdDemo() {
  return (
    <div className="grid-2">
      <Field label="Empresa" hint="Nombre legal o comercial" />
      <Field label="Puesto" hint="Como figura en la oferta" />
    </div>
  )
}
