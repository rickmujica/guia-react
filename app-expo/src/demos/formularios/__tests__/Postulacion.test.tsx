import { act, render, screen, userEvent } from '@testing-library/react-native'
import Postulacion from '../Postulacion'

// Se testea como lo usaría una persona: escribir, tocar y leer lo que aparece en pantalla.
describe('Postulacion', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('muestra los errores si se envía vacío', async () => {
    const user = userEvent.setup()
    await render(<Postulacion />)

    await user.press(screen.getByText('Enviar postulación'))

    expect(screen.getByText('Escribí tu nombre')).toBeOnTheScreen()
    expect(screen.getByText('El email no es válido')).toBeOnTheScreen()
  })

  test('con los datos completos, envía y confirma', async () => {
    const user = userEvent.setup()
    await render(<Postulacion />)

    const [nombre, email, mensaje] = screen.getAllByDisplayValue('')
    await user.type(nombre, 'Ana')
    await user.type(email, 'ana@ejemplo.com')
    await user.type(mensaje, 'Me encanta React Native y busco un equipo chico.')
    await user.press(screen.getByText('Enviar postulación'))

    expect(screen.queryByText('Escribí tu nombre')).not.toBeOnTheScreen()
    // La demo simula un envío de 1,2 segundos: adelantamos el reloj falso
    await act(() => jest.advanceTimersByTime(1200))
    expect(screen.getByText('¡Listo, Ana!')).toBeOnTheScreen()
  })
})
