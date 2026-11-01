import { SectionList, StyleSheet, Text, View } from 'react-native'
import { nombreModalidad, ofertas, type Modalidad } from '../datos'
import { colores, espacio } from '../tema'

// SectionList es una FlatList agrupada: recibe secciones, cada una con su título y sus datos.
const secciones = (['remoto', 'hibrido', 'presencial'] as Modalidad[]).map((modalidad) => ({
  titulo: nombreModalidad[modalidad],
  data: ofertas.filter((o) => o.modalidad === modalidad),
}))

export default function ListaPorModalidad() {
  return (
    <SectionList
      style={styles.pantalla}
      sections={secciones}
      keyExtractor={(oferta) => String(oferta.id)}
      renderSectionHeader={({ section }) => (
        <Text style={styles.encabezado}>
          {section.titulo} ({section.data.length})
        </Text>
      )}
      renderItem={({ item }) => (
        <View style={styles.fila}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.suave}>{item.empresa}</Text>
        </View>
      )}
      // En iOS los encabezados quedan pegados arriba mientras scrolleás su sección
      stickySectionHeadersEnabled
    />
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.tarjeta },
  encabezado: {
    backgroundColor: colores.fondo,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.s,
    fontSize: 13,
    fontWeight: '700',
    color: colores.textoSuave,
    textTransform: 'uppercase',
  },
  fila: {
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  titulo: { fontSize: 15, fontWeight: '600', color: colores.texto },
  suave: { fontSize: 13, color: colores.textoSuave, marginTop: 2 },
})
