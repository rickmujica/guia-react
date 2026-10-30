import { useEffect, useImperativeHandle, useRef, type ComponentProps, type Ref } from 'react'

export function Buscador() {
  // Ref al DOM: el tipo del elemento + null como valor inicial.
  const inputRef = useRef<HTMLInputElement>(null) // RefObject<HTMLInputElement | null>

  // Ref para guardar un valor mutable (un id de timer). En React 19 useRef pide el valor inicial.
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // current puede ser null (antes de montar o si el elemento no se renderizó).
    inputRef.current?.focus()

    // @ts-expect-error: 'inputRef.current' is possibly 'null'.
    inputRef.current.focus()

    timerRef.current = window.setTimeout(() => {}, 1000)
    return () => window.clearTimeout(timerRef.current)
  }, [])

  // El tipo del ref tiene que coincidir con el elemento:
  const divRef = useRef<HTMLDivElement>(null)
  // @ts-expect-error: a un <input> no se le puede pasar un ref de <div> (le falta value, checked…).
  const mal = <input ref={divRef} />

  return <input ref={inputRef} />
}

// React 19: ref es una prop común. Con ComponentProps<'input'> ya viene incluida.
export function CampoTexto({ etiqueta, ...props }: ComponentProps<'input'> & { etiqueta: string }) {
  return (
    <label>
      {etiqueta} <input {...props} />
    </label>
  )
}

// O, si la declarás a mano, con el tipo Ref<T>:
export function CampoSimple({ ref }: { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} />
}

// useImperativeHandle: exponer una API propia en vez del nodo del DOM.
export type ReproductorHandle = { play: () => void; pausa: () => void }

export function Reproductor({ ref }: { ref?: Ref<ReproductorHandle> }) {
  const video = useRef<HTMLVideoElement>(null)
  useImperativeHandle(ref, () => ({
    play: () => void video.current?.play(),
    pausa: () => video.current?.pause(),
  }))
  return <video ref={video} src="/demo.mp4" />
}

export function Uso() {
  const reproductor = useRef<ReproductorHandle>(null)
  return (
    <>
      <Reproductor ref={reproductor} />
      <button onClick={() => reproductor.current?.play()}>Play</button>
      {/* Callback ref con cleanup (React 19): la función que devuelve corre al desmontar. */}
      <div
        ref={(nodo) => {
          if (!nodo) return // los tipos todavía permiten null
          const observer = new ResizeObserver(() => console.log(nodo.offsetWidth))
          observer.observe(nodo)
          return () => observer.disconnect()
        }}
      />
    </>
  )
}
