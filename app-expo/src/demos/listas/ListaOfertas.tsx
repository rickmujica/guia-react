import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { nombreModalidad, ofertas, type Oferta } from '../datos'
import { colores, espacio } from '../tema'

const POR_PAGINA = 5

// FlatList solo renderiza lo que está en pantalla (y un poco más). Para listas largas
// siempre FlatList (o FlashList), nunca un .map() adentro de un ScrollView.
export default function ListaOfertas() {
  const [busqueda, setBusqueda] = useState('')
  const [cantidad, setCantidad] = useState(POR_PAGINA)

  const filtradas = ofertas.filter((o) =>
    `${o.titulo} ${o.empresa}`.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )
  const visibles = filtradas.slice(0, cantidad)

  return (
    <View style={styles.pantalla}>
      <TextInput
        value={busqueda}
        onChangeText={(texto) => {
          setBusqueda(texto)
          setCantidad(POR_PAGINA)
        }}
        placeholder="Buscar por puesto o empresa"
        placeholderTextColor={colores.textoSuave}
        style={styles.buscador}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
      <FlatList
        data={visibles}
        keyExtractor={(oferta) => String(oferta.id)}
        renderItem={({ item }) => <FilaOferta oferta={item} />}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={<Text style={styles.vacio}>No hay ofertas para “{busqueda}”.</Text>}
        ListFooterComponent={
          visibles.length < filtradas.length ? (
            <Text style={styles.pie}>Cargando más…</Text>
          ) : undefined
        }
        // Se llama al acercarse al final: acá iría el pedido de la página siguiente
        onEndReached={() => setCantidad((c) => c + POR_PAGINA)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  )
}

function FilaOferta({ oferta }: { oferta: Oferta }) {
  return (
    <Pressable style={({ pressed }) => [styles.fila, pressed && { backgroundColor: colores.fondo }]}>
      <View style={styles.flex}>
        <Text style={styles.titulo}>{oferta.titulo}</Text>
        <Text style={styles.suave}>
          {oferta.empresa} · {nombreModalidad[oferta.modalidad]} · {oferta.pais}
        </Text>
      </View>
      <Text style={styles.salario}>US$ {oferta.salarioMax.toLocaleString('es')}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.tarjeta },
  buscador: {
    margin: espacio.m,
    backgroundColor: colores.fondo,
    borderRadius: 10,
    paddingHorizontal: espacio.m,
    paddingVertical: 10,
    fontSize: 15,
    color: colores.texto,
  },
  lista: { paddingBottom: espacio.xl },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    gap: espacio.m,
  },
  flex: { flex: 1 },
  titulo: { fontSize: 15, fontWeight: '600', color: colores.texto },
  suave: { fontSize: 13, color: colores.textoSuave, marginTop: 2 },
  salario: { fontSize: 13, fontWeight: '600', color: colores.exito },
  separador: { height: StyleSheet.hairlineWidth, backgroundColor: colores.borde, marginLeft: espacio.l },
  vacio: { textAlign: 'center', color: colores.textoSuave, marginTop: espacio.xl },
  pie: { textAlign: 'center', color: colores.textoSuave, padding: espacio.m },
})
