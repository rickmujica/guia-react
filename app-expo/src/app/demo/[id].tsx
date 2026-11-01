import { Stack, useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { demos } from '@/demos'

export default function PantallaDemo() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const demo = demos.find((d) => d.id === id)

  if (!demo) return <Text>No existe la demo {id}</Text>

  return (
    <View style={styles.pantalla}>
      <Stack.Screen options={{ title: demo.titulo }} />
      <demo.Componente />
    </View>
  )
}

const styles = StyleSheet.create({ pantalla: { flex: 1 } })
