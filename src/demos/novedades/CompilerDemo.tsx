import { useState } from 'react'
import { useRenderFlash } from '../shared/useRenderFlash'

type Job = { id: number; title: string; remote: boolean }

const jobs: Job[] = [
  { id: 1, title: 'Frontend Engineer · Nubelia', remote: true },
  { id: 2, title: 'React Developer · Pagos Sur', remote: false },
  { id: 3, title: 'UI Engineer · Datalab', remote: true },
]

// Componente hijo SIN memo: parpadea en amarillo cada vez que se renderiza
function RemoteJobs({ items }: { items: Job[] }) {
  const ref = useRenderFlash<HTMLUListElement>()
  return (
    <ul ref={ref} style={{ margin: 0, paddingLeft: '1.2em' }}>
      {items.map((job) => (
        <li key={job.id}>{job.title}</li>
      ))}
    </ul>
  )
}

// Sin compilar: cada click crea un array nuevo y un elemento nuevo, así que RemoteJobs se renderiza
function BoardWithoutCompiler() {
  const [clicks, setClicks] = useState(0)
  const remoteJobs = jobs.filter((job) => job.remote)
  return (
    <div className="card stack">
      <strong>Sin compilar</strong>
      <button onClick={() => setClicks((n) => n + 1)}>Clicks: {clicks}</button>
      <RemoteJobs items={remoteJobs} />
    </div>
  )
}

// Compilado: el React Compiler memoiza remoteJobs y el JSX de <RemoteJobs />
function BoardWithCompiler() {
  'use memo' // en modo "annotation" solo se compilan las funciones con esta directiva
  const [clicks, setClicks] = useState(0)
  const remoteJobs = jobs.filter((job) => job.remote)
  return (
    <div className="card stack">
      <strong>Con React Compiler</strong>
      <button onClick={() => setClicks((n) => n + 1)}>Clicks: {clicks}</button>
      <RemoteJobs items={remoteJobs} />
    </div>
  )
}

export default function CompilerDemo() {
  return (
    <div className="grid-2">
      <BoardWithoutCompiler />
      <BoardWithCompiler />
    </div>
  )
}
