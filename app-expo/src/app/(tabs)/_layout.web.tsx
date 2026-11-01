import { Tabs } from 'expo-router/js-tabs'
import { colores } from '@/demos/tema'

// En la web no hay barra de pestañas nativa: este archivo .web.tsx reemplaza a _layout.tsx
// solo ahí, con las pestañas hechas en JavaScript (las de React Navigation).
export default function TabsLayoutWeb() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colores.primario }}>
      <Tabs.Screen name="index" options={{ title: 'Ofertas' }} />
      <Tabs.Screen name="guardadas" options={{ title: 'Guardadas' }} />
      <Tabs.Screen name="demos" options={{ title: 'Demos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
