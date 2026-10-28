import { lazy, Suspense, useState } from 'react'
import { sleep } from '../shared/utils'

// lazy recibe una función que devuelve un import() dinámico.
// Le sumamos 1,5 s de espera para simular una red lenta.
const SalaryChart = lazy(() => sleep(1500).then(() => import('./SalaryChart')))

export default function LazyDemo() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div className="stack">
      <button onClick={() => setShowChart(true)} disabled={showChart}>
        Ver gráfico de salarios
      </button>
      {showChart && (
        // Mientras el código del componente se descarga, se muestra el fallback
        <Suspense fallback={<p className="muted">⏳ Descargando el componente…</p>}>
          <SalaryChart />
        </Suspense>
      )}
    </div>
  )
}
