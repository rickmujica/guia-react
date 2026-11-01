import { FlashList } from '@shopify/flash-list'
import { useDeferredValue, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Cargando, ErrorConReintento } from '@/components/Estados'
import { TarjetaOferta } from '@/components/TarjetaOferta'
import { Titulo } from '@/components/Titulo'
import { colores, espacio } from '@/demos/tema'
import { useOfertas } from '@/hooks/use-ofertas'

export default function Ofertas() {
  const [texto, setTexto] = useState('')
  // La búsqueda usa una versión "atrasada" del texto: escribir nunca se traba
  const busqueda = useDeferredValue(texto)
  const { data, isPending, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOfertas(busqueda)

  const lista = data?.pages.flatMap((pagina) => pagina.ofertas) ?? []

  return (
    // edges top: el contenido empieza debajo de la isla dinámica; abajo lo maneja la barra de pestañas
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <Titulo>Ofertas</Titulo>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Buscar puesto, empresa o tecnología"
        placeholderTextColor={colores.textoSuave}
        style={styles.buscador}
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />

      {isPending ? (
        <Cargando />
      ) : isError ? (
        <ErrorConReintento mensaje={error.message} reintentar={refetch} />
      ) : (
        // FlashList recicla las filas que salen de pantalla en vez de crear nuevas
        <FlashList
          data={lista}
          keyExtractor={(oferta) => String(oferta.id)}
          renderItem={({ item }) => <TarjetaOferta oferta={item} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.4}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={<Text style={styles.vacio}>No hay ofertas para “{busqueda}”.</Text>}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.pie} /> : null}
          contentContainerStyle={styles.lista}
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  buscador: {
    marginHorizontal: espacio.l,
    marginBottom: espacio.m,
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    paddingHorizontal: espacio.l,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.texto,
  },
  lista: { paddingTop: espacio.xs, paddingBottom: 100 }, // lugar para la barra de pestañas
  vacio: { textAlign: 'center', color: colores.textoSuave, marginTop: espacio.xl },
  pie: { padding: espacio.l },
})
