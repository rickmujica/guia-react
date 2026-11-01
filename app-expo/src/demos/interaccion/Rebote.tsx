import { useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { colores, espacio } from '../tema'

// La API Animated viene con React Native. Un Animated.Value guarda un número que cambia
// sin pasar por el estado de React, y Animated.View lo aplica directo al estilo.
export default function Rebote() {
  const escala = useRef(new Animated.Value(1)).current
  const entrada = useRef(new Animated.Value(0)).current
  const [guardada, setGuardada] = useState(false)

  function guardar() {
    setGuardada((g) => !g)
    // Achica y vuelve con un resorte
    Animated.sequence([
      Animated.timing(escala, { toValue: 0.8, duration: 90, useNativeDriver: true }),
      Animated.spring(escala, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
    ]).start()
  }

  function mostrar() {
    entrada.setValue(0)
    Animated.timing(entrada, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  }

  return (
    <View style={styles.pantalla}>
      <Pressable onPress={guardar}>
        <Animated.View style={[styles.corazon, { transform: [{ scale: escala }] }]}>
          <Text style={styles.icono}>{guardada ? '♥' : '♡'}</Text>
        </Animated.View>
      </Pressable>
      <Text style={styles.ayuda}>{guardada ? 'Guardada' : 'Tocá para guardar la oferta'}</Text>

      <Pressable style={styles.boton} onPress={mostrar}>
        <Text style={styles.botonTexto}>Mostrar tarjeta</Text>
      </Pressable>

      <Animated.View
        style={[
          styles.tarjeta,
          {
            opacity: entrada,
            // interpolate convierte 0→1 en otro rango: acá, de 40 px abajo a su lugar
            transform: [{ translateY: entrada.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          },
        ]}
      >
        <Text style={styles.titulo}>Nueva oferta</Text>
        <Text style={styles.suave}>Tech Lead Mobile en Yerba Labs</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo, padding: espacio.l, alignItems: 'center', gap: espacio.m },
  corazon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.tarjeta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espacio.xl,
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
  },
  icono: { fontSize: 44, color: '#e11d48' },
  ayuda: { color: colores.textoSuave },
  boton: { backgroundColor: colores.primario, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginTop: espacio.l },
  botonTexto: { color: '#fff', fontWeight: '600' },
  tarjeta: { alignSelf: 'stretch', backgroundColor: colores.tarjeta, borderRadius: 14, padding: espacio.l },
  titulo: { fontWeight: '700', fontSize: 16, color: colores.texto },
  suave: { color: colores.textoSuave, marginTop: 2 },
})
