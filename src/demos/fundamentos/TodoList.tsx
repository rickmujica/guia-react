import { useState, type FormEvent } from 'react'

type Task = { id: number; text: string; done: boolean }

function createInitialTasks(): Task[] {
  return [
    { id: 1, text: 'Actualizar el CV', done: true },
    { id: 2, text: 'Repasar hooks', done: false },
    { id: 3, text: 'Practicar live coding', done: false },
  ]
}

export default function TodoList() {
  // Inicialización perezosa: la función se ejecuta solo en el primer render.
  const [tasks, setTasks] = useState(createInitialTasks)
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!text.trim()) return
    setTasks((prev) => [...prev, { id: Date.now(), text: text.trim(), done: false }]) // agregar
    setText('')
  }

  function toggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))) // editar
  }

  function remove(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id)) // borrar
  }

  const pending = tasks.filter((t) => !t.done).length

  return (
    <div className="stack">
      <form onSubmit={handleSubmit} className="row">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Nueva tarea" />
        <button type="submit">Agregar</button>
      </form>
      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} className="row">
            <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
            <span style={{ textDecoration: task.done ? 'line-through' : 'none', flex: 1 }}>
              {task.text}
            </span>
            <button onClick={() => remove(task.id)} aria-label={`Borrar ${task.text}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="muted">{pending} pendientes</p>
    </div>
  )
}
