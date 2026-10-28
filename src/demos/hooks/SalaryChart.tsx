// Componente "pesado" que se carga con lazy() recién cuando hace falta.
const data = [
  { role: 'Junior', salary: 1500 },
  { role: 'Semi Senior', salary: 2800 },
  { role: 'Senior', salary: 4200 },
  { role: 'Lead', salary: 5500 },
]

export default function SalaryChart() {
  const max = Math.max(...data.map((d) => d.salary))
  return (
    <div className="stack" aria-label="Salarios remotos en USD por seniority">
      {data.map((d) => (
        <div key={d.role} className="row" style={{ flexWrap: 'nowrap' }}>
          <span style={{ width: 100, flex: 'none' }}>{d.role}</span>
          <div
            style={{
              height: 18,
              width: `${(d.salary / max) * 100}%`,
              background: 'var(--accent)',
              borderRadius: 4,
            }}
          />
          <span style={{ flex: 'none' }}>USD {d.salary}</span>
        </div>
      ))}
    </div>
  )
}
