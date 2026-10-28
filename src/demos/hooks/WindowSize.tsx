import { useEffect, useState } from 'react'

export default function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Setup: nos suscribimos a un sistema externo (el evento resize del navegador)
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup: deshacemos exactamente lo que hizo el setup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // [] = no depende de props ni estado: se suscribe una vez

  return (
    <p>
      Ancho de la ventana: <strong>{width}px</strong>{' '}
      {width < 900 ? '📱 layout móvil' : '🖥️ layout escritorio'}
    </p>
  )
}
