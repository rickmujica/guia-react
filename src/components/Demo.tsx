import { createElement, useState } from 'react'
import { IS_PRINT } from '../lib/print'
import { getDemoComponent, getSource, languageOf } from '../lib/sources'
import { CodeBlock, CopyButton } from './CodeBlock'
import { DemoBoundary } from './DemoBoundary'

type DemoProps = {
  /** Ruta dentro de src/demos, sin extensión. Ej: "fundamentos/Counter" */
  file: string
  /** Archivos extra para mostrar en pestañas. Ej: ["react19/actions.ts"] */
  extra?: string[]
  title?: string
  /** Líneas a resaltar del archivo principal. Ej: "4-9,12" */
  highlight?: string
}

export function Demo({ file, extra = [], title, highlight }: DemoProps) {
  const Component = getDemoComponent(file)
  if (!Component) throw new Error(`No existe la demo src/demos/${file}.tsx`)
  const paths = [`src/demos/${file}.tsx`, ...extra.map((e) => `src/demos/${e}`)]
  const [active, setActive] = useState(0)
  const [runId, setRunId] = useState(0)

  return (
    <figure className="demo">
      <figcaption className="demo-header">
        <span className="demo-badge">{IS_PRINT ? 'Demo' : 'Demo en vivo'}</span>
        <span className="demo-title">{title}</span>
        {!IS_PRINT && (
          <button type="button" className="demo-reset" onClick={() => setRunId((n) => n + 1)}>
            ↺ Reiniciar
          </button>
        )}
      </figcaption>

      {IS_PRINT ? (
        <p className="demo-print-note">
          ▶ Demo interactiva: corré <code>npm run dev</code> y abrí este capítulo para probarla.
        </p>
      ) : (
        <div className="demo-preview">
          <DemoBoundary key={runId}>{createElement(Component)}</DemoBoundary>
        </div>
      )}

      {IS_PRINT ? (
        paths.map((path, i) => (
          <div key={path} className="demo-code">
            <div className="demo-tabs">
              <span className="demo-tab demo-tab--active">{path}</span>
            </div>
            <CodeBlock
              code={getSource(path)}
              language={languageOf(path)}
              highlight={i === 0 ? highlight : undefined}
            />
          </div>
        ))
      ) : (
        <div className="demo-code">
          <div className="demo-tabs" role="tablist">
            {paths.map((path, i) => (
              <button
                key={path}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`demo-tab${i === active ? ' demo-tab--active' : ''}`}
                onClick={() => setActive(i)}
              >
                {i === 0 ? path : path.split('/').pop()}
              </button>
            ))}
            <CopyButton text={getSource(paths[active])} />
          </div>
          <CodeBlock
            code={getSource(paths[active])}
            language={languageOf(paths[active])}
            highlight={active === 0 ? highlight : undefined}
          />
        </div>
      )}
    </figure>
  )
}

/** Muestra un archivo del proyecto que no es una demo (main.tsx, App.tsx, vite.config.ts). */
export function Source({ path, highlight }: { path: string; highlight?: string }) {
  const code = getSource(path)
  return (
    <figure className="demo demo--source">
      <div className="demo-code">
        <div className="demo-tabs">
          <span className="demo-tab demo-tab--active">{path}</span>
          {!IS_PRINT && <CopyButton text={code} />}
        </div>
        <CodeBlock code={code} language={languageOf(path)} highlight={highlight} />
      </div>
    </figure>
  )
}
