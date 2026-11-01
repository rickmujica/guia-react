import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { nombreModalidad, type Oferta } from '@/demos/datos'
import { colores, espacio } from '@/demos/tema'
import { useEstaGuardada, useGuardadas } from '@/stores/guardadas'

// memo: en una lista larga, una fila solo se vuelve a renderizar si cambian sus props.
// (Con el React Compiler activado esto se hace solo, pero conviene saber por qué importa.)
export const TarjetaOferta = memo(function TarjetaOferta({ oferta }: { oferta: Oferta }) {
  const guardada = useEstaGuardada(oferta.id)
  const alternar = useGuardadas((s) => s.alternar)

  return (
    // router.push navega desde código; con typedRoutes, la ruta y sus parámetros están tipados
    <Pressable
      onPress={() => router.push({ pathname: '/oferta/[id]', params: { id: oferta.id } })}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <View style={styles.flex}>
        <Text style={styles.empresa}>{oferta.empresa}</Text>
        <Text style={styles.titulo}>{oferta.titulo}</Text>
        <Text style={styles.suave}>
          {nombreModalidad[oferta.modalidad]} · {oferta.pais} · hasta US$ {oferta.salarioMax.toLocaleString('es')}
        </Text>
      </View>
      <Pressable
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={guardada ? 'Quitar de guardadas' : 'Guardar oferta'}
        onPress={() => {
          Haptics.selectionAsync()
          alternar(oferta)
        }}
      >
        <Text style={[styles.corazon, guardada && styles.corazonActivo]}>{guardada ? '♥' : '♡'}</Text>
      </Pressable>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    backgroundColor: colores.tarjeta,
    marginHorizontal: espacio.l,
    marginBottom: espacio.m,
    padding: espacio.l,
    borderRadius: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  presionada: { opacity: 0.75 },
  flex: { flex: 1, gap: 2 },
  empresa: { fontSize: 12, fontWeight: '700', color: colores.primario, textTransform: 'uppercase' },
  titulo: { fontSize: 16, fontWeight: '600', color: colores.texto },
  suave: { fontSize: 13, color: colores.textoSuave },
  corazon: { fontSize: 26, color: colores.textoSuave },
  corazonActivo: { color: '#e11d48' },
})
