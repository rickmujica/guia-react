import { StyleSheet, Text } from 'react-native'
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler'
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

const UMBRAL = 120

// La demo "Arrastrar una tarjeta", como se hace en una app de verdad: Gesture Handler
// detecta el gesto y Reanimated mueve la tarjeta, los dos en el hilo de UI. Aunque el hilo
// de JavaScript esté ocupado, la tarjeta sigue al dedo sin saltos.
export function TarjetaDeslizable({ titulo, alDecidir }: { titulo: string; alDecidir: (guardar: boolean) => void }) {
  // Un valor que vive en el hilo de UI. Se lee con get() y se cambia con set():
  // x.value también funciona, pero get/set es lo que entiende el React Compiler.
  const x = useSharedValue(0)

  const arrastre = usePanGesture({
    onUpdate: (evento) => {
      x.set(evento.translationX)
    },
    onDeactivate: (evento) => {
      if (Math.abs(evento.translationX) < UMBRAL) {
        x.set(withSpring(0)) // vuelve a su lugar con un resorte
        return
      }
      const guardar = evento.translationX > 0
      x.set(
        withTiming(guardar ? 500 : -500, { duration: 200 }, () => {
          // Este callback corre en el hilo de UI: para llamar a código de React, scheduleOnRN
          scheduleOnRN(alDecidir, guardar)
        }),
      )
    },
  })

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { rotate: `${interpolate(x.get(), [-200, 0, 200], [-12, 0, 12])}deg` }],
  }))

  return (
    <GestureDetector gesture={arrastre}>
      {/* entering: una animación de layout al aparecer, sin escribir nada más */}
      <Animated.View entering={FadeInDown} style={[styles.tarjeta, estilo]}>
        <Text style={styles.titulo}>{titulo}</Text>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  tarjeta: { height: 200, borderRadius: 20, padding: 24, justifyContent: 'flex-end', backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: '700' },
})
