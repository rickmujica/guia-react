// Un archivo .d.ts solo tiene tipos: describe código que existe en otro lado.
// Este no tiene import ni export, así que todo lo que declara es global.
// (En un archivo con import/export, lo global va adentro de `declare global { ... }`.)

// Algo que agrega un script externo a window (por ejemplo, un widget de analytics).
// Las interfaces se fusionan: esto se suma a la interface Window que trae TypeScript.
interface Window {
  analytics?: { track: (evento: string, datos?: Record<string, unknown>) => void }
}

// Tipar las variables de entorno de Vite (import.meta.env.VITE_*).
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

// Un paquete de npm que no trae tipos (y no hay @types/ para él).
declare module 'paquete-sin-tipos' {
  export function formatear(valor: number): string
}
