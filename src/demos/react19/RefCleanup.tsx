import { useCallback, useState } from 'react'

export default function RefCleanup() {
  const [visible, setVisible] = useState(true)
  const [width, setWidth] = useState(0)
  const [log, setLog] = useState<string[]>([])

  // React 19: un ref callback puede devolver una función de limpieza.
  // (useCallback para que React no lo vuelva a llamar en cada render;
  // con el React Compiler ni siquiera haría falta)
  const measureRef = useCallback((node: HTMLTextAreaElement) => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(node)
    setLog((l) => [...l, '▶ ref: ResizeObserver conectado'])

    return () => {
      observer.disconnect()
      setLog((l) => [...l, '■ cleanup: ResizeObserver desconectado'])
    }
  }, [])

  return (
    <div className="stack">
      <button onClick={() => setVisible((v) => !v)}>{visible ? 'Desmontar' : 'Montar'} el textarea</button>
      {visible && (
        <>
          <textarea ref={measureRef} rows={2} style={{ resize: 'horizontal', width: 260 }} defaultValue="Estirame desde la esquina ↘" />
          <p className="muted">Ancho medido: {width}px</p>
        </>
      )}
      <ol className="log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  )
}
