import { useEffect, useState } from 'react'
import { sleep } from '../shared/utils'

type Company = { id: number; name: string; employees: number; delayMs: number }

const companies: Company[] = [
  { id: 1, name: 'Nubelia', employees: 120, delayMs: 2000 },
  { id: 2, name: 'Pagos Sur', employees: 45, delayMs: 300 },
  { id: 3, name: 'Datalab', employees: 300, delayMs: 800 },
]

// "API" falsa: cada empresa tarda distinto en responder.
async function fetchCompany(id: number): Promise<Company> {
  const company = companies.find((c) => c.id === id)!
  await sleep(company.delayMs)
  return company
}

export default function FetchRace() {
  const [companyId, setCompanyId] = useState(3)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [protect, setProtect] = useState(true)

  useEffect(() => {
    let ignore = false
    fetchCompany(companyId).then((data) => {
      // Si el Effect ya se limpió (cambió companyId), descartamos esta respuesta vieja.
      if (protect && ignore) return
      setCompany(data)
      setIsLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [companyId, protect])

  function select(id: number) {
    setCompanyId(id)
    setIsLoading(true)
  }

  const isWrong = !isLoading && company !== null && company.id !== companyId

  return (
    <div className="stack">
      <div className="row">
        {companies.map((c) => (
          <button key={c.id} className={c.id === companyId ? 'active' : ''} onClick={() => select(c.id)}>
            {c.name} ({c.delayMs} ms)
          </button>
        ))}
      </div>
      <label className="row">
        <input type="checkbox" checked={protect} onChange={(e) => setProtect(e.target.checked)} />
        Ignorar respuestas viejas (flag <code>ignore</code> en el cleanup)
      </label>
      <div className="card">
        {isLoading ? (
          <p className="muted">Cargando…</p>
        ) : (
          company && (
            <p>
              <strong>{company.name}</strong> · {company.employees} empleados
            </p>
          )
        )}
        {isWrong && <p className="error-text">⚠️ Bug: seleccionaste otra empresa pero se muestra {company.name}.</p>}
      </div>
    </div>
  )
}
