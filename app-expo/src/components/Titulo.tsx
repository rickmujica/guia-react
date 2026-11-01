import { StyleSheet, Text } from 'react-native'
import { colores, espacio } from '@/demos/tema'

// El título grande de cada pestaña
export function Titulo({ children }: { children: string }) {
  return (
    <Text style={styles.titulo} accessibilityRole="header">
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: colores.texto,
    paddingHorizontal: espacio.l,
    paddingTop: espacio.s,
    paddingBottom: espacio.m,
  },
})
