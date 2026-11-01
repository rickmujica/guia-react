import { focusManager, onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'
import { useEffect } from 'react'
import { AppState, Platform, type AppStateStatus } from 'react-native'

// En la web TanStack Query ya escucha "online" y "visibilitychange" del navegador.
// En el celular no hay window: se lo contamos nosotros.

// 1) Sin internet, las consultas se pausan y se reanudan solas al volver la conexión
onlineManager.setEventListener((setOnline) => {
  const suscripcion = Network.addNetworkStateListener((estado) => {
    setOnline(!!estado.isConnected)
  })
  return () => suscripcion.remove()
})

// 2) Al volver a la app (desde otra o desde el fondo), refresca lo que esté viejo
function alCambiarEstado(estado: AppStateStatus) {
  if (Platform.OS !== 'web') focusManager.setFocused(estado === 'active')
}

export function useRefrescarAlVolver() {
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', alCambiarEstado)
    return () => suscripcion.remove()
  }, [])
}

/** Para mostrar un aviso de "Sin conexión" arriba de la pantalla. */
export function useSinConexion() {
  const estado = Network.useNetworkState()
  return estado.isConnected === false
}
