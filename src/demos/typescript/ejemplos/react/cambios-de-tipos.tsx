import { useRef, type JSX, type ReactElement } from 'react'

// Cambios de @types/react 19 que rompen código viejo (y cómo se arreglan).

export function Ejemplos() {
  // 1) useRef necesita un argumento.
  // @ts-expect-error: Expected 1 arguments, but got 0.
  const sinArgumento = useRef<number>()
  const conArgumento = useRef<number | undefined>(undefined)

  // 2) Los refs de useRef son siempre mutables (ya no existe la versión readonly).
  const nodo = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* 3) Un callback ref solo puede devolver una función de cleanup. Las arrow
          functions de una sola expresión que devuelven algo ahora dan error: */}
      {/* @ts-expect-error: la asignación devuelve el nodo, que no es un cleanup válido. */}
      <div ref={(n) => (nodo.current = n)} />
      <div
        ref={(n) => {
          nodo.current = n
        }}
      />
    </>
  )
}

// 4) El namespace global JSX ya no existe: se importa el de React.
type Etiqueta = keyof JSX.IntrinsicElements // 'div' | 'span' | 'button' | ...

// 5) Las props de un ReactElement ahora son unknown (antes any): hay que decir el tipo.
function leerTitulo(elemento: ReactElement<{ title: string }>) {
  return elemento.props.title
}

function leerSinTipo(elemento: ReactElement) {
  // @ts-expect-error: 'elemento.props' is of type 'unknown'.
  return elemento.props.title
}
