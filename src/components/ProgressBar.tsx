import type { CSSProperties } from 'react'

export function ProgressBar({ done, total, color }: { done: number; total: number; color: string }) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="progress" style={{ '--guide-color': color } as CSSProperties}>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Capítulos leídos"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-text">
        {done} de {total} leídos
      </span>
    </div>
  )
}
