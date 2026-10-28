import { useRef } from 'react'

export default function FocusInput() {
  // useRef<HTMLInputElement>(null): al principio no apunta a nada
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="row">
      {/* React asigna el nodo del DOM a inputRef.current después del commit */}
      <input ref={inputRef} defaultValue="Frontend Engineer" />
      <button onClick={() => inputRef.current?.focus()}>Enfocar</button>
      <button onClick={() => inputRef.current?.select()}>Seleccionar todo</button>
    </div>
  )
}
