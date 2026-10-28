import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  // Cerrar con Escape: sincronizar con un evento del navegador
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // createPortal: el JSX se renderiza en document.body, fuera de este div,
  // pero sigue siendo parte del árbol de React (contexto, eventos, estado).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', zIndex: 100 }}
    >
      <div className="card stack" onClick={(e) => e.stopPropagation()} style={{ width: 'min(90vw, 360px)' }}>
        <strong>{title}</strong>
        {children}
        <button className="ui-button" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default function PortalModal() {
  const [open, setOpen] = useState(false)
  return (
    // overflow: hidden recortaría un modal normal; el portal lo evita
    <div style={{ overflow: 'hidden', border: '1px dashed var(--border)', borderRadius: 8, padding: 12 }}>
      <button onClick={() => setOpen(true)}>Abrir modal</button>
      {open && (
        <Modal title="¿Postularte a Nubelia?" onClose={() => setOpen(false)}>
          <p>Este modal vive en document.body gracias a createPortal.</p>
        </Modal>
      )}
    </div>
  )
}
