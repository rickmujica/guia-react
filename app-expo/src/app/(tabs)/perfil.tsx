import * as Haptics from 'expo-haptics'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Titulo } from '@/components/Titulo'
import { colores, espacio } from '@/demos/tema'
import { useSesion } from '@/stores/sesion'

export default function Perfil() {
  const nombre = useSesion((s) => s.nombre)
  const cerrarSesion = useSesion((s) => s.cerrarSesion)
  const [foto, setFoto] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  async function elegirFoto() {
    // La galería no necesita permiso: el selector del sistema solo le da a la app la foto elegida
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!resultado.canceled) setFoto(resultado.assets[0].uri)
  }

  async function sacarFoto() {
    // La cámara sí: se pide en el momento de usarla, y si lo niega, se explica cómo activarlo
    const permiso = await ImagePicker.requestCameraPermissionsAsync()
    if (!permiso.granted) {
      setAviso('Sin permiso para la cámara. Podés activarlo en Ajustes.')
      return
    }
    const resultado = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
    if (!resultado.canceled) setFoto(resultado.assets[0].uri)
  }

  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <Titulo>Perfil</Titulo>
      <View style={styles.contenido}>
        <View style={styles.cabecera}>
          {foto ? (
            <Image source={foto} style={styles.foto} contentFit="cover" transition={200} />
          ) : (
            <View style={[styles.foto, styles.sinFoto]}>
              <Text style={styles.inicial}>{nombre?.[0]?.toUpperCase() ?? '?'}</Text>
            </View>
          )}
          <Text style={styles.nombre}>{nombre}</Text>
        </View>

        <Boton texto="Elegir foto de la galería" onPress={elegirFoto} />
        <Boton texto="Sacar una foto" onPress={sacarFoto} />
        {aviso && (
          <Pressable onPress={() => Linking.openSettings()}>
            <Text style={styles.aviso}>{aviso} Tocá acá para abrirlos.</Text>
          </Pressable>
        )}
        <Boton texto="Probar la vibración" onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)} />
        <Boton texto="Cerrar sesión" onPress={cerrarSesion} peligro />
      </View>
    </SafeAreaView>
  )
}

function Boton({ texto, onPress, peligro }: { texto: string; onPress: () => void; peligro?: boolean }) {
  return (
    <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={onPress}>
      <Text style={[styles.botonTexto, peligro && { color: colores.error }]}>{texto}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: espacio.l, gap: espacio.s },
  cabecera: { alignItems: 'center', gap: espacio.s, marginBottom: espacio.l },
  foto: { width: 96, height: 96, borderRadius: 48 },
  sinFoto: { backgroundColor: colores.primarioSuave, alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 40, fontWeight: '700', color: colores.primario },
  nombre: { fontSize: 20, fontWeight: '700', color: colores.texto },
  boton: { backgroundColor: colores.tarjeta, padding: espacio.l, borderRadius: 12 },
  presionado: { opacity: 0.7 },
  botonTexto: { fontSize: 16, color: colores.primario, fontWeight: '500' },
  aviso: { color: colores.error, fontSize: 14, paddingHorizontal: espacio.s },
})
