import { startTransition, useState, ViewTransition } from 'react'
import './view-transitions.css'

type Job = { id: number; company: string; role: string }

const pool = ['Nubelia', 'Pagos Sur', 'Datalab', 'Kuarahy', 'Andes Cloud', 'Yvága', 'Mburucuyá Tech']

export default function ViewTransitionList() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, company: 'Nubelia', role: 'Frontend Engineer' },
    { id: 2, company: 'Pagos Sur', role: 'React Developer' },
    { id: 3, company: 'Datalab', role: 'UI Engineer' },
  ])

  // Las animaciones solo se activan con updates dentro de una Transition
  function add() {
    startTransition(() => {
      const company = pool[Math.floor(Math.random() * pool.length)]
      setJobs((list) => [{ id: Date.now(), company, role: 'Frontend' }, ...list])
    })
  }

  function shuffle() {
    startTransition(() => setJobs((list) => list.toSorted(() => Math.random() - 0.5)))
  }

  function remove(id: number) {
    startTransition(() => setJobs((list) => list.filter((job) => job.id !== id)))
  }

  return (
    <div className="stack">
      <div className="row">
        <button onClick={add}>➕ Agregar</button>
        <button onClick={shuffle}>🔀 Mezclar</button>
      </div>
      <div className="stack">
        {jobs.map((job) => (
          // enter / exit: clases CSS para entrar y salir. Al reordenar se anima solo ("update").
          <ViewTransition key={job.id} enter="vt-slide-in" exit="vt-slide-out">
            <div className="card row" style={{ justifyContent: 'space-between' }}>
              <span>
                <strong>{job.company}</strong> · {job.role}
              </span>
              <button onClick={() => remove(job.id)} aria-label={`Quitar ${job.company}`}>
                ✕
              </button>
            </div>
          </ViewTransition>
        ))}
      </div>
    </div>
  )
}
