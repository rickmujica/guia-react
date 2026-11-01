import { useState } from 'react'
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { colores, espacio } from '../tema'

// En React Native todo View es flex, y la dirección por defecto es columna (en la web es fila).
const opciones = {
  flexDirection: ['column', 'row'],
  justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
  alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
} as const

type Propiedad = keyof typeof opciones

export default function Flexbox() {
  const [estilo, setEstilo] = useState<ViewStyle>({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  })

  // Cada toque pasa al siguiente valor de esa propiedad
  function siguiente(propiedad: Propiedad) {
    const valores: readonly string[] = opciones[propiedad]
    const actual = valores.indexOf(String(estilo[propiedad]))
    setEstilo({ ...estilo, [propiedad]: valores[(actual + 1) % valores.length] })
  }

  return (
    <View style={styles.pantalla}>
      {(Object.keys(opciones) as Propiedad[]).map((propiedad) => (
        <Pressable key={propiedad} style={styles.control} onPress={() => siguiente(propiedad)}>
          <Text style={styles.propiedad}>{propiedad}</Text>
          <Text style={styles.valor}>{String(estilo[propiedad])} ›</Text>
        </Pressable>
      ))}

      <View style={[styles.contenedor, estilo]}>
        {['A', 'B', 'C'].map((letra, i) => (
          <View key={letra} style={[styles.caja, { minHeight: 36 + i * 14, minWidth: 36 + i * 14 }]}>
            <Text style={styles.letra}>{letra}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo, padding: espacio.l, gap: espacio.s },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colores.tarjeta,
    paddingVertical: 10,
    paddingHorizontal: espacio.m,
    borderRadius: 10,
  },
  propiedad: { fontFamily: 'monospace', fontSize: 13, color: colores.textoSuave },
  valor: { fontFamily: 'monospace', fontSize: 13, color: colores.primario, fontWeight: '600' },
  contenedor: {
    flex: 1,
    marginTop: espacio.s,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colores.primario,
    borderRadius: 12,
    padding: espacio.s,
    gap: espacio.s,
  },
  caja: {
    backgroundColor: colores.primario,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letra: { color: '#fff', fontWeight: '700' },
})
