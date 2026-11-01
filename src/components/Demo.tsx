import { createElement, Suspense, useState, type ReactNode } from 'react'
import { IS_PRINT } from '../lib/print'
import { getDemoComponent, getNativeDemo, getSource, languageOf } from '../lib/sources'
import { CodeBlock, CopyButton } from './CodeBlock'
import { DemoBoundary } from './DemoBoundary'
import { PantallaTelefono } from '../lib/pantallaTelefono'

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
  const [runId, setRunId] = useState(0)

  return (
    <figure className="demo">
      <DemoHeader title={title} onReset={() => setRunId((n) => n + 1)} />
      {IS_PRINT ? (
        <p className="demo-print-note">
          ▶ Demo interactiva: corré <code>npm run dev</code> y abrí este capítulo para probarla.
        </p>
      ) : (
        <div className="demo-preview">
          <DemoBoundary key={runId}>{createElement(Component)}</DemoBoundary>
        </div>
      )}
      <PanelCodigo paths={paths} highlight={highlight} />
    </figure>
  )
}

/**
 * Una demo de React Native: el componente de app-expo/src/demos corriendo con react-native-web
 * adentro de un celular dibujado, y debajo su código. En la app de Expo corre de verdad.
 */
export function DemoNativa({ file, extra = [], title, highlight }: DemoProps) {
  const Component = getNativeDemo(file)
  if (!Component) throw new Error(`No existe la demo app-expo/src/demos/${file}.tsx`)
  const paths = [`app-expo/src/demos/${file}.tsx`, ...extra.map((e) => `app-expo/src/${e}`)]
  const [runId, setRunId] = useState(0)

  return (
    <figure className="demo demo--nativa">
      <DemoHeader title={title} onReset={() => setRunId((n) => n + 1)} />
      <div className="demo-telefono">
        <Telefono>
          <DemoBoundary key={runId}>
            <Suspense fallback={<p className="telefono-cargando">Cargando…</p>}>{createElement(Component)}</Suspense>
          </DemoBoundary>
        </Telefono>
      </div>
      <PanelCodigo paths={paths} highlight={highlight} />
    </figure>
  )
}

function DemoHeader({ title, onReset }: { title?: string; onReset: () => void }) {
  return (
    <figcaption className="demo-header">
      <span className="demo-badge">{IS_PRINT ? 'Demo' : 'Demo en vivo'}</span>
      <span className="demo-title">{title}</span>
      {!IS_PRINT && (
        <button type="button" className="demo-reset" onClick={onReset}>
          ↺ Reiniciar
        </button>
      )}
    </figcaption>
  )
}

/** Un celular dibujado: barra de estado y una pantalla donde la demo ocupa todo el alto. */
function Telefono({ children }: { children: ReactNode }) {
  const [pantalla, setPantalla] = useState<HTMLDivElement | null>(null)
  return (
    <div className="telefono">
      <div className="telefono-barra" aria-hidden="true">
        <span>9:41</span>
        <span className="telefono-isla" />
        <span className="telefono-iconos">▂▄▆ ▮</span>
      </div>
      <div className="telefono-pantalla" ref={setPantalla}>
        <PantallaTelefono value={pantalla}>{children}</PantallaTelefono>
      </div>
    </div>
  )
}

/** El código de la demo: pestañas en pantalla, todos los archivos uno debajo del otro al imprimir. */
function PanelCodigo({ paths, highlight }: { paths: string[]; highlight?: string }) {
  const [active, setActive] = useState(0)

  if (IS_PRINT) {
    return paths.map((path, i) => (
      <div key={path} className="demo-code">
        <div className="demo-tabs">
          <span className="demo-tab demo-tab--active">{path}</span>
        </div>
        <CodeBlock code={getSource(path)} language={languageOf(path)} highlight={i === 0 ? highlight : undefined} />
      </div>
    ))
  }

  return (
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
  )
}

/** Muestra un archivo del proyecto que no es una demo (main.tsx, App.tsx, vite.config.ts, app-expo/…). */
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
