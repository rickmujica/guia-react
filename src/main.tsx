import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/global.css'
import App from './App.tsx'

// React 19: createRoot acepta callbacks para centralizar el reporte de errores.
// En una app real, acá mandarías los errores a Sentry, Datadog, etc.
createRoot(document.getElementById('root')!, {
  // Errores que atrapó un Error Boundary (la UI muestra su fallback).
  onCaughtError(error, errorInfo) {
    console.warn('[Error atrapado por un Error Boundary]', error, errorInfo.componentStack)
  },
  // Errores que ningún Error Boundary atrapó: React desmonta toda la app.
  onUncaughtError(error, errorInfo) {
    console.error('[Error no atrapado]', error, errorInfo.componentStack)
  },
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
