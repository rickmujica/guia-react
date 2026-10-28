import { memo, useCallback, useState } from 'react'
import { useRenderFlash } from '../shared/useRenderFlash'

type Job = { id: number; title: string }

const jobs: Job[] = [
  { id: 1, title: 'Frontend Engineer · Nubelia' },
  { id: 2, title: 'React Developer · Pagos Sur' },
  { id: 3, title: 'UI Engineer · Datalab' },
]

type RowProps = { job: Job; isSelected: boolean; onSelect: (id: number) => void }

function JobRow({ job, isSelected, onSelect }: RowProps) {
  const ref = useRenderFlash<HTMLLIElement>() // parpadea en amarillo en cada render
  return (
    <li ref={ref} className="row card" style={{ justifyContent: 'space-between' }}>
      <span>
        {isSelected ? '★ ' : ''}
        {job.title}
      </span>
      <button onClick={() => onSelect(job.id)}>Elegir</button>
    </li>
  )
}

// memo: si las props son iguales (comparación superficial), React se saltea el render
const MemoJobRow = memo(JobRow)

type Mode = 'sin-memo' | 'memo-inline' | 'memo-callback'

export default function MemoDemo() {
  const [mode, setMode] = useState<Mode>('sin-memo')
  const [renders, setRenders] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const ref = useRenderFlash<HTMLDivElement>()

  // Función nueva en cada render del padre
  const handleSelectInline = (id: number) => setSelectedId(id)
  // Misma función entre renders (mientras sus dependencias no cambien)
  const handleSelectStable = useCallback((id: number) => setSelectedId(id), [])

  const Row = mode === 'sin-memo' ? JobRow : MemoJobRow
  const onSelect = mode === 'memo-callback' ? handleSelectStable : handleSelectInline

  return (
    <div ref={ref} className="stack">
      <div className="row">
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="sin-memo">1. Sin memo</option>
          <option value="memo-inline">2. memo + función inline</option>
          <option value="memo-callback">3. memo + useCallback</option>
        </select>
        <button onClick={() => setRenders((n) => n + 1)}>Re-renderizar el padre ({renders})</button>
      </div>
      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {jobs.map((job) => (
          <Row key={job.id} job={job} isSelected={job.id === selectedId} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}
