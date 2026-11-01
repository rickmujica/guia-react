import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { colores } from '@/demos/tema'

// Se muestra cuando un link (o un deep link) apunta a una ruta que no existe
export default function NoEncontrada() {
  return (
    <View style={styles.pantalla}>
      <Stack.Screen options={{ title: 'Ups' }} />
      <Text style={styles.texto}>Esta pantalla no existe.</Text>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  texto: { fontSize: 17, color: colores.texto },
  link: { fontSize: 16, color: colores.primario },
})
