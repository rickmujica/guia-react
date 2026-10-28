import { useState } from 'react'

type Company = { id: number; name: string }

const initialCompanies: Company[] = [
  { id: 1, name: 'Nubelia' },
  { id: 2, name: 'Pagos Sur' },
  { id: 3, name: 'Datalab' },
]

export default function KeysDemo() {
  const [companies, setCompanies] = useState(initialCompanies)
  const [indexAsKey, setIndexAsKey] = useState(true)

  function addOnTop() {
    const id = Date.now()
    setCompanies([{ id, name: `Empresa nueva #${companies.length + 1}` }, ...companies])
  }

  return (
    <div className="stack">
      <div className="row">
        <button onClick={addOnTop}>Agregar arriba</button>
        <label className="row">
          <input
            type="checkbox"
            checked={indexAsKey}
            onChange={(event) => setIndexAsKey(event.target.checked)}
          />
          Usar el índice como key (mal)
        </label>
      </div>

      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {companies.map((company, index) => (
          <li key={indexAsKey ? index : company.id} className="row">
            <span style={{ minWidth: 170 }}>{company.name}</span>
            {/* Este input no está controlado: su texto vive en el DOM */}
            <input placeholder="Notas sobre la empresa…" />
          </li>
        ))}
      </ul>
    </div>
  )
}
