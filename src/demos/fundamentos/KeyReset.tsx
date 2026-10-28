import { useState } from 'react'

type Contact = { id: number; name: string }

const contacts: Contact[] = [
  { id: 1, name: 'Recruiter de Nubelia' },
  { id: 2, name: 'CTO de Datalab' },
  { id: 3, name: 'Referido de Pagos Sur' },
]

function MessageDraft({ contact }: { contact: Contact }) {
  // Este estado pertenece a la "posición" del componente en el árbol...
  const [draft, setDraft] = useState('')
  return (
    <div className="stack">
      <textarea
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={`Mensaje para ${contact.name}`}
      />
      <button disabled={!draft}>Enviar a {contact.name}</button>
    </div>
  )
}

export default function KeyReset() {
  const [selected, setSelected] = useState(contacts[0])
  const [useKey, setUseKey] = useState(false)

  return (
    <div className="stack">
      <div className="row">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            className={contact.id === selected.id ? 'active' : ''}
            onClick={() => setSelected(contact)}
          >
            {contact.name}
          </button>
        ))}
      </div>
      <label className="row">
        <input type="checkbox" checked={useKey} onChange={(e) => setUseKey(e.target.checked)} />
        Usar key={'{contact.id}'} para reiniciar el borrador
      </label>
      {/* ...salvo que cambie su key: una key distinta = un componente nuevo. */}
      {useKey ? (
        <MessageDraft key={selected.id} contact={selected} />
      ) : (
        <MessageDraft contact={selected} />
      )}
    </div>
  )
}
