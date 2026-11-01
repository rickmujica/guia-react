import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { userEvent } from '@testing-library/react-native'
import { renderRouter, screen } from 'expo-router/testing-library'
import Ofertas from '../(tabs)/index'
import DetalleOferta from '../oferta/[id]'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

// renderRouter arma un Expo Router en memoria con las pantallas que le pasamos
test('tocar una oferta abre su detalle', async () => {
  const queryClient = new QueryClient()
  const Layout = () => (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  )
  await renderRouter({ _layout: Layout, index: Ofertas, 'oferta/[id]': DetalleOferta }, { initialUrl: '/' })
  const user = userEvent.setup()

  await user.press(await screen.findByText('Expo Developer', {}, { timeout: 3000 }))

  expect(screen).toHavePathname('/oferta/5')
  expect(await screen.findByText('Hasta US$ 3600 por mes')).toBeOnTheScreen()
})
