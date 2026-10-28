import type { ReactNode } from 'react'

// Un componente es una función que recibe props y devuelve JSX.
type BadgeProps = {
  label: string
  tone?: 'neutral' | 'success'
}

function Badge({ label, tone = 'neutral' }: BadgeProps) {
  // Valor por defecto con destructuring: reemplaza a defaultProps.
  return <span className={`pill ${tone === 'success' ? 'ok-text' : ''}`}>{label}</span>
}

type ProfileCardProps = {
  name: string
  role: string
  openToWork?: boolean
  children?: ReactNode // lo que va entre <ProfileCard> y </ProfileCard>
}

function ProfileCard({ name, role, openToWork = false, children }: ProfileCardProps) {
  return (
    <article className="card">
      <h3 style={{ margin: 0 }}>{name}</h3>
      <p className="muted">{role}</p>
      {/* Render condicional con && */}
      {openToWork && <Badge label="Open to work" tone="success" />}
      {children}
    </article>
  )
}

export default function ProfileCardDemo() {
  return (
    <div className="grid-2">
      <ProfileCard name="Ana Rojas" role="Frontend Engineer · React" openToWork>
        <p>Asunción · 100% remoto</p>
      </ProfileCard>
      <ProfileCard name="Bruno Díaz" role="Full Stack Engineer" />
    </div>
  )
}
