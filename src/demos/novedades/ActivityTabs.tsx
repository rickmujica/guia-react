import { Activity, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type Tab = 'notas' | 'preguntas' | 'timer'
type Log = Dispatch<SetStateAction<string[]>>

function NotesTab() {
  const [text, setText] = useState('')
  return <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Notas de la entrevista…" />
}

function QuestionsTab() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((n) => n + 1)}>Preguntas practicadas: {count}</button>
}

function TimerTab({ onLog }: { onLog: Log }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    onLog((log) => [...log, '▶ effect: el timer arranca'])
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      clearInterval(id)
      onLog((log) => [...log, '■ cleanup: el timer se detiene'])
    }
  }, [onLog])
  return <p>Tiempo practicando: {seconds} s</p>
}

export default function ActivityTabs() {
  const [tab, setTab] = useState<Tab>('notas')
  const [useActivity, setUseActivity] = useState(true)
  const [log, setLog] = useState<string[]>([])
  const mode = (t: Tab) => (tab === t ? 'visible' : 'hidden')

  return (
    <div className="stack">
      <label className="row">
        <input type="checkbox" checked={useActivity} onChange={(e) => setUseActivity(e.target.checked)} />
        Usar {'<Activity>'} (si no, render condicional)
      </label>
      <div className="row">
        {(['notas', 'preguntas', 'timer'] as const).map((t) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {useActivity ? (
          <>
            {/* Ocultas: display none + Effects destruidos, pero el ESTADO se conserva */}
            <Activity mode={mode('notas')}>
              <NotesTab />
            </Activity>
            <Activity mode={mode('preguntas')}>
              <QuestionsTab />
            </Activity>
            <Activity mode={mode('timer')}>
              <TimerTab onLog={setLog} />
            </Activity>
          </>
        ) : (
          <>
            {/* Render condicional: al salir de la pestaña, el componente se desmonta */}
            {tab === 'notas' && <NotesTab />}
            {tab === 'preguntas' && <QuestionsTab />}
            {tab === 'timer' && <TimerTab onLog={setLog} />}
          </>
        )}
      </div>
      <ol className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  )
}
