import { useState, type ReactNode } from 'react'

type PanelProps = {
  title: string
  isActive: boolean
  onShow: () => void
  children: ReactNode
}

// Panel no tiene estado propio: lo controla el padre a través de props.
function Panel({ title, isActive, onShow, children }: PanelProps) {
  return (
    <section className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>{title}</strong>
        {!isActive && <button onClick={onShow}>Ver</button>}
      </div>
      {isActive && <div style={{ marginTop: 8 }}>{children}</div>}
    </section>
  )
}

export default function Accordion() {
  // El estado "subió" al padre común: así solo un panel puede estar abierto.
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="stack">
      <Panel title="¿Qué es el estado?" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        Datos que cambian con el tiempo y que, al cambiar, hacen que React vuelva a renderizar.
      </Panel>
      <Panel title="¿Qué son las props?" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        Los argumentos que un componente padre le pasa a un hijo. Son de solo lectura.
      </Panel>
      <Panel title="¿Dónde va el estado?" isActive={activeIndex === 2} onShow={() => setActiveIndex(2)}>
        En el componente padre común más cercano de todos los que lo necesitan.
      </Panel>
    </div>
  )
}
