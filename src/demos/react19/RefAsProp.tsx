import { useRef, useState, type ComponentProps } from 'react'

// React 19: `ref` llega como cualquier otra prop. Sin forwardRef.
// ComponentProps<'input'> ya incluye `ref` en sus tipos.
function TextField({ label, ref, ...inputProps }: ComponentProps<'input'> & { label: string }) {
  return (
    <label className="stack">
      {label}
      <input ref={ref} {...inputProps} />
    </label>
  )
}

export default function RefAsProp() {
  const companyRef = useRef<HTMLInputElement>(null)
  const roleRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  function validate() {
    // Enfocamos el primer campo vacío
    const empty = [companyRef.current, roleRef.current].find((input) => !input?.value)
    if (empty) {
      empty.focus()
      setMessage(`Completá el campo "${empty.name}"`)
    } else {
      setMessage('Todo completo ✅')
    }
  }

  return (
    <div className="stack">
      <div className="grid-2">
        <TextField label="Empresa" name="empresa" ref={companyRef} />
        <TextField label="Puesto" name="puesto" ref={roleRef} />
      </div>
      <div className="row">
        <button onClick={validate}>Validar</button>
        <span className="muted">{message}</span>
      </div>
    </div>
  )
}
