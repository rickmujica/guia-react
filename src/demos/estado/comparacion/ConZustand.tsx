// Zustand: un hook con el estado y las acciones juntos. Sin Provider ni acciones con type.
import { create } from 'zustand'
import { api } from '../api'

type Favoritas = {
  lista: string[]
  cargando: boolean
  cargar: () => Promise<void>
  agregar: (empresa: string) => void
  quitar: (empresa: string) => void
}

const useFavoritas = create<Favoritas>()((set) => ({
  lista: [],
  cargando: false,
  cargar: async () => {
    set({ cargando: true })
    set({ lista: (await api.listar()).map((p) => p.empresa), cargando: false })
  },
  agregar: (empresa) => set((s) => ({ lista: [...s.lista, empresa] })),
  quitar: (empresa) => set((s) => ({ lista: s.lista.filter((e) => e !== empresa) })),
}))

export default function ConZustand() {
  const { lista, cargando, cargar, agregar, quitar } = useFavoritas()
  return (
    <>
      <button onClick={cargar}>{cargando ? 'Cargando…' : 'Cargar'}</button>
      <button onClick={() => agregar('Mate Cloud')}>+ Mate Cloud</button>
      <ul>
        {lista.map((e) => (
          <li key={e} onClick={() => quitar(e)}>
            {e}
          </li>
        ))}
      </ul>
    </>
  )
}
