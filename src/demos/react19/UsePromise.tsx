import { Suspense, use, useState, useTransition } from 'react'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { clearJobsCache, fetchJob, type Job } from './jobs-api'

function JobDetails({ jobPromise }: { jobPromise: Promise<Job> }) {
  // use() "desenvuelve" la promesa: si no se resolvió, el componente suspende
  const job = use(jobPromise)
  return (
    <div className="card">
      <strong>
        {job.title} · {job.company}
      </strong>
      <p>Salario: {job.salary}</p>
      <p className="muted">Stack: {job.stack.join(', ')}</p>
    </div>
  )
}

export default function UsePromise() {
  const [selectedId, setSelectedId] = useState(1)
  // Guardamos la PROMESA en el estado (se crea en un handler, no en el render)
  const [jobPromise, setJobPromise] = useState(() => fetchJob(1))
  const [withTransition, setWithTransition] = useState(false)
  const [isPending, startTransition] = useTransition()

  function select(id: number) {
    if (withTransition) {
      // Con transición: React mantiene visible el contenido anterior hasta que llega el nuevo
      startTransition(() => {
        setSelectedId(id)
        setJobPromise(fetchJob(id))
      })
    } else {
      // Sin transición: vuelve a mostrarse el fallback de Suspense
      setSelectedId(id)
      setJobPromise(fetchJob(id))
    }
  }

  return (
    <div className="stack">
      <div className="row">
        {[1, 2, 3, 4].map((id) => (
          <button key={id} className={id === selectedId ? 'active' : ''} onClick={() => select(id)}>
            Oferta {id}
            {id === 4 ? ' (rota)' : ''}
          </button>
        ))}
        <button onClick={clearJobsCache}>Vaciar caché</button>
      </div>
      <label className="row">
        <input type="checkbox" checked={withTransition} onChange={(e) => setWithTransition(e.target.checked)} />
        Cambiar dentro de startTransition
      </label>

      <div className={isPending ? 'pending' : ''}>
        {/* Suspense va AFUERA del boundary con key: así no se crea uno nuevo en cada cambio */}
        <Suspense fallback={<p className="muted">⏳ Cargando oferta…</p>}>
          {/* key: al elegir otra oferta, el Error Boundary se reinicia si había un error */}
          <ErrorBoundary key={selectedId} fallback={(error) => <p className="error-text">❌ {error.message}</p>}>
            <JobDetails jobPromise={jobPromise} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  )
}
