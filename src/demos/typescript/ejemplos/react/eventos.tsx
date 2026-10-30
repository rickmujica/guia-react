import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from 'react'

export function Eventos() {
  // Inline: el tipo del evento se infiere solo, no hace falta escribir nada.
  const inline = <input onChange={(e) => console.log(e.target.value)} />

  // Separado: hay que anotar el evento. El genérico es el elemento que lo dispara.
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value)
  }

  function onSelect(e: ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value)
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    console.log(e.clientX, e.currentTarget.textContent)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    const empresa = datos.get('empresa') // FormDataEntryValue | null: string, File o null
    console.log(String(empresa ?? ''))
  }

  // Truco: si no sabés el tipo, escribilo inline, pasá el mouse por "e" y copialo.
  // También podés tipar la función entera: ChangeEventHandler<HTMLInputElement>.

  return (
    <form onSubmit={onSubmit}>
      {inline}
      <input name="empresa" onChange={onChange} onKeyDown={onKeyDown} />
      <select onChange={onSelect}>
        <option>Remoto</option>
      </select>
      {/* @ts-expect-error: el handler espera un input, no un botón. */}
      <button onClick={onChange}>Mal</button>
      <button onClick={onClick}>Guardar</button>
    </form>
  )
}
