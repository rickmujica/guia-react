import { useState } from 'react'
import { ActivityIndicator, Button, Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { colores, espacio } from '../tema'

// Pressable es la base de cualquier cosa que se toca: recibe una función de estilo
// que sabe si está presionado, y eventos como onPress y onLongPress.
export default function Botones() {
  const [toques, setToques] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const [avisos, setAvisos] = useState(true)

  function enviar() {
    setEnviando(true)
    setTimeout(() => setEnviando(false), 1500)
  }

  return (
    <View style={styles.pantalla}>
      <Pressable
        onPress={() => setToques((n) => n + 1)}
        onLongPress={() => setToques(0)}
        hitSlop={8}
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
      >
        <Text style={styles.botonTexto}>Tocado {toques} veces</Text>
      </Pressable>
      <Text style={styles.ayuda}>Mantené presionado para volver a cero.</Text>

      <Pressable
        onPress={enviar}
        disabled={enviando}
        style={({ pressed }) => [styles.boton, (pressed || enviando) && styles.botonPresionado]}
      >
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>Postularme</Text>}
      </Pressable>

      {/* Button es el botón del sistema: se ve distinto en iOS y Android, y casi no se puede estilizar */}
      <Button title="Button del sistema" onPress={() => setToques((n) => n + 1)} />

      <View style={styles.fila}>
        <Text style={styles.texto}>Avisos de ofertas nuevas</Text>
        <Switch
          value={avisos}
          onValueChange={setAvisos}
          trackColor={{ true: colores.primario, false: colores.borde }}
        />
      </View>
      <Text style={styles.ayuda}>Avisos {avisos ? 'activados' : 'desactivados'}.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo, padding: espacio.l, gap: espacio.m },
  boton: {
    backgroundColor: colores.primario,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  botonPresionado: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
  ayuda: { color: colores.textoSuave, fontSize: 13, marginTop: -4 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colores.tarjeta,
    padding: espacio.l,
    borderRadius: 12,
    marginTop: espacio.s,
  },
  texto: { fontSize: 15, color: colores.texto },
})
