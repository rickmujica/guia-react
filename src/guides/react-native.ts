import type { GuideDef, PartDef } from './types'

import Bienvenida from '../content/react-native/00-empeza-aca/bienvenida.mdx'
import ComoFunciona from '../content/react-native/00-empeza-aca/como-funciona.mdx'
import Proyecto from '../content/react-native/01-fundamentos/proyecto.mdx'
import Componentes from '../content/react-native/01-fundamentos/componentes.mdx'
import Estilos from '../content/react-native/01-fundamentos/estilos.mdx'
import Listas from '../content/react-native/01-fundamentos/listas.mdx'
import Formularios from '../content/react-native/01-fundamentos/formularios.mdx'
import Interaccion from '../content/react-native/01-fundamentos/interaccion.mdx'
import Navegacion from '../content/react-native/02-app/navegacion.mdx'
import Datos from '../content/react-native/02-app/datos.mdx'
import Almacenamiento from '../content/react-native/02-app/almacenamiento.mdx'
import Auth from '../content/react-native/02-app/auth.mdx'
import Nativo from '../content/react-native/02-app/nativo.mdx'
import Librerias from '../content/react-native/02-app/librerias.mdx'
import BuenasPracticas from '../content/react-native/03-calidad/buenas-practicas.mdx'
import Testing from '../content/react-native/03-calidad/testing.mdx'
import Eas from '../content/react-native/04-publicar/eas.mdx'
import Tiendas from '../content/react-native/04-publicar/tiendas.mdx'
import Requisitos from '../content/react-native/04-publicar/requisitos.mdx'
import Actualizaciones from '../content/react-native/04-publicar/actualizaciones.mdx'
import Chuleta from '../content/react-native/05-repaso/chuleta.mdx'

