import { useEffect, useRef, useState } from 'react'

export default function Stopwatch() {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState<number | null>(null)
  // El id del intervalo no se muestra en pantalla: no necesita ser estado.
  const intervalRef = useRef<number | undefined>(undefined)

  function start() {
    setStartedAt(Date.now())
    setNow(Date.now())
    clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(() => setNow(Date.now()), 10)
  }

  function stop() {
    clearInterval(intervalRef.current)
  }

  // Si el componente se desmonta con el cronómetro andando, lo frenamos.
  useEffect(() => () => clearInterval(intervalRef.current), [])

  const seconds = startedAt !== null && now !== null ? (now - startedAt) / 1000 : 0

  return (
    <div className="row">
      <span style={{ fontSize: '1.8rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 110 }}>
        {seconds.toFixed(2)}s
      </span>
      <button onClick={start}>Iniciar</button>
      <button onClick={stop}>Frenar</button>
    </div>
  )
}
