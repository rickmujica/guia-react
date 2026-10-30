import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'

type Modalidad = 'remoto' | 'hibrido' | 'presencial'
type Form = { empresa: string; salario: number; modalidad: Modalidad; destacada: boolean }

const inicial: Form = { empresa: '', salario: 2500, modalidad: 'remoto', destacada: false }

export default function FormularioTipado() {
  const [form, setForm] = useState<Form>(inicial)
  const [log, setLog] = useState<string[]>([])

  // Un solo handler para varios campos: K es la clave y form[K] su tipo.
  function set<K extends keyof Form>(campo: K, valor: Form[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function onEmpresa(e: ChangeEvent<HTMLInputElement>) {
    set('empresa', e.target.value)
  }

  function onModalidad(e: ChangeEvent<HTMLSelectElement>) {
    // e.target.value es string: hay que convertirlo a la unión (acá confiamos en las <option>).
    set('modalidad', e.target.value as Modalidad)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') set('empresa', '')
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLog((l) => [`Guardada: ${form.empresa || '(sin empresa)'} · USD ${form.salario} · ${form.modalidad}`, ...l])
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div className="row">
        <input value={form.empresa} onChange={onEmpresa} onKeyDown={onKeyDown} placeholder="Empresa (Esc borra)" />
        {/* valueAsNumber ya es number: no hace falta Number(e.target.value) */}
        <input
          type="number"
          value={form.salario}
          step={100}
          onChange={(e) => set('salario', e.target.valueAsNumber || 0)}
          style={{ width: 100 }}
        />
        <select value={form.modalidad} onChange={onModalidad}>
          <option value="remoto">Remoto</option>
          <option value="hibrido">Híbrido</option>
          <option value="presencial">Presencial</option>
        </select>
        <label className="row">
          <input type="checkbox" checked={form.destacada} onChange={(e) => set('destacada', e.target.checked)} />
          Destacada
        </label>
        <button type="submit">Guardar</button>
      </div>
      <pre className="log">{JSON.stringify(form, null, 2)}</pre>
      {log.length > 0 && (
        <ol className="log">
          {log.map((linea, i) => (
            <li key={i}>{linea}</li>
          ))}
        </ol>
      )}
    </form>
  )
}
