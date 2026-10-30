import type { ComponentType } from 'react'

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
const rawFiles = import.meta.glob<string>(
  ['../demos/**/*.{ts,tsx,css,sql}', '../main.tsx', '../App.tsx', '../../vite.config.ts'],
  { eager: true, query: '?raw', import: 'default' },
)

function toKey(path: string) {
  // 'src/demos/x.tsx' -> '../demos/x.tsx' ; 'vite.config.ts' -> '../../vite.config.ts'
  return path.startsWith('src/') ? `../${path.slice(4)}` : `../../${path}`
}

export function getDemoComponent(file: string) {
  return demoModules[`../demos/${file}.tsx`]?.default
}

export function getSource(path: string): string {
  const source = rawFiles[toKey(path)]
  if (source === undefined) throw new Error(`No encontré el archivo ${path}`)
  return source
}

export function languageOf(path: string) {
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.sql')) return 'sql'
  return 'tsx'
}