const partDefs: PartDef[] = [
  {
    id: 'empeza-aca',
    title: 'Empezá acá',
    intro: 'Qué es React Native, cómo funciona por dentro y cómo usar esta guía y su app de ejemplo.',
    chapters: [
      {
        slug: 'bienvenida',
        title: 'Cómo usar esta guía',
        summary: 'React Native en un párrafo, las demos en el celular dibujado y la app de ejemplo para tu teléfono.',
        Content: Bienvenida,
      },
      {
        slug: 'como-funciona',
        title: 'Cómo funciona React Native',
        summary: 'Componentes nativos, la Nueva Arquitectura, Hermes, y por qué Expo.',
        Content: ComoFunciona,
      },
    ],
  },
  {
    id: 'fundamentos',
    title: 'Parte 1 · Fundamentos',
    intro: 'Crear el proyecto y los bloques de toda pantalla: componentes, estilos, listas, formularios y animaciones.',
    chapters: [
      {
        slug: 'proyecto',
        title: 'Crear un proyecto con Expo',
        summary: 'create-expo-app, la estructura, Expo Go o development build, y los comandos del día a día.',
        Content: Proyecto,
      },
      {
        slug: 'componentes',
        title: 'Los componentes básicos',
        summary: 'View, Text, Image, ScrollView, Pressable, TextInput, Modal y compañía, con su equivalente web.',
        Content: Componentes,
      },
      {
        slug: 'estilos',
        title: 'Estilos y layout',
        summary: 'StyleSheet, flexbox con otros valores por defecto, tamaños, plataformas, modo oscuro y librerías de estilos.',
        Content: Estilos,
      },
      {
        slug: 'listas',
        title: 'Listas',
        summary: 'FlatList, SectionList, FlashList y Legend List: renderizar miles de filas sin trabarse.',
        Content: Listas,
      },
      {
        slug: 'formularios',
        title: 'Formularios y teclado',
        summary: 'TextInput a fondo, el teclado que tapa todo, y react-hook-form con Zod.',
        Content: Formularios,
      },
      {
        slug: 'interaccion',
        title: 'Toques, gestos y animaciones',
        summary: 'Pressable, háptica, Animated, Reanimated 4 y Gesture Handler.',
        Content: Interaccion,
      },
    ],
  },
  {
    id: 'app',
    title: 'Parte 2 · Una app de verdad',
    intro: 'Lo que tiene cualquier app: navegación, datos del servidor, estado guardado, login y funciones del teléfono.',
    chapters: [
      {
        slug: 'navegacion',
        title: 'Navegación con Expo Router',
        summary: 'Rutas como archivos, Stack, pestañas nativas, parámetros, modales, rutas protegidas y deep links.',
        Content: Navegacion,
      },
      {
        slug: 'datos',
        title: 'Datos del servidor',
        summary: 'fetch, TanStack Query, paginación infinita, variables de entorno y modo offline.',
        Content: Datos,
      },
      {
        slug: 'almacenamiento',
        title: 'Estado y almacenamiento',
        summary: 'Zustand con persistencia, AsyncStorage, MMKV, SecureStore y SQLite: qué va en cada lado.',
        Content: Almacenamiento,
      },
      {
        slug: 'auth',
        title: 'Login y sesión',
        summary: 'El flujo de sesión con rutas protegidas, OAuth, Sign in with Apple, biometría y proveedores.',
        Content: Auth,
      },
      {
        slug: 'nativo',
        title: 'Cámara, notificaciones y más',
        summary: 'Permisos, cámara y fotos, ubicación, notificaciones push, archivos, compartir y config plugins.',
        Content: Nativo,
      },
      {
        slug: 'librerias',
        title: 'Las librerías más usadas',
        summary: 'Una tabla por necesidad: qué se usa hoy, si es de Expo, y si anda en Expo Go.',
        Content: Librerias,
      },
    ],
  },
  {
    id: 'calidad',
    title: 'Parte 3 · Calidad',
    intro: 'Que la app ande bien en teléfonos de verdad: rendimiento, accesibilidad, tests y depuración.',
    chapters: [
      {
        slug: 'buenas-practicas',
        title: 'Buenas prácticas y rendimiento',
        summary: 'Estructura del proyecto, el React Compiler, hilos, imágenes, accesibilidad y errores comunes.',
        Content: BuenasPracticas,
      },
      {
        slug: 'testing',
        title: 'Tests y depuración',
        summary: 'Jest con jest-expo, Testing Library, tests de navegación, E2E con Maestro y React Native DevTools.',
        Content: Testing,
      },
    ],
  },
  {
    id: 'publicar',
    title: 'Parte 4 · Publicar',
    intro: 'De tu computadora a las tiendas: builds en la nube, envío, revisión y actualizaciones.',
    chapters: [
      {
        slug: 'eas',
        title: 'Builds con EAS',
        summary: 'eas.json, perfiles, credenciales, versiones y development builds.',
        Content: Eas,
      },
      {
        slug: 'tiendas',
        title: 'Subir a App Store y Google Play',
        summary: 'Cuentas, TestFlight, pistas de prueba de Google, envío con EAS Submit y la revisión.',
        Content: Tiendas,
      },
      {
        slug: 'requisitos',
        title: 'Lo que piden las tiendas',
        summary: 'La lista de requisitos de Apple y Google en 2026, y los motivos de rechazo más comunes.',
        Content: Requisitos,
      },
      {
        slug: 'actualizaciones',
        title: 'Actualizaciones OTA y CI/CD',
        summary: 'EAS Update, runtime version, qué se puede actualizar sin pasar por la tienda, y EAS Workflows.',
        Content: Actualizaciones,
      },
    ],
  },
  {
    id: 'repaso',
    title: 'Parte 5 · Repaso',
    intro: 'Todo junto para repasar antes de una entrevista.',
    chapters: [
      {
        slug: 'chuleta',
        title: 'Chuleta y preguntas de entrevista',
        summary: 'React Native y Expo en una página, y las preguntas que más se repiten.',
        Content: Chuleta,
      },
    ],
  },
]

export const reactNativeGuide: GuideDef = {
  id: 'react-native',
  title: 'React Native con Expo',
  description:
    'Apps para iOS y Android con React: componentes, estilos, listas, navegación con Expo Router, datos, librerías, y cómo publicar en App Store y Google Play.',
  badge: 'Expo SDK 58 · RN 0.88',
  icon: 'RN',
  color: '#4630eb',
  pdf: 'guia-react-native.pdf',
  parts: partDefs,
}
