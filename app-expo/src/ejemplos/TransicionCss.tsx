import { useState } from 'react'
import { Pressable, Text } from 'react-native'
import Animated from 'react-native-reanimated'

// Reanimated 4 también entiende transiciones al estilo CSS: cuando cambia el estilo,
// anima el cambio solo. Para animaciones simples de estado no hace falta nada más.
export function BotonExpandible() {
  const [abierto, setAbierto] = useState(false)

  return (
    <Pressable onPress={() => setAbierto((a) => !a)}>
      <Animated.View
        style={{
          width: abierto ? 260 : 140,
          backgroundColor: abierto ? '#2563eb' : '#94a3b8',
          borderRadius: 14,
          padding: 16,
          transitionProperty: ['width', 'backgroundColor'],
          transitionDuration: 300,
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>{abierto ? 'Filtros abiertos' : 'Filtros'}</Text>
      </Animated.View>
    </Pressable>
  )
}
