import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  fallback: (error: Error, reset: () => void) => ReactNode
  children: ReactNode
}
type State = { error: Error | null }

/**
 * Los Error Boundaries siguen siendo el único caso donde necesitás una clase
 * (o una librería como react-error-boundary, que la trae hecha).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  // 1) Durante el render: actualiza el estado para mostrar el fallback.
  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  // 2) Después del commit: ideal para loguear el error.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.info('Error atrapado:', error.message, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) return this.props.fallback(this.state.error, this.reset)
    return this.props.children
  }
}
