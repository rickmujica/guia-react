import * as Haptics from 'expo-haptics'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { Cargando, ErrorConReintento } from '@/components/Estados'
import { nombreModalidad } from '@/demos/datos'
import { colores, espacio } from '@/demos/tema'
import { useOferta } from '@/hooks/use-ofertas'
import { useEstaGuardada, useGuardadas } from '@/stores/guardadas'

export default function DetalleOferta() {
  // Los parámetros de la ruta siempre llegan como string
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: oferta, isPending, isError, error, refetch } = useOferta(Number(id))
  const guardada = useEstaGuardada(Number(id))
  const alternar = useGuardadas((s) => s.alternar)

  if (isPending) return <Cargando />
  if (isError) return <ErrorConReintento mensaje={error.message} reintentar={refetch} />

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido} contentInsetAdjustmentBehavior="automatic">
      {/* Una pantalla puede cambiar las opciones de su header desde adentro */}
      <Stack.Screen options={{ title: oferta.empresa }} />

      <Text style={styles.titulo}>{oferta.titulo}</Text>
      <Text style={styles.suave}>
        {oferta.empresa} · {nombreModalidad[oferta.modalidad]} · {oferta.pais}
      </Text>
      <Text style={styles.salario}>Hasta US$ {oferta.salarioMax.toLocaleString('es')} por mes</Text>

      <View style={styles.chips}>
        {oferta.stack.map((tecnologia) => (
          <Text key={tecnologia} style={styles.chip}>
            {tecnologia}
          </Text>
        ))}
      </View>

      <View style={styles.acciones}>
        <Pressable style={[styles.boton, styles.secundario]} onPress={() => alternar(oferta)}>
          <Text style={styles.secundarioTexto}>{guardada ? '♥ Guardada' : '♡ Guardar'}</Text>
        </Pressable>
        <Pressable
          style={[styles.boton, styles.secundario]}
          onPress={() => Share.share({ message: `${oferta.titulo} en ${oferta.empresa}` })}
        >
          <Text style={styles.secundarioTexto}>Compartir</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.boton}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          router.back()
        }}
      >
        <Text style={styles.botonTexto}>Postularme</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: espacio.xl, gap: espacio.m },
  titulo: { fontSize: 26, fontWeight: '800', color: colores.texto },
  suave: { fontSize: 15, color: colores.textoSuave },
  salario: { fontSize: 16, fontWeight: '600', color: colores.exito },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s, marginVertical: espacio.s },
  chip: {
    backgroundColor: colores.primarioSuave,
    color: colores.primario,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.xs,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 13,
  },
  acciones: { flexDirection: 'row', gap: espacio.s },
  boton: { flex: 1, backgroundColor: colores.primario, padding: 14, borderRadius: 12, alignItems: 'center' },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secundario: { backgroundColor: colores.tarjeta },
  secundarioTexto: { color: colores.texto, fontSize: 15, fontWeight: '500' },
})
