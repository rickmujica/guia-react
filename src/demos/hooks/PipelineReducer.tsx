import { useReducer, useState } from 'react'

type Stage = 'aplicado' | 'entrevista' | 'oferta' | 'rechazado'
type Application = { id: number; company: string; stage: Stage }

// Todas las acciones posibles, como una unión discriminada por "type"
type Action =
  | { type: 'added'; id: number; company: string }
  | { type: 'advanced'; id: number }
  | { type: 'rejected'; id: number }
  | { type: 'removed'; id: number }

const nextStage: Record<Stage, Stage> = {
  aplicado: 'entrevista',
  entrevista: 'oferta',
  oferta: 'oferta',
  rechazado: 'rechazado',
}

// El reducer es una función PURA: (estado actual, acción) => estado nuevo.
// No hace fetch, no usa Date.now(), no muta: solo calcula.
function applicationsReducer(state: Application[], action: Action): Application[] {
  switch (action.type) {
    case 'added':
      return [...state, { id: action.id, company: action.company, stage: 'aplicado' }]
    case 'advanced':
      return state.map((app) => (app.id === action.id ? { ...app, stage: nextStage[app.stage] } : app))
    case 'rejected':
      return state.map((app) => (app.id === action.id ? { ...app, stage: 'rechazado' } : app))
    case 'removed':
      return state.filter((app) => app.id !== action.id)
  }
}

const initialApplications: Application[] = [
  { id: 1, company: 'Nubelia', stage: 'entrevista' },
  { id: 2, company: 'Pagos Sur', stage: 'aplicado' },
]

const stages: Stage[] = ['aplicado', 'entrevista', 'oferta', 'rechazado']

export default function PipelineReducer() {
  const [applications, dispatch] = useReducer(applicationsReducer, initialApplications)
  const [company, setCompany] = useState('')
  const [lastAction, setLastAction] = useState<Action | null>(null)

  // Los componentes solo "describen qué pasó": la lógica vive en el reducer.
  function send(action: Action) {
    dispatch(action)
    setLastAction(action)
  }

  return (
    <div className="stack">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          if (!company.trim()) return
          send({ type: 'added', id: Date.now(), company: company.trim() }) // el id se genera acá, no en el reducer
          setCompany('')
        }}
      >
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Empresa" />
        <button type="submit">Agregar</button>
      </form>

      <div className="grid-2">
        {stages.map((stage) => (
          <section key={stage} className="card">
            <strong style={{ textTransform: 'capitalize' }}>{stage}</strong>
            {applications
              .filter((app) => app.stage === stage)
              .map((app) => (
                <div key={app.id} className="row" style={{ marginTop: 6 }}>
                  <span style={{ flex: 1 }}>{app.company}</span>
                  {stage !== 'oferta' && stage !== 'rechazado' && (
                    <button onClick={() => send({ type: 'advanced', id: app.id })}>→</button>
                  )}
                  {stage !== 'rechazado' && <button onClick={() => send({ type: 'rejected', id: app.id })}>✕</button>}
                  <button onClick={() => send({ type: 'removed', id: app.id })}>🗑</button>
                </div>
              ))}
          </section>
        ))}
      </div>

      {lastAction && <pre className="log">dispatch({JSON.stringify(lastAction)})</pre>}
    </div>
  )
}
