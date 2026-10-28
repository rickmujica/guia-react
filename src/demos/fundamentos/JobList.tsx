import { useState } from 'react'

type Job = {
  id: number
  company: string
  role: string
  remote: boolean
  salary: number
}

const jobs: Job[] = [
  { id: 1, company: 'Nubelia', role: 'Frontend Engineer', remote: true, salary: 3200 },
  { id: 2, company: 'Pagos Sur', role: 'React Developer', remote: false, salary: 2800 },
  { id: 3, company: 'Datalab', role: 'Senior Frontend', remote: true, salary: 4500 },
  { id: 4, company: 'Kuarahy', role: 'UI Engineer', remote: true, salary: 2600 },
]

export default function JobList() {
  const [onlyRemote, setOnlyRemote] = useState(false)
  // Dato derivado: se calcula en cada render, no se guarda en otro estado.
  const visibleJobs = onlyRemote ? jobs.filter((job) => job.remote) : jobs

  return (
    <div className="stack">
      <label className="row">
        <input
          type="checkbox"
          checked={onlyRemote}
          onChange={(event) => setOnlyRemote(event.target.checked)}
        />
        Solo remotos
      </label>

      {visibleJobs.length === 0 ? (
        <p>No hay ofertas.</p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
          {visibleJobs.map((job) => (
            // key: un id estable que identifica a cada elemento de la lista
            <li key={job.id}>
              <strong>{job.role}</strong> en {job.company} · USD {job.salary.toLocaleString('es')}
              {job.remote ? ' · 🌎 Remoto' : ' · 🏢 Presencial'}
            </li>
          ))}
        </ul>
      )}

      <p className="muted">
        Mostrando {visibleJobs.length} de {jobs.length} ofertas
      </p>
    </div>
  )
}
