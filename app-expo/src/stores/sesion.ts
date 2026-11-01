import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as api from '@/api/ofertas'
import { almacenamientoSeguro } from '@/lib/almacenamiento-seguro'

type Sesion = {
  token: string | null
  nombre: string | null
  iniciarSesion: (email: string, password: string) => Promise<void>
  cerrarSesion: () => void
}

// La sesión se guarda cifrada en el teléfono: al abrir la app de nuevo, seguís logueado.
export const useSesion = create<Sesion>()(
  persist(
    (set) => ({
      token: null,
      nombre: null,
      iniciarSesion: async (email, password) => {
        const { token, nombre } = await api.iniciarSesion(email, password)
        set({ token, nombre })
      },
      cerrarSesion: () => set({ token: null, nombre: null }),
    }),
    {
      name: 'sesion',
      storage: createJSONStorage(() => almacenamientoSeguro),
      partialize: ({ token, nombre }) => ({ token, nombre }), // solo los datos, no las funciones
    },
  ),
)
