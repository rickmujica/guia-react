import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { colores, espacio } from '@/demos/tema'

// Toda pantalla con datos remotos tiene tres estados: cargando, error y con datos.
export function Cargando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={colores.primario} />
    </View>
  )
}

export function ErrorConReintento({ mensaje, reintentar }: { mensaje: string; reintentar: () => void }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Pressable style={styles.boton} onPress={reintentar}>
        <Text style={styles.botonTexto}>Reintentar</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacio.l, padding: espacio.xl },
  mensaje: { fontSize: 15, color: colores.textoSuave, textAlign: 'center' },
  boton: { backgroundColor: colores.primario, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  botonTexto: { color: '#fff', fontWeight: '600' },
})
