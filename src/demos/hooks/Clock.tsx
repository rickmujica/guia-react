import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type ClockProps = {
  intervalMs: number
  onLog: Dispatch<SetStateAction<string[]>>
}

function Clock({ intervalMs, onLog }: ClockProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    onLog((log) => [...log, `▶ setup: setInterval cada ${intervalMs} ms`])
    const id = setInterval(() => setNow(new Date()), intervalMs)

    return () => {
      clearInterval(id)
      onLog((log) => [...log, `■ cleanup: clearInterval de ${intervalMs} ms`])
    }
  }, [intervalMs, onLog]) // si cambia intervalMs: cleanup del viejo + setup del nuevo

  return (
    <p style={{ fontSize: '1.8rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {now.toLocaleTimeString('es', { hour12: false })}.{String(now.getMilliseconds()).padStart(3, '0')}
    </p>
  )
}

export default function ClockDemo() {
  const [visible, setVisible] = useState(true)
  const [intervalMs, setIntervalMs] = useState(1000)
  const [log, setLog] = useState<string[]>([])

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setVisible((v) => !v)}>{visible ? 'Desmontar' : 'Montar'} reloj</button>
        <select value={intervalMs} onChange={(e) => setIntervalMs(Number(e.target.value))}>
          <option value={1000}>Cada 1 segundo</option>
          <option value={100}>Cada 100 ms</option>
        </select>
        <button onClick={() => setLog([])}>Limpiar log</button>
      </div>
      {visible && <Clock intervalMs={intervalMs} onLog={setLog} />}
      <ol className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  )
}
