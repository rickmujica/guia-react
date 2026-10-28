import { Component, Suspense, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

// Red de seguridad: si una demo explota, no se cae toda la guía.
export class DemoBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="demo-crash">
          <strong>La demo lanzó un error:</strong> {this.state.error.message}
          <div>
            <button type="button" onClick={() => this.setState({ error: null })}>
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return <Suspense fallback={<p className="muted">Cargando demo…</p>}>{this.props.children}</Suspense>
  }
}
