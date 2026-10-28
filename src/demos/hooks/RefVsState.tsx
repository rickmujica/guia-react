import { useRef, useState } from 'react'

export default function RefVsState() {
  const [stateClicks, setStateClicks] = useState(0)
  const refClicks = useRef(0)
  const [report, setReport] = useState('')

  return (
    <div className="stack">
      <div className="row">
        <button onClick={() => setStateClicks((n) => n + 1)}>Click con estado: {stateClicks}</button>
        <button
          onClick={() => {
            refClicks.current += 1 // cambia el valor, pero React no se entera
          }}
        >
          Click con ref
        </button>
        <button onClick={() => setReport(`El ref vale ${refClicks.current}`)}>Leer el ref</button>
      </div>
      {report && <p className="muted">{report}</p>}
    </div>
  )
}
