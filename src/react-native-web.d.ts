// react-native-web no trae tipos. La guía solo lo usa para renderizar las demos de
// app-expo (que se chequean con los tipos de React Native adentro de esa app).
declare module 'react-native-web' {
  import type { ComponentType } from 'react'
  export const View: ComponentType<Record<string, unknown>>
  export const StyleSheet: { absoluteFill: object }
}
