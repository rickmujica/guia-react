import { createContext, useContext, useState, type ReactNode } from 'react'

type User = { name: string; role: 'candidato' | 'recruiter' }
type AuthContextValue = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

// null por defecto: así detectamos si alguien lo usa fuera del provider
const AuthContext = createContext<AuthContextValue | null>(null)

// Patrón habitual: un componente Provider que encapsula el estado...
// (en una app real, AuthProvider y useAuth viven en su propio archivo y se exportan)
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const value = { user, login: setUser, logout: () => setUser(null) }
  return <AuthContext value={value}>{children}</AuthContext>
}

// ...y un custom hook que lo consume y valida que haya provider.
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
  return context
}

function UserMenu() {
  const { user, login, logout } = useAuth()
  if (!user) {
    return <button onClick={() => login({ name: 'Ana', role: 'candidato' })}>Iniciar sesión</button>
  }
  return (
    <div className="row">
      <span>
        Hola, <strong>{user.name}</strong> ({user.role})
      </span>
      <button onClick={logout}>Salir</button>
    </div>
  )
}

export default function AuthDemo() {
  return (
    <AuthProvider>
      <UserMenu />
    </AuthProvider>
  )
}
