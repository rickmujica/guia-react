import { useState } from 'react'

type Status = 'aplicado' | 'entrevista' | 'oferta' | 'rechazado'
type Application = { id: number; company: string; status: Status }

const applications: Application[] = [
  { id: 1, company: 'Nubelia', status: 'entrevista' },
  { id: 2, company: 'Pagos Sur', status: 'aplicado' },
  { id: 3, company: 'Datalab', status: 'oferta' },
  { id: 4, company: 'Kuarahy', status: 'rechazado' },
  { id: 5, company: 'Andes Cloud', status: 'aplicado' },
]

export default function DerivedState() {
  // Estado mínimo: solo lo que el usuario puede cambiar.
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status | 'todos'>('todos')

  // Todo lo demás se DERIVA durante el render. Sin useEffect, sin estado duplicado.
  const filtered = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(query.toLowerCase()) &&
      (status === 'todos' || app.status === status),
  )
  const active = filtered.filter((app) => app.status !== 'rechazado').length

  return (
    <div className="stack">
      <div className="row">
        <input
          type="search"
          placeholder="Buscar empresa…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as Status | 'todos')}>
          <option value="todos">Todos los estados</option>
          <option value="aplicado">Aplicado</option>
          <option value="entrevista">Entrevista</option>
          <option value="oferta">Oferta</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {filtered.map((app) => (
          <li key={app.id}>
            {app.company} <span className="pill">{app.status}</span>
          </li>
        ))}
      </ul>
      <p className="muted">
        {filtered.length} resultados · {active} activas
      </p>
    </div>
  )
}
