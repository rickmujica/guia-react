import * as Location from 'expo-location'
import { useState } from 'react'
import { Button, Linking, Text, View } from 'react-native'

export function CiudadActual() {
  // El hook trae el estado del permiso y la función para pedirlo
  const [permiso, pedirPermiso] = Location.useForegroundPermissions()
  const [ciudad, setCiudad] = useState<string | null>(null)

  async function buscar() {
    let respuesta = permiso
    if (!respuesta?.granted) respuesta = await pedirPermiso()
    if (!respuesta.granted) return

    // Balanced alcanza para saber la ciudad y gasta menos batería que High
    const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
    const [direccion] = await Location.reverseGeocodeAsync(coords)
    setCiudad(direccion?.city ?? direccion?.region ?? 'Desconocida')
  }

  // Si dijo "no" y ya no se puede volver a preguntar, solo queda mandarlo a Ajustes
  if (permiso && !permiso.granted && !permiso.canAskAgain) {
    return (
      <View style={{ padding: 16, gap: 8 }}>
        <Text>Activá la ubicación en Ajustes para ver ofertas cerca tuyo.</Text>
        <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      </View>
    )
  }

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Button title="Usar mi ubicación" onPress={buscar} />
      {ciudad && <Text>Estás en {ciudad}</Text>}
    </View>
  )
}
