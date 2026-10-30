import ConRedux from './comparacion/ConRedux'
import redux from './comparacion/ConRedux.tsx?raw'
import ConSaga from './comparacion/ConSaga'
import saga from './comparacion/ConSaga.tsx?raw'
import ConToolkit from './comparacion/ConToolkit'
import toolkit from './comparacion/ConToolkit.tsx?raw'
import ConZustand from './comparacion/ConZustand'
import zustand from './comparacion/ConZustand.tsx?raw'

// Cuenta las líneas con código (sin vacías ni comentarios) del archivo fuente real.
const lineas = (fuente: string) => fuente.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length

const versiones = [
  { nombre: 'Redux clásico', Componente: ConRedux, fuente: redux },
  { nombre: 'Redux Toolkit', Componente: ConToolkit, fuente: toolkit },
  { nombre: 'RTK + Saga', Componente: ConSaga, fuente: saga },
  { nombre: 'Zustand', Componente: ConZustand, fuente: zustand },
]

export default function Comparacion() {
  return (
    <div className="stack">
      <p className="muted">
        La misma feature cuatro veces: cargar favoritas de la API, agregar una y quitar (tocá un nombre).
      </p>
      <div className="grid-2">
        {versiones.map(({ nombre, Componente, fuente }) => (
          <section key={nombre} className="card">
            <div className="row">
              <strong style={{ flex: 1 }}>{nombre}</strong>
              <span className="pill">{lineas(fuente)} líneas</span>
            </div>
            <Componente />
          </section>
        ))}
      </div>
    </div>
  )
}
