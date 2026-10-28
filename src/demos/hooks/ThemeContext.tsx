import { createContext, useContext, useState } from 'react'

type Theme = 'claro' | 'oscuro'

// 1) Crear el contexto con un valor por defecto
const ThemeContext = createContext<Theme>('claro')

const styles = {
  claro: { background: '#ffffff', color: '#23272f', border: '1px solid #d0d5dd' },
  oscuro: { background: '#23272f', color: '#f5f6f8', border: '1px solid #23272f' },
}

// 3) Leer el contexto en cualquier componente de abajo, sin recibir props
function ThemedButton({ label }: { label: string }) {
  const theme = useContext(ThemeContext)
  return <button style={styles[theme]}>{label} ({theme})</button>
}

function Toolbar() {
  // Toolbar no sabe nada del tema: no hay prop drilling
  return (
    <div className="row">
      <ThemedButton label="Guardar" />
      <ThemedButton label="Cancelar" />
    </div>
  )
}

export default function ThemeDemo() {
  const [theme, setTheme] = useState<Theme>('claro')

  return (
    // 2) Proveer el valor. En React 19: <ThemeContext value={...}> (sin .Provider)
    <ThemeContext value={theme}>
      <div className="stack">
        <label className="row">
          <input
            type="checkbox"
            checked={theme === 'oscuro'}
            onChange={(e) => setTheme(e.target.checked ? 'oscuro' : 'claro')}
          />
          Tema oscuro
        </label>
        <Toolbar />
        {/* Un provider más cercano pisa el valor para su subárbol */}
        <ThemeContext value="claro">
          <div className="card">
            <p className="muted">Este recuadro fuerza el tema claro:</p>
            <ThemedButton label="Siempre claro" />
          </div>
        </ThemeContext>
      </div>
    </ThemeContext>
  )
}
