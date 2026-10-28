import { useState } from 'react'

export default function DocumentMetadata() {
  const [unread, setUnread] = useState(3)
  const title = `${unread > 0 ? `(${unread}) ` : ''}Mensajes · Job Tracker`

  return (
    <div className="stack">
      {/* React 19 sube estas etiquetas al <head> del documento */}
      <title>{title}</title>
      <meta name="description" content={`Tenés ${unread} mensajes sin leer de recruiters`} />

      <p>
        Mirá el título de la pestaña del navegador: <strong>{title}</strong>
      </p>
      <div className="row">
        <button onClick={() => setUnread((n) => n + 1)}>Llega un mensaje</button>
        <button onClick={() => setUnread(0)}>Marcar todo como leído</button>
      </div>
    </div>
  )
}
