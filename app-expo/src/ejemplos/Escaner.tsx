import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useRef } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

/** Escanea un QR (por ejemplo, el link a una oferta en un evento de empleo). */
export function EscanerQr({ alLeer }: { alLeer: (texto: string) => void }) {
  const [permiso, pedirPermiso] = useCameraPermissions()
  // onBarcodeScanned se dispara muchas veces por segundo: nos quedamos con la primera
  const leido = useRef(false)

  if (!permiso) return null // todavía cargando el estado del permiso
  if (!permiso.granted) {
    return (
      <View style={styles.centro}>
        <Text>Necesitamos la cámara para leer el código QR.</Text>
        <Button title="Dar permiso" onPress={pedirPermiso} />
      </View>
    )
  }

  function alEscanear({ data }: BarcodeScanningResult) {
    if (leido.current) return
    leido.current = true
    alLeer(data)
  }

  return (
    <CameraView
      style={StyleSheet.absoluteFill}
      facing="back"
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      onBarcodeScanned={alEscanear}
    />
  )
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
})
