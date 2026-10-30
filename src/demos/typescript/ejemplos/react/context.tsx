import { createContext, use, useState, type ReactNode } from 'react'

type Sesion = {
  usuario: { nombre: string } | null
  entrar: (nombre: string) => void
  salir: () => void
}

// Patrón recomendado: el contexto arranca en null y un hook propio revisa que haya Provider.
const SesionContext = createContext<Sesion | null>(null)

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Sesion['usuario']>(null)
  const valor: Sesion = {
    usuario,
    entrar: (nombre) => setUsuario({ nombre }),
    salir: () => setUsuario(null),
  }
  return <SesionContext value={valor}>{children}</SesionContext>
}

export function useSesion() {
  const sesion = use(SesionContext) // Sesion | null
  if (!sesion) throw new Error('useSesion tiene que usarse dentro de <SesionProvider>')
  return sesion // Sesion: los componentes no tienen que revisar null
}

export function BotonSalir() {
  const { usuario, salir } = useSesion()
  return usuario && <button onClick={salir}>Salir ({usuario.nombre})</button>
}

// La alternativa con un valor por defecto "falso" compila, pero esconde el error
// de olvidarte el Provider: las funciones no hacen nada y nadie se entera.
const ContextoConDefault = createContext<Sesion>({ usuario: null, entrar: () => {}, salir: () => {} })
