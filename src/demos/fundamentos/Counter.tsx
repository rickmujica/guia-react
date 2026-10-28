import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  function addThreeWrong() {
    // count vale lo mismo en las 3 líneas: es una "foto" del render actual.
    setCount(count + 1) // setCount(0 + 1)
    setCount(count + 1) // setCount(0 + 1)
    setCount(count + 1) // setCount(0 + 1)
  }

  function addThreeRight() {
    // La función actualizadora recibe el valor más reciente (c).
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  return (
    <div className="stack">
      <p style={{ fontSize: '2.2rem', fontWeight: 700, margin: 0 }}>{count}</p>
      <div className="row">
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={addThreeWrong}>+3 (mal)</button>
        <button onClick={addThreeRight}>+3 (bien)</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  )
}
