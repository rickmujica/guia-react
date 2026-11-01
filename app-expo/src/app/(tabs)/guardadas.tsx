import { FlatList, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TarjetaOferta } from '@/components/TarjetaOferta'
import { Titulo } from '@/components/Titulo'
import { colores, espacio } from '@/demos/tema'
import { useGuardadas } from '@/stores/guardadas'

export default function Guardadas() {
  const ofertas = useGuardadas((s) => s.ofertas)

  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <Titulo>Guardadas</Titulo>
      <FlatList
        data={ofertas}
        keyExtractor={(oferta) => String(oferta.id)}
        renderItem={({ item }) => <TarjetaOferta oferta={item} />}
        ListEmptyComponent={
          <Text style={styles.vacio}>Tocá el corazón de una oferta para guardarla. Quedan guardadas aunque cierres la app.</Text>
        }
        contentContainerStyle={styles.lista}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { paddingBottom: 100 },
  vacio: { color: colores.textoSuave, textAlign: 'center', marginTop: espacio.xl, paddingHorizontal: espacio.xl, lineHeight: 21 },
})
