import { useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native'
import { ofertas } from '../datos'
import { colores, espacio } from '../tema'

const UMBRAL = 110 // px que hay que arrastrar para decidir

// Arrastrar una tarjeta: a la derecha la guarda, a la izquierda la descarta.
// PanResponder viene con React Native; en una app real se usa react-native-gesture-handler
// con Reanimated, que corren en el hilo de UI (ver el capítulo).
export default function Deslizar() {
  const [indice, setIndice] = useState(0)
  const [guardadas, setGuardadas] = useState(0)
  const posicion = useRef(new Animated.ValueXY()).current

  function decidir(direccion: 1 | -1) {
    Animated.timing(posicion, { toValue: { x: direccion * 500, y: 0 }, duration: 200, useNativeDriver: true }).start(() => {
      if (direccion === 1) setGuardadas((n) => n + 1)
      setIndice((i) => i + 1)
      posicion.setValue({ x: 0, y: 0 })
    })
  }

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesto) => Math.abs(gesto.dx) > 5,
      onPanResponderMove: Animated.event([null, { dx: posicion.x, dy: posicion.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesto) => {
        if (gesto.dx > UMBRAL) decidir(1)
        else if (gesto.dx < -UMBRAL) decidir(-1)
        else Animated.spring(posicion, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start()
      },
    }),
  ).current

  const oferta = ofertas[indice % ofertas.length]
  const rotacion = posicion.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-12deg', '0deg', '12deg'] })

  return (
    <View style={styles.pantalla}>
      <Text style={styles.contador}>Guardadas: {guardadas}</Text>
      <Animated.View
        {...responder.panHandlers}
        style={[styles.tarjeta, { transform: [...posicion.getTranslateTransform(), { rotate: rotacion }] }]}
      >
        <Text style={styles.empresa}>{oferta.empresa}</Text>
        <Text style={styles.titulo}>{oferta.titulo}</Text>
        <Text style={styles.salario}>Hasta US$ {oferta.salarioMax.toLocaleString('es')}</Text>
      </Animated.View>
      <Text style={styles.ayuda}>← Descartar · Guardar →</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo, alignItems: 'center', justifyContent: 'center', padding: espacio.xl, gap: espacio.l, overflow: 'hidden' },
  contador: { color: colores.textoSuave, fontWeight: '600' },
  tarjeta: {
    alignSelf: 'stretch',
    height: 220,
    backgroundColor: colores.tarjeta,
    borderRadius: 20,
    padding: espacio.xl,
    justifyContent: 'flex-end',
    gap: espacio.xs,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  empresa: { color: colores.primario, fontWeight: '700', textTransform: 'uppercase', fontSize: 12 },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.texto },
  salario: { color: colores.exito, fontWeight: '600' },
  ayuda: { color: colores.textoSuave },
})
