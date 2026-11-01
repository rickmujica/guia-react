import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// Vite importa todos los archivos de src/demos dos veces:
// 1) como módulos (para renderizar la demo en vivo)
// 2) como texto plano con ?raw (para mostrar el código fuente real)
// Así el snippet que ves en la guía ES el archivo del proyecto.
// SalaryChart queda afuera: LazyDemo lo carga con lazy(), y si lo importáramos acá
// también, Vite no podría separarlo en su propio archivo (chunk). Los ejemplos de la guía
// de TypeScript tampoco: son snippets para leer, no demos.
const demoModules = import.meta.glob<{ default: ComponentType }>(
  ['../demos/**/*.tsx', '!../demos/hooks/SalaryChart.tsx', '!../demos/typescript/ejemplos/**'],
  { eager: true },
)
// Las demos de React Native son las de la app de Expo (app-expo/src/demos): se cargan recién
// cuando se abre un capítulo que las usa, así react-native-web no pesa en las otras guías.
const nativeDemoLoaders = import.meta.glob<{ default: ComponentType }>([
  '../../app-expo/src/demos/**/*.tsx',
  '!../../app-expo/src/demos/**/__tests__/**',
])
const nativeDemos = new Map<string, LazyExoticComponent<ComponentType>>()

const rawFiles = import.meta.glob<string>(
  [
    '../demos/**/*.{ts,tsx,css,sql}',
    '../main.tsx',
    '../App.tsx',
    '../../vite.config.ts',
    '../../app-expo/src/**/*.{ts,tsx}',
    '../../app-expo/{app,eas,package}.json',
  ],
  { eager: true, query: '?raw', import: 'default' },
)

function toKey(path: string) {
  // 'src/demos/x.tsx' -> '../demos/x.tsx' ; 'vite.config.ts' -> '../../vite.config.ts'
  return path.startsWith('src/') ? `../${path.slice(4)}` : `../../${path}`
}

export function getDemoComponent(file: string) {
  return demoModules[`../demos/${file}.tsx`]?.default
}

/** Una demo de app-expo/src/demos, cargada con lazy(): hay que renderizarla adentro de Suspense. */
export function getNativeDemo(file: string) {
  const loader = nativeDemoLoaders[`../../app-expo/src/demos/${file}.tsx`]
  if (!loader) return undefined
  if (!nativeDemos.has(file)) nativeDemos.set(file, lazy(loader))
  return nativeDemos.get(file)
}

export function getSource(path: string): string {
  const source = rawFiles[toKey(path)]
  if (source === undefined) throw new Error(`No encontré el archivo ${path}`)
  return source
}

export function languageOf(path: string) {
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.sql')) return 'sql'
  if (path.endsWith('.json')) return 'json'
  return 'tsx'
}
