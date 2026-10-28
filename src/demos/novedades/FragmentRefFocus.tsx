import { Fragment, useRef, useState, type FragmentInstance } from 'react'

export default function FragmentRefFocus() {
  const groupRef = useRef<FragmentInstance>(null)
  const [info, setInfo] = useState('')

  return (
    <div className="stack">
      <div className="grid-2">
        {/* Los inputs quedan como hijos directos de la grilla: el Fragment no agrega DOM */}
        <Fragment ref={groupRef}>
          <input placeholder="Empresa" />
          <input placeholder="Puesto" />
          <input placeholder="Salario" />
          <input placeholder="Link de la oferta" />
        </Fragment>
      </div>
      <div className="row">
        <button onClick={() => groupRef.current?.focus()}>Enfocar el primero</button>
        <button onClick={() => groupRef.current?.focusLast()}>Enfocar el último</button>
        <button
          onClick={() => {
            const rects = groupRef.current?.getClientRects() ?? []
            setInfo(`${rects.length} elementos, el primero mide ${Math.round(rects[0]?.width ?? 0)}px de ancho`)
          }}
        >
          Medir
        </button>
      </div>
      {info && <p className="muted">{info}</p>}
    </div>
  )
}
