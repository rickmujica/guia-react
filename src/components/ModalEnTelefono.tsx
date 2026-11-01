import { use, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { View } from 'react-native-web'
import { PantallaTelefono } from '../lib/pantallaTelefono'

type ModalProps = {
  visible?: boolean
  transparent?: boolean
  animationType?: 'none' | 'fade' | 'slide'
  onRequestClose?: () => void
  children?: ReactNode
}

/** El Modal de React Native para las demos en el navegador: ocupa solo la pantalla del celular. */
export function Modal({ visible = true, transparent = false, animationType = 'none', children }: ModalProps) {
  const pantalla = use(PantallaTelefono)
  if (!visible || !pantalla) return null
  return createPortal(
    <div className={`telefono-modal telefono-modal--${animationType}`}>
      <View style={{ flex: 1, backgroundColor: transparent ? 'transparent' : '#fff' }}>{children}</View>
    </div>,
    pantalla,
  )
}
