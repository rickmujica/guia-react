import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

type Props = { alEntrar: (identityToken: string, nombre: string | null) => void }

/**
 * Si tu app ofrece "Entrar con Google" (u otra red social) en iOS, Apple exige
 * ofrecer también una opción equivalente que cuide la privacidad: Sign in with Apple.
 */
export function BotonApple({ alEntrar }: Props) {
  if (Platform.OS !== 'ios') return null

  async function entrar() {
    try {
      const credencial = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      // Apple manda el nombre SOLO la primera vez: guardalo en tu backend en ese momento
      const nombre = credencial.fullName?.givenName ?? null
      if (credencial.identityToken) alEntrar(credencial.identityToken, nombre)
    } catch (error) {
      // Cancelar no es un error para mostrar
      if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return
      throw error
    }
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={12}
      style={{ height: 48 }}
      onPress={entrar}
    />
  )
}
