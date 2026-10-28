import { useState } from 'react'

type ApplicationForm = {
  company: string
  role: string
  remote: boolean
  salary: number
}

export default function ApplicationFormDemo() {
  const [form, setForm] = useState<ApplicationForm>({
    company: '',
    role: 'Frontend Engineer',
    remote: true,
    salary: 3000,
  })

  // Nunca mutes el objeto (form.company = ...). Creá uno nuevo con spread.
  function update<K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="grid-2">
      <div className="stack">
        {/* Inputs controlados: el valor sale del estado y onChange lo actualiza */}
        <label className="stack">
          Empresa
          <input value={form.company} onChange={(e) => update('company', e.target.value)} />
        </label>
        <label className="stack">
          Puesto
          <input value={form.role} onChange={(e) => update('role', e.target.value)} />
        </label>
        <label className="stack">
          Salario (USD)
          <input
            type="number"
            value={form.salary}
            onChange={(e) => update('salary', e.target.valueAsNumber || 0)}
          />
        </label>
        <label className="row">
          <input
            type="checkbox"
            checked={form.remote}
            onChange={(e) => update('remote', e.target.checked)}
          />
          Remoto
        </label>
      </div>
      <pre className="log" style={{ maxHeight: 'none' }}>
        {JSON.stringify(form, null, 2)}
      </pre>
    </div>
  )
}
