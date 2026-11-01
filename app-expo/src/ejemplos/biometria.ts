import * as LocalAuthentication from 'expo-local-authentication'

/**
 * Pide Face ID / huella antes de mostrar algo sensible. Si el celular no tiene
 * biometría configurada, deja pasar con el PIN del sistema (o devolvé false si preferís).
 * En iOS hace falta NSFaceIDUsageDescription: lo agrega el config plugin de la librería.
 */
export async function confirmarIdentidad(motivo: string): Promise<boolean> {
  const tieneHardware = await LocalAuthentication.hasHardwareAsync()
  const configurada = await LocalAuthentication.isEnrolledAsync()
  if (!tieneHardware || !configurada) return true

  const resultado = await LocalAuthentication.authenticateAsync({
    promptMessage: motivo,
    cancelLabel: 'Cancelar',
    // false = si falla la cara o la huella, ofrece el PIN o patrón del celular
    disableDeviceFallback: false,
  })
  return resultado.success
}
