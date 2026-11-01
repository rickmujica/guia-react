import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useSyncExternalStore } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSesion } from '@/stores/sesion'

// La pantalla de carga (splash) queda visible hasta que leamos la sesión guardada
SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 2 } },
})

export default function RootLayout() {
  const logueado = useSesion((s) => s.token !== null)
  // true cuando zustand terminó de leer la sesión del almacenamiento seguro
  const hidratada = useSyncExternalStore(useSesion.persist.onFinishHydration, useSesion.persist.hasHydrated)

  useEffect(() => {
    if (hidratada) SplashScreen.hideAsync()
  }, [hidratada])

  if (!hidratada) return null

  return (
    // Gesture Handler necesita esta vista en la raíz para reconocer gestos en toda la app
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          {/* Con sesión: las pestañas y las pantallas de detalle */}
          <Stack.Protected guard={logueado}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="oferta/[id]" options={{ title: '' }} />
            <Stack.Screen name="demo/[id]" />
          </Stack.Protected>
          {/* Sin sesión: solo el login. Al cambiar `logueado`, Expo Router redirige solo */}
          <Stack.Protected guard={!logueado}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
