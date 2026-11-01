import { ofertas } from '@/demos/datos'
import { useGuardadas } from '../guardadas'

// AsyncStorage es nativo: en los tests se reemplaza por la versión en memoria que trae la librería
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

// Un store de zustand se puede testear sin renderizar nada: getState() y sus acciones
test('alternar guarda y quita una oferta', () => {
  const { alternar } = useGuardadas.getState()

  alternar(ofertas[0])
  alternar(ofertas[1])
  expect(useGuardadas.getState().ofertas.map((o) => o.id)).toEqual([2, 1])

  alternar(ofertas[0])
  expect(useGuardadas.getState().ofertas.map((o) => o.id)).toEqual([2])
})
