import { useLayoutEffect, useRef } from 'react'

/**
 * Hace "parpadear" en amarillo el elemento cada vez que el componente se renderiza.
 * Se usa en las demos de rendimiento para VER qué componentes se vuelven a renderizar.
 */
export function useRenderFlash<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  // Sin array de dependencias: corre después de CADA render de este componente.
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    element.classList.remove('render-flash')
    void element.offsetWidth // fuerza un reflow para reiniciar la animación CSS
    element.classList.add('render-flash')
  })
  return ref
}
