import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { api, siguienteEtapa, type Postulacion } from '../api'

type PostulacionesStore = {
  // Estado
  items: Postulacion[]
  filtro: string
  status: 'idle' | 'loading' | 'failed'
  // Acciones: viven en el mismo store, al lado de los datos
  cargar: (falla?: boolean) => Promise<void>
  avanzar: (id: number) => void
  setFiltro: (filtro: string) => void
  reiniciar: () => void
}

// create devuelve un hook. No hay Provider, ni acciones con type, ni reducer.
export const usePostulaciones = create<PostulacionesStore>()(
  // persist guarda el estado en localStorage y lo recupera al recargar.
  persist(
    (set, get) => ({
      items: [],
      filtro: '',
      status: 'idle',

      async cargar(falla = false) {
        if (get().status === 'loading') return // get() lee el estado actual
        set({ status: 'loading' }) // set hace un merge superficial: no hace falta ...state
        try {
          set({ items: await api.listar({ falla }), status: 'idle' })
        } catch {
          set({ status: 'failed' })
        }
      },

      avanzar: (id) =>
        set((state) => ({
          items: state.items.map((p) => (p.id === id ? { ...p, etapa: siguienteEtapa[p.etapa] } : p)),
        })),

      setFiltro: (filtro) => set({ filtro }),

      reiniciar: () => set({ items: [], filtro: '', status: 'idle' }),
    }),
    {
      name: 'guia-estado-zustand', // la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // solo persistimos las postulaciones
    },
  ),
)

// Fuera de React también se puede leer, escribir y suscribirse:
export const totalActual = () => usePostulaciones.getState().items.length
