import type { PropsWithChildren, ReactElement, ReactNode } from 'react'

// ReactNode: lo más amplio. JSX, strings, números, null, arrays… Es el tipo para children.
function Panel({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

// PropsWithChildren<P> agrega children?: ReactNode a tus props.
type CardProps = PropsWithChildren<{ destacada?: boolean }>
function Card({ destacada, children }: CardProps) {
  return <div className={destacada ? 'card card--destacada' : 'card'}>{children}</div>
}

// ReactElement: solo un elemento JSX (no strings ni null). Útil si vas a clonarlo o leer sus props.
function Icono({ icono }: { icono: ReactElement }) {
  return <span className="icono">{icono}</span>
}

// Render prop: children como función.
function ConMouse({ children }: { children: (x: number, y: number) => ReactNode }) {
  return <div>{children(10, 20)}</div>
}

export function Uso() {
  return (
    <Panel titulo="Ofertas">
      <Card destacada>Texto o JSX</Card>
      <Icono icono={<svg />} />
      {/* @ts-expect-error: un string no es un ReactElement. */}
      <Icono icono="⭐" />
      <ConMouse>{(x, y) => `${x}, ${y}`}</ConMouse>
    </Panel>
  )
}
