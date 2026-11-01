import { Link } from 'expo-router'
import { Pressable, SectionList, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Titulo } from '@/components/Titulo'
import { demos } from '@/demos'
import { colores, espacio } from '@/demos/tema'

// Las demos de la guía agrupadas por capítulo
const secciones = [...new Set(demos.map((d) => d.capitulo))].map((capitulo) => ({
  capitulo,
  data: demos.filter((d) => d.capitulo === capitulo),
}))

export default function Demos() {
  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <Titulo>Demos</Titulo>
      <SectionList
        sections={secciones}
        keyExtractor={(demo) => demo.id}
        renderSectionHeader={({ section }) => <Text style={styles.seccion}>{section.capitulo}</Text>}
        renderItem={({ item }) => (
          // Link con asChild le pasa el link a su hijo: toda la fila se puede tocar
          <Link href={{ pathname: '/demo/[id]', params: { id: item.id } }} asChild>
            <Pressable style={styles.fila}>
              <Text style={styles.texto}>{item.titulo}</Text>
              <Text style={styles.flecha}>›</Text>
            </Pressable>
          </Link>
        )}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  lista: { paddingBottom: 100 },
  seccion: {
    fontSize: 13,
    fontWeight: '700',
    color: colores.textoSuave,
    textTransform: 'uppercase',
    paddingHorizontal: espacio.l,
    paddingTop: espacio.l,
    paddingBottom: espacio.s,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colores.tarjeta,
    paddingHorizontal: espacio.l,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  texto: { fontSize: 16, color: colores.texto },
  flecha: { fontSize: 20, color: colores.textoSuave },
})
