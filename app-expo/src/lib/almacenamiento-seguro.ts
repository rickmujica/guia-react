import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import type { StateStorage } from 'zustand/middleware'

// expo-secure-store guarda en el Keychain (iOS) o el Keystore (Android): el lugar para
// tokens y secretos. En la web no existe, así que ahí cae al localStorage.
export const almacenamientoSeguro: StateStorage =
  Platform.OS === 'web'
    ? {
        getItem: (clave) => localStorage.getItem(clave),
        setItem: (clave, valor) => localStorage.setItem(clave, valor),
        removeItem: (clave) => localStorage.removeItem(clave),
      }
    : {
        getItem: (clave) => SecureStore.getItemAsync(clave),
        setItem: (clave, valor) => SecureStore.setItemAsync(clave, valor),
        removeItem: (clave) => SecureStore.deleteItemAsync(clave),
      }
