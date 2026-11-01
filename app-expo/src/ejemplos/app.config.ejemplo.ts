import type { ConfigContext, ExpoConfig } from 'expo/config'

// app.config.ts reemplaza (o extiende) a app.json cuando necesitás lógica:
// por ejemplo, instalar "dev", "preview" y "producción" a la vez en el mismo celular.
// Este archivo es un ejemplo; en un proyecto real va en la raíz y se llama app.config.ts.
const VARIANTE = process.env.APP_VARIANT ?? 'production' // lo define cada perfil de eas.json

const sufijo = VARIANTE === 'production' ? '' : `.${VARIANTE}`
const nombre = VARIANTE === 'production' ? 'Búsqueda RN' : `Búsqueda RN (${VARIANTE})`

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config, // lo que venga de app.json
  name: nombre,
  slug: 'guia-react-native',
  ios: { ...config.ios, bundleIdentifier: `com.ejemplo.busquedarn${sufijo}` },
  android: { ...config.android, package: `com.ejemplo.busquedarn${sufijo}` },
  extra: {
    ...config.extra,
    variante: VARIANTE,
  },
})
