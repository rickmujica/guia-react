import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { router, type Href } from 'expo-router'
import { useEffect } from 'react'
import { Platform } from 'react-native'

// Desde SDK 58 las notificaciones se muestran aunque la app esté abierta.
// El handler sirve para cambiar eso: acá, sin sonido mientras la usás.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

/** Pide permiso y devuelve el token para mandarle push a este celular (o null). */
export async function registrarParaPush(): Promise<string | null> {
  // En Android 13+ el canal tiene que existir antes de pedir permiso
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'General',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }
  // Los simuladores y emuladores no reciben push remotas
  if (!Device.isDevice) return null

  let { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') {
    ;({ status } = await Notifications.requestPermissionsAsync())
  }
  if (status !== 'granted') return null

  // El projectId lo agrega `eas init` en app.json (extra.eas.projectId)
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId })
  return data // "ExponentPushToken[xxxx]": se lo mandás a tu backend
}

/** Una notificación local: no necesita servidor ni token. */
export function recordarPostulacion(empresa: string, ofertaId: string) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '¿Te respondieron?',
      body: `Pasaron 3 días desde que te postulaste a ${empresa}.`,
      data: { url: `/oferta/${ofertaId}` },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24 * 3,
    },
  })
}

/** Al tocar una notificación (con la app abierta o cerrada), navega a la URL que trae. */
export function useAbrirDesdeNotificacion() {
  const respuesta = Notifications.useLastNotificationResponse()

  useEffect(() => {
    const url = respuesta?.notification.request.content.data?.url
    if (typeof url === 'string' && respuesta?.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      router.push(url as Href)
      void Notifications.clearLastNotificationResponseAsync()
    }
  }, [respuesta])
}
