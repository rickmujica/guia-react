import { memo, useDeferredValue, useState } from 'react'
import { blockFor } from '../shared/utils'

const companies = Array.from({ length: 250 }, (_, i) => `Empresa ${String(i + 1).padStart(3, '0')}`)

function SlowItem({ text }: { text: string }) {
  blockFor(1) // cada ítem tarda 1 ms en renderizar: 250 ítems = 250 ms
  return <li>{text}</li>
}

// memo es clave: así la lista se saltea el render urgente (con el valor diferido viejo).
const SlowList = memo(function SlowList({ query }: { query: string }) {
  const items = companies.filter((c) => c.includes(query))
  return (
    <ul style={{ margin: 0, paddingLeft: '1.2em', columns: 3 }}>
      {items.map((c) => (
        <SlowItem key={c} text={c} />
      ))}
    </ul>
  )
})

export default function DeferredSearch() {
  const [query, setQuery] = useState('')
  const [deferOn, setDeferOn] = useState(true)
  const deferredQuery = useDeferredValue(query)
  const listQuery = deferOn ? deferredQuery : query
  const isStale = listQuery !== query

  return (
    <div className="stack">
      <label className="row">
        <input type="checkbox" checked={deferOn} onChange={(e) => setDeferOn(e.target.checked)} />
        Usar useDeferredValue
      </label>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribí números rápido: 1, 12, 123…"
      />
      <div className={isStale ? 'pending' : ''} style={{ maxHeight: 220, overflow: 'auto' }}>
        <SlowList query={listQuery} />
      </div>
    </div>
  )
}
