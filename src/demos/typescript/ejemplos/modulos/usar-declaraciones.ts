import { formatear } from 'paquete-sin-tipos'
// Los archivos que importa Vite (imágenes, CSS, ?raw) ya vienen tipados por "vite/client".
import logo from '/favicon.svg'

// Gracias a declaraciones.d.ts, todo esto está tipado:
window.analytics?.track('postulacion_creada', { empresa: 'Acme' })

const api = import.meta.env.VITE_API_URL // string
// @ts-expect-error: Type 'string' is not assignable to type 'number'.
const puerto: number = import.meta.env.VITE_API_URL

const texto = formatear(3000) // string
// @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'number'.
formatear('3000')

const src: string = logo
