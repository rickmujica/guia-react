import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colores, espacio } from '../tema'

// Modal muestra contenido por encima de la pantalla. Con transparent se ve lo de atrás
// y el fondo oscuro lo pone uno. onRequestClose es obligatorio para el botón "atrás" de Android.
export default function Confirmar() {
  const [visible, setVisible] = useState(false)
  const [estado, setEstado] = useState('Sin postular')

  return (
    <View style={styles.pantalla}>
      <Text style={styles.estado}>{estado}</Text>
      <Pressable style={styles.boton} onPress={() => setVisible(true)}>
        <Text style={styles.botonTexto}>Postularme</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* Tocar el fondo cierra el modal */}
        <Pressable style={styles.fondo} onPress={() => setVisible(false)}>
          {/* Este Pressable vacío evita que un toque en la tarjeta llegue al fondo */}
          <Pressable style={styles.tarjeta} onPress={() => {}}>
            <Text style={styles.titulo}>¿Te postulás a Nubelia?</Text>
            <Text style={styles.texto}>Le vamos a mandar tu perfil y tu CV.</Text>
            <View style={styles.acciones}>
              <Pressable style={[styles.accion, styles.secundaria]} onPress={() => setVisible(false)}>
                <Text style={styles.secundariaTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.accion}
                onPress={() => {
                  setEstado('Postulación enviada ✓')
                  setVisible(false)
                }}
              >
                <Text style={styles.botonTexto}>Enviar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: espacio.l,
    justifyContent: 'center',
    gap: espacio.l,
  },
  estado: { textAlign: 'center', fontSize: 16, color: colores.texto },
  boton: { backgroundColor: colores.primario, padding: 14, borderRadius: 12, alignItems: 'center' },
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 16 },
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: espacio.xl,
  },
  tarjeta: { backgroundColor: colores.tarjeta, borderRadius: 16, padding: espacio.xl, gap: espacio.s },
  titulo: { fontSize: 18, fontWeight: '700', color: colores.texto },
  texto: { fontSize: 15, color: colores.textoSuave },
  acciones: { flexDirection: 'row', gap: espacio.s, marginTop: espacio.m },
  accion: {
    flex: 1,
    backgroundColor: colores.primario,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secundaria: { backgroundColor: colores.fondo },
  secundariaTexto: { color: colores.texto, fontWeight: '600', fontSize: 16 },
})
