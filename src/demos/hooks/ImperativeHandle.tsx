import { useImperativeHandle, useRef, type Ref } from 'react'

// Lo único que el padre va a poder hacer con el ref
type SearchHandle = { focus: () => void; clear: () => void }

// React 19: ref es una prop más (sin forwardRef)
function SearchInput({ ref, placeholder }: { ref?: Ref<SearchHandle>; placeholder: string }) {
  const inputRef = useRef<HTMLInputElement>(null)

  // En vez de exponer el <input> entero, exponemos una API acotada
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }))

  return <input ref={inputRef} placeholder={placeholder} />
}

export default function ImperativeHandleDemo() {
  const searchRef = useRef<SearchHandle>(null)
  return (
    <div className="row">
      <SearchInput ref={searchRef} placeholder="Buscar ofertas…" />
      <button onClick={() => searchRef.current?.focus()}>Enfocar</button>
      <button onClick={() => searchRef.current?.clear()}>Limpiar</button>
    </div>
  )
}
