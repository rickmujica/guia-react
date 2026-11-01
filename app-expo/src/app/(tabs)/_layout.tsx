import { NativeTabs } from 'expo-router/native-tabs'
import { colores } from '@/demos/tema'

// Pestañas nativas: la barra de pestañas del sistema (UITabBar en iOS, con Liquid Glass,
// y la de Material en Android). Cada Trigger apunta a un archivo de esta carpeta.
export default function TabsLayout() {
  return (
    <NativeTabs tintColor={colores.primario}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Ofertas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="briefcase" md="work" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="guardadas">
        <NativeTabs.Trigger.Label>Guardadas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'heart', selected: 'heart.fill' }} md="favorite" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="demos">
        <NativeTabs.Trigger.Label>Demos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="apps" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
