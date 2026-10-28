import { Children, isValidElement, type ReactNode } from 'react'

type CalloutProps = { title?: string; children: ReactNode }

function Callout({ kind, icon, title, children }: CalloutProps & { kind: string; icon: string }) {
  return (
    <aside className={`callout callout--${kind}`}>
      <p className="callout-title">
        <span aria-hidden="true">{icon}</span> {title}
      </p>
      {children}
    </aside>
  )
}

export const Nota = ({ title = 'Nota', children }: CalloutProps) => (
  <Callout kind="note" icon="ℹ️" title={title}>{children}</Callout>
)
export const Ojo = ({ title = 'Ojo', children }: CalloutProps) => (
  <Callout kind="warn" icon="⚠️" title={title}>{children}</Callout>
)
export const Tip = ({ title = 'Tip', children }: CalloutProps) => (
  <Callout kind="tip" icon="💡" title={title}>{children}</Callout>
)
export const Probalo = ({ title = 'Probá esto', children }: CalloutProps) => (
  <Callout kind="try" icon="🧪" title={title}>{children}</Callout>
)
export const Entrevista = ({ title = 'En una entrevista', children }: CalloutProps) => (
  <Callout kind="interview" icon="🎤" title={title}>{children}</Callout>
)

/** Dos bloques de código lado a lado: cómo se hacía antes y cómo se hace ahora. */
export function AntesAhora({
  children,
  antes = 'Antes',
  ahora = 'Ahora',
}: {
  children: ReactNode
  antes?: string
  ahora?: string
}) {
  const [before, after] = Children.toArray(children).filter(isValidElement)
  return (
    <div className="compare">
      <div className="compare-col">
        <span className="compare-label compare-label--before">✗ {antes}</span>
        {before}
      </div>
      <div className="compare-col">
        <span className="compare-label compare-label--after">✓ {ahora}</span>
        {after}
      </div>
    </div>
  )
}

export function Version({ v }: { v: string }) {
  return <span className="version-badge">React {v}</span>
}
