import { useState, type ReactNode } from 'react'
import salidasJson from '../content/node/salidas.json'
import { textoDe } from '../lib/children'
import { IS_PRINT } from '../lib/print'
import { claveApi, claveScript, type Pedido, type Respuesta, type Salidas } from '../lib/salidas'
import { getSource } from '../lib/sources'
import { CodeBlock, CopyButton } from './CodeBlock'

const salidas = salidasJson as unknown as Salidas // el JSON es demasiado concreto para TypeScript
const version = `Node ${salidas.node.replace(/^v/, '')}`

/** Los archivos del ejemplo en pestañas (en el PDF, uno abajo del otro). */
function Archivos({ archivos }: { archivos: string[] }) {
  const [activo, setActivo] = useState(0)
  const ruta = (archivo: string) => `src/demos/${archivo}`

  if (IS_PRINT) {
    return archivos.map((archivo) => (
      <div key={archivo}>
        <div className="demo-tabs">
          <span className="demo-tab demo-tab--active">{ruta(archivo)}</span>
        </div>
        <CodeBlock code={getSource(ruta(archivo))} language="ts" />
      </div>
    ))
  }
  return (
    <>
      <div className="demo-tabs" role="tablist">
        {archivos.map((archivo, i) => (
          <button
            key={archivo}
            type="button"
            role="tab"
            aria-selected={i === activo}
            className={`demo-tab${i === activo ? ' demo-tab--active' : ''}`}
            onClick={() => setActivo(i)}
          >
            {i === 0 ? ruta(archivo) : archivo.split('/').pop()}
          </button>
        ))}
        <CopyButton text={getSource(ruta(archivos[activo]))} />
      </div>
      <CodeBlock code={getSource(ruta(archivos[activo]))} language="ts" />
    </>
  )
}

type SalidaProps = {
  /** Ruta dentro de src/demos. Ej: "node/01-node/orden.ts" */
  archivo: string
  /** Argumentos para el script, separados por espacios. */
  args?: string
  /** Opciones de node antes del archivo. Ej: "--env-file=.env.ejemplo" */
  flags?: string
  /** Más archivos para mostrar en pestañas (los que importa el ejemplo). */
  extra?: string[]
  /** El script tiene que terminar con error: `npm run salidas` avisa si no. */
  error?: boolean
}

/**
 * Un script de Node con lo que imprimió al ejecutarlo de verdad (lo genera `npm run salidas`).
 */
export function Salida({ archivo, args = '', flags = '', extra = [] }: SalidaProps) {
  const salida = salidas.scripts[claveScript(archivo, args, flags)]
  const comando = ['node', flags, archivo.split('/').pop(), args].filter(Boolean).join(' ')

  return (
    <figure className="consulta salida">
      <Archivos archivos={[archivo, ...extra]} />
      <div className="consulta-salidas">
        <p className="consulta-label">
          <code className="salida-comando">$ {comando}</code> <span className="salida-version">· {version}</span>
        </p>
        {salida ? (
          <>
            {salida.stdout && <pre className="salida-terminal">{recortar(salida.stdout)}</pre>}
            {salida.stderr && <pre className="consulta-error">{recortar(salida.stderr)}</pre>}
            {salida.codigo !== 0 && <p className="salida-codigo">El proceso terminó con código {salida.codigo}</p>}
            {!salida.stdout && !salida.stderr && <p className="salida-vacia">(no imprimió nada)</p>}
          </>
        ) : (
          <p className="consulta-falta">Falta la salida de este ejemplo: corré npm run salidas.</p>
        )}
      </div>
    </figure>
  )
}

type ApiProps = {
  archivo: string
  extra?: string[]
  /** Los pedidos, en un bloque ```http: uno por línea. */
  children: ReactNode
  /** Headers de la respuesta que vale la pena mostrar, separados por coma. */
  headers?: string
}

/**
 * Una app de Express y los pedidos HTTP que se le hicieron, con lo que respondió de verdad
 * (lo genera `npm run salidas`).
 */
export function Api({ archivo, extra = [], children, headers = '' }: ApiProps) {
  const texto = textoDe(children)
  const intercambios = salidas.apis[claveApi(archivo, texto)]
  const mostrar = headers.split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)

  return (
    <figure className="consulta salida">
      <Archivos archivos={[archivo, ...extra]} />
      <div className="consulta-salidas">
        <p className="consulta-label">
          Pedidos a la app <span className="salida-version">· {version} · Express {salidas.express}</span>
        </p>
        {intercambios ? (
          intercambios.map(({ pedido, respuesta }, i) => (
            <Intercambio key={i} pedido={pedido} respuesta={respuesta} mostrar={mostrar} />
          ))
        ) : (
          <p className="consulta-falta">Faltan las respuestas de este ejemplo: corré npm run salidas.</p>
        )}
      </div>
    </figure>
  )
}

function Intercambio({ pedido, respuesta, mostrar }: { pedido: Pedido; respuesta: Respuesta; mostrar: string[] }) {
  const enviados = Object.entries(pedido.headers).filter(([nombre]) => nombre !== 'content-type')
  const recibidos = mostrar.flatMap((nombre) =>
    respuesta.headers[nombre] === undefined ? [] : [[nombre, respuesta.headers[nombre]] as const],
  )
  return (
    <div className="api-intercambio">
      <p className="api-pedido">
        <span className={`api-metodo api-metodo--${pedido.metodo.toLowerCase()}`}>{pedido.metodo}</span>{' '}
        <span className="api-ruta">{pedido.ruta}</span>
        {enviados.map(([nombre, valor]) => (
          <span key={nombre} className="api-header-enviado">
            {' '}
            {nombre}: {valor}
          </span>
        ))}
      </p>
      {pedido.body && <pre className="api-body api-body--pedido">{bonito(pedido.body)}</pre>}
      <p className={`api-status api-status--${String(respuesta.status)[0]}xx`}>
        ← {respuesta.status} {respuesta.statusText}
      </p>
      {recibidos.length > 0 && (
        <pre className="api-headers">{recibidos.map(([nombre, valor]) => `${nombre}: ${valor}`).join('\n')}</pre>
      )}
      {respuesta.body && <pre className="api-body">{bonito(respuesta.body)}</pre>}
      {respuesta.consola && (
        <pre className="api-consola" title="Lo que la app imprimió en la consola">
          {respuesta.consola.trimEnd()}
        </pre>
      )}
    </div>
  )
}

// Sin líneas vacías al principio ni al final (Node empieza los errores con una).
const recortar = (texto: string) => texto.replace(/^\n+/, '').trimEnd()

// El JSON con sangría, que se lee mejor. Lo que no es JSON queda como vino.
function bonito(texto: string) {
  try {
    return JSON.stringify(JSON.parse(texto), null, 2)
  } catch {
    return texto
  }
}
