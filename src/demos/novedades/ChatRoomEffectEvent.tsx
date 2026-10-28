import { useEffect, useEffectEvent, useState, type Dispatch, type SetStateAction } from 'react'

type Log = Dispatch<SetStateAction<string[]>>
type Theme = 'claro' | 'oscuro'
type RoomProps = { roomId: string; theme: Theme; onLog: Log }

// Conexión simulada: avisa "connected" a los 400 ms
function createConnection(roomId: string) {
  let timer: number | undefined
  let onConnected = () => {}
  return {
    on(_event: 'connected', callback: () => void) {
      onConnected = callback
    },
    connect() {
      timer = window.setTimeout(() => onConnected(), 400)
    },
    disconnect() {
      clearTimeout(timer)
      void roomId
    },
  }
}

// 🔴 Sin useEffectEvent: theme es dependencia, así que cambiar el tema RECONECTA
function ChatRoomWithThemeDependency({ roomId, theme, onLog }: RoomProps) {
  useEffect(() => {
    onLog((log) => [...log, `▶ conectando a #${roomId}…`])
    const connection = createConnection(roomId)
    connection.on('connected', () => {
      onLog((log) => [...log, `🔔 [tema ${theme}] Conectado a #${roomId}`])
    })
    connection.connect()
    return () => {
      connection.disconnect()
      onLog((log) => [...log, `■ desconectado de #${roomId}`])
    }
  }, [roomId, theme, onLog])
  return null
}

// ✅ Con useEffectEvent: lee el theme más reciente sin ser dependencia
function ChatRoomWithEffectEvent({ roomId, theme, onLog }: RoomProps) {
  const onConnected = useEffectEvent(() => {
    onLog((log) => [...log, `🔔 [tema ${theme}] Conectado a #${roomId}`])
  })

  useEffect(() => {
    onLog((log) => [...log, `▶ conectando a #${roomId}…`])
    const connection = createConnection(roomId)
    connection.on('connected', () => onConnected())
    connection.connect()
    return () => {
      connection.disconnect()
      onLog((log) => [...log, `■ desconectado de #${roomId}`])
    }
  }, [roomId, onLog]) // theme ya no está acá

  return null
}

export default function ChatRoomEffectEvent() {
  const [roomId, setRoomId] = useState('frontend')
  const [theme, setTheme] = useState<Theme>('claro')
  const [withEffectEvent, setWithEffectEvent] = useState(true)
  const [log, setLog] = useState<string[]>([])

  const Room = withEffectEvent ? ChatRoomWithEffectEvent : ChatRoomWithThemeDependency

  return (
    <div className="stack">
      <label className="row">
        <input type="checkbox" checked={withEffectEvent} onChange={(e) => setWithEffectEvent(e.target.checked)} />
        Usar useEffectEvent
      </label>
      <div className="row">
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="frontend">#frontend</option>
          <option value="react">#react</option>
          <option value="empleos">#empleos</option>
        </select>
        <button onClick={() => setTheme(theme === 'claro' ? 'oscuro' : 'claro')}>Tema: {theme}</button>
        <button onClick={() => setLog([])}>Limpiar log</button>
      </div>
      <Room roomId={roomId} theme={theme} onLog={setLog} />
      <ol className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  )
}
