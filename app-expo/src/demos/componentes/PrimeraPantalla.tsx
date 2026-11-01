import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ofertas } from '../datos'
import { colores, espacio } from '../tema'

// View es la caja (como un div), Text es el único lugar donde puede ir texto,
// y ScrollView hace que el contenido se pueda desplazar.
export default function PrimeraPantalla() {
  const oferta = ofertas[0]

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.tarjeta}>
        <View style={styles.encabezado}>
          {/* Un avatar con iniciales: un View redondo con un Text centrado */}
          <View style={styles.avatar}>
            <Text style={styles.iniciales}>{oferta.empresa.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.titulo} numberOfLines={1}>
              {oferta.titulo}
            </Text>
            <Text style={styles.suave}>{oferta.empresa}</Text>
          </View>
        </View>

        {/* Los Text se pueden anidar: el de adentro hereda y suma estilos */}
        <Text style={styles.parrafo}>
          Buscamos a alguien con <Text style={styles.negrita}>2+ años de React Native</Text> para
          sumarse a un equipo chico. Trabajo <Text style={styles.negrita}>100 % remoto</Text>.
        </Text>

        <View style={styles.chips}>
          {oferta.stack.map((tecnologia) => (
            <View key={tecnologia} style={styles.chip}>
              <Text style={styles.chipTexto}>{tecnologia}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.nota}>
        Un texto largo que no entra en una línea se corta con numberOfLines y termina en puntos
        suspensivos, como el título de arriba si lo hacés más largo.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: espacio.l, gap: espacio.l },
  tarjeta: {
    backgroundColor: colores.tarjeta,
    borderRadius: 16,
    padding: espacio.l,
    gap: espacio.m,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.borde,
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iniciales: { color: colores.primario, fontWeight: '700', fontSize: 16 },
  flex: { flex: 1 },
  titulo: { fontSize: 17, fontWeight: '600', color: colores.texto },
  suave: { color: colores.textoSuave, marginTop: 2 },
  parrafo: { fontSize: 15, lineHeight: 22, color: colores.texto },
  negrita: { fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
  chip: {
    backgroundColor: colores.fondo,
    borderRadius: 999,
    paddingVertical: espacio.xs,
    paddingHorizontal: espacio.m,
  },
  chipTexto: { fontSize: 13, color: colores.textoSuave },
  nota: { color: colores.textoSuave, fontSize: 13, lineHeight: 19 },
})
