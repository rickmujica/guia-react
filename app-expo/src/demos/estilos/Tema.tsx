import { useState } from 'react'
import { Platform, Pressable, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native'

// Un tema con una versión clara y una oscura. En una app real el modo sale de
// useColorScheme() (la preferencia del sistema) y se puede pisar desde la configuración.
const temas = {
  claro: { fondo: '#f4f5f7', tarjeta: '#ffffff', texto: '#16181d', suave: '#5f6673', primario: '#2563eb' },
  oscuro: { fondo: '#0d0f12', tarjeta: '#1b1e24', texto: '#f1f3f6', suave: '#9aa2b1', primario: '#6b9bff' },
}

export default function Tema() {
  const sistema = useColorScheme() // 'light' | 'dark' | null
  const [oscuro, setOscuro] = useState(sistema === 'dark')
  const t = oscuro ? temas.oscuro : temas.claro

  return (
    <View style={[styles.pantalla, { backgroundColor: t.fondo }]}>
      <View style={[styles.tarjeta, { backgroundColor: t.tarjeta }]}>
        <Text style={[styles.titulo, { color: t.texto }]}>Modo oscuro</Text>
        <Switch value={oscuro} onValueChange={setOscuro} />
      </View>

      <View style={[styles.tarjeta, styles.columna, { backgroundColor: t.tarjeta }]}>
        <Text style={[styles.etiqueta, { color: t.suave }]}>Platform.OS</Text>
        <Text style={[styles.valor, { color: t.texto }]}>{Platform.OS}</Text>
        <Text style={[styles.etiqueta, { color: t.suave }]}>Preferencia del sistema</Text>
        <Text style={[styles.valor, { color: t.texto }]}>{sistema ?? 'sin preferencia'}</Text>
        <Text style={[styles.etiqueta, { color: t.suave }]}>Platform.select</Text>
        <Text style={[styles.valor, { color: t.texto }]}>
          {Platform.select({ ios: 'Estás en un iPhone', android: 'Estás en Android', default: 'Estás en la web' })}
        </Text>
      </View>

      <Pressable style={[styles.boton, { backgroundColor: t.primario }]}>
        <Text style={styles.botonTexto}>Ver ofertas</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, padding: 16, gap: 12 },
  tarjeta: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Desde React Native 0.76, boxShadow funciona igual en iOS, Android y web
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  columna: { flexDirection: 'column', alignItems: 'flex-start', gap: 2 },
  titulo: { fontSize: 17, fontWeight: '600' },
  etiqueta: { fontSize: 12, marginTop: 8 },
  valor: {
    fontSize: 16,
    fontWeight: '500',
    // Una fuente monoespaciada tiene otro nombre en cada plataforma
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  boton: { padding: 14, borderRadius: 12, alignItems: 'center' },
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
})
