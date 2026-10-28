import { useEffect, useState } from 'react'
import { sleep } from '../shared/utils'
import { useDebouncedValue } from './custom/useDebouncedValue'
import { useLocalStorage } from './custom/useLocalStorage'
import { useOnlineStatus } from './custom/useOnlineStatus'

const roles = ['Frontend Engineer', 'React Developer', 'Full Stack Engineer', 'UI Engineer', 'Frontend Lead']

async function searchRoles(query: string) {
  await sleep(250) // latencia de la "API"
  return roles.filter((role) => role.toLowerCase().includes(query.toLowerCase()))
}

export default function CustomHooksDemo() {
  const [query, setQuery] = useState('')
  const [keystrokes, setKeystrokes] = useState(0)
  const [requests, setRequests] = useState(0)
  const [results, setResults] = useState<string[]>(roles)
  const debouncedQuery = useDebouncedValue(query, 500)
  const [notes, setNotes] = useLocalStorage('guia-react:notas', '')
  const isOnline = useOnlineStatus()

  // La búsqueda solo se dispara cuando el texto "se calmó"
  useEffect(() => {
    let ignore = false
    searchRoles(debouncedQuery).then((found) => {
      if (ignore) return
      setResults(found)
      setRequests((n) => n + 1)
    })
    return () => {
      ignore = true
    }
  }, [debouncedQuery])

  return (
    <div className="stack">
      <p>{isOnline ? '🟢 En línea' : '🔴 Sin conexión'}</p>

      <input
        type="search"
        value={query}
        placeholder="Buscar puesto…"
        onChange={(e) => {
          setQuery(e.target.value)
          setKeystrokes((n) => n + 1)
        }}
      />
      <p className="muted">
        Teclas: {keystrokes} · Requests a la API: {requests}
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {results.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>

      <label className="stack">
        Notas (se guardan en localStorage, recargá la página y siguen ahí)
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
    </div>
  )
}
