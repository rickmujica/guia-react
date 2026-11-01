import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Oferta } from '@/demos/datos'

type Guardadas = {
  ofertas: Oferta[]
  alternar: (oferta: Oferta) => void
}

// Las ofertas guardadas no son secretas: van a AsyncStorage (un almacenamiento clave-valor
// simple, el equivalente del localStorage).
export const useGuardadas = create<Guardadas>()(
  persist(
    (set) => ({
      ofertas: [],
      alternar: (oferta) =>
        set((estado) => ({
          ofertas: estado.ofertas.some((o) => o.id === oferta.id)
            ? estado.ofertas.filter((o) => o.id !== oferta.id)
            : [oferta, ...estado.ofertas],
        })),
    }),
    { name: 'guardadas', storage: createJSONStorage(() => AsyncStorage) },
  ),
)

export const useEstaGuardada = (id: number) => useGuardadas((s) => s.ofertas.some((o) => o.id === id))
