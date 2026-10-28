import { useMemo, useState } from 'react'
import { blockFor } from '../shared/utils'

type Offer = { company: string; salary: number; remote: boolean }

const offers: Offer[] = Array.from({ length: 300 }, (_, i) => ({
  company: `Empresa ${i + 1}`,
  salary: 1800 + ((i * 137) % 3200),
  remote: i % 3 !== 0,
}))

// Cálculo "caro" a propósito: tarda unos 150 ms
function buildReport(minSalary: number) {
  blockFor(150)
  const matching = offers.filter((o) => o.remote && o.salary >= minSalary)
  const average = matching.reduce((sum, o) => sum + o.salary, 0) / (matching.length || 1)
  return { count: matching.length, average: Math.round(average) }
}

function WithoutMemo() {
  const [minSalary, setMinSalary] = useState(3000)
  const [note, setNote] = useState('')
  const report = buildReport(minSalary) // 🔴 se recalcula en CADA render, también al escribir la nota
  return <ReportForm {...{ minSalary, setMinSalary, note, setNote, report }} />
}

function WithMemo() {
  const [minSalary, setMinSalary] = useState(3000)
  const [note, setNote] = useState('')
  const report = useMemo(() => buildReport(minSalary), [minSalary]) // ✅ solo si cambia minSalary
  return <ReportForm {...{ minSalary, setMinSalary, note, setNote, report }} />
}

export default function UseMemoDemo() {
  const [memoized, setMemoized] = useState(false)
  return (
    <div className="stack">
      <label className="row">
        <input type="checkbox" checked={memoized} onChange={(e) => setMemoized(e.target.checked)} />
        Usar useMemo
      </label>
      {memoized ? <WithMemo /> : <WithoutMemo />}
    </div>
  )
}

type ReportFormProps = {
  minSalary: number
  setMinSalary: (n: number) => void
  note: string
  setNote: (s: string) => void
  report: { count: number; average: number }
}

function ReportForm({ minSalary, setMinSalary, note, setNote, report }: ReportFormProps) {
  return (
    <>
      <label className="row">
        Salario mínimo: USD {minSalary}
        <input
          type="range"
          min={1800}
          max={5000}
          step={100}
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
        />
      </label>
      <p>
        {report.count} ofertas remotas · promedio USD {report.average}
      </p>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escribí una nota rápido…" />
    </>
  )
}
