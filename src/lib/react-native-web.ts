// En el navegador, 'react-native' apunta a este archivo (ver vite.config.ts): es
// react-native-web entero, salvo Modal, que se abre adentro del celular dibujado
// en lugar de tapar toda la página.
export * from 'react-native-web'
export { Modal } from '../components/ModalEnTelefono'
