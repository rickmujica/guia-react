import { useState, type ReactNode } from 'react'
import resultadosJson from '../content/mysql/resultados.json'
import { textoDe } from '../lib/children'
import { IS_PRINT } from '../lib/print'
import { dedent, type Resultados, type Salida } from '../lib/sql'
import { ejecutarEnSqlite } from '../lib/sqlite'
import { CodeBlock, CopyButton } from './CodeBlock'

const resultados = resultadosJson as Resultados
const MAX_FILAS = 30

type ConsultaProps = {
  /** El SQL, como un bloque de código ```sql adentro del componente. */
  children: ReactNode
  /** La consulta tiene que fallar: `npm run sql` avisa si un día deja de fallar. */
  error?: boolean
  /** Sin playground aunque SQLite dé "lo mismo" (por ejemplo, solo por redondeo). Lo lee `npm run sql`. */
  soloMysql?: boolean
}

/**
 * Una consulta SQL con el resultado que dio MySQL de verdad (lo genera `npm run sql`).
 * Si SQLite da lo mismo, se puede editar y ejecutar en el navegador.
 *
 * El SQL va en un bloque de código y no en un atributo sql={`…`} porque MDX les saca
 * la sangría a las líneas de las expresiones, y el SQL se lee mejor indentado.
 */
export function Consulta({ children }: ConsultaProps) {
  const codigo = dedent(textoDe(children))
  const resultado = resultados.consultas[codigo]
  const [abierto, setAbierto] = useState(false)

  return (
    <figure className="consulta">
      <div className="demo-tabs">
        <span className="demo-tab demo-tab--active">SQL</span>
        {!IS_PRINT && resultado?.playground && (
          <button type="button" className="demo-tab consulta-probar" onClick={() => setAbierto((a) => !a)}>
            {abierto ? 'Cerrar el playground' : '▶ Probar en el navegador'}
          </button>
        )}
        {!IS_PRINT && <CopyButton text={codigo} />}
      </div>
      <CodeBlock code={codigo} language="sql" />
      {resultado ? (
        <div className="consulta-salidas">
          <p className="consulta-label">Resultado en MySQL {resultados.version.split('-')[0]}</p>
          {resultado.salidas.map((salida, i) => (
            <SalidaSql key={i} salida={salida} />
          ))}
        </div>
      ) : (
        <p className="consulta-falta">Falta el resultado de esta consulta: corré npm run sql.</p>
      )}
      {abierto && <Playground inicial={codigo} />}
    </figure>
  )
}

export function SalidaSql({ salida }: { salida: Salida }) {
  if (salida.tipo === 'error') return <pre className="consulta-error">{salida.mensaje}</pre>
  if (salida.tipo === 'ok') {
    return (
      <p className="consulta-ok">
        Query OK, {salida.afectadas} {salida.afectadas === 1 ? 'fila afectada' : 'filas afectadas'}
        {salida.info && <span className="muted"> · {salida.info}</span>}
      </p>
    )
  }
  const visibles = salida.filas.slice(0, MAX_FILAS)
  // En el PDF no hay scroll horizontal: las tablas muy anchas (como un EXPLAIN) se muestran
  // en vertical, una fila por bloque, como el \G de la consola de MySQL.
  if (IS_PRINT && salida.columnas.length > 6) return <TablaVertical columnas={salida.columnas} filas={visibles} />
  // Las columnas de números van alineadas a la derecha, con el título incluido.
  const numerica = salida.columnas.map(
    (_, j) =>
      salida.filas.some((fila) => typeof fila[j] === 'number') &&
      salida.filas.every((fila) => fila[j] === null || typeof fila[j] === 'number'),
  )
  return (
    <div className="table-wrap consulta-tabla">
      <table>
        <thead>
          <tr>
            {salida.columnas.map((c, i) => (
              <th key={i} className={numerica[i] ? 'consulta-num' : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibles.map((fila, i) => (
            <tr key={i}>
              {fila.map((valor, j) => (
                <td
                  key={j}
                  className={[numerica[j] && 'consulta-num', valor === null && 'consulta-null'].filter(Boolean).join(' ') || undefined}
                >
                  {valor === null ? 'NULL' : String(valor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="consulta-filas">
        {salida.filas.length} {salida.filas.length === 1 ? 'fila' : 'filas'}
        {salida.filas.length > MAX_FILAS && ` (se muestran ${MAX_FILAS})`}
      </p>
    </div>
  )
}

function TablaVertical({ columnas, filas }: { columnas: string[]; filas: (string | number | null)[][] }) {
  return (
    <div className="table-wrap consulta-tabla consulta-vertical">
      <table>
        {filas.map((fila, i) => (
          <tbody key={i}>
            <tr>
              <th colSpan={2}>*** fila {i + 1} ***</th>
            </tr>
            {columnas.map((columna, j) => (
              <tr key={j}>
                <th scope="row">{columna}</th>
                <td className={fila[j] === null ? 'consulta-null' : undefined}>
                  {fila[j] === null ? 'NULL' : String(fila[j])}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

/** Un editor de SQL que corre en el navegador sobre la base de ejemplo (en SQLite). */
export function Playground({ inicial = 'SELECT * FROM empresas;' }: { inicial?: string }) {
  const [sql, setSql] = useState(inicial)
  const [salidas, setSalidas] = useState<Salida[] | null>(null)
  const [corriendo, setCorriendo] = useState(false)

  if (IS_PRINT) return null

  async function ejecutar() {
    setCorriendo(true)
    try {
      setSalidas(await ejecutarEnSqlite(sql))
    } catch (e) {
      setSalidas([{ tipo: 'error', mensaje: `No se pudo cargar SQLite: ${String(e)}` }])
    } finally {
      setCorriendo(false)
    }
  }

  return (
    <div className="playground">
      <textarea
        className="playground-editor"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') ejecutar()
        }}
        rows={Math.min(14, Math.max(4, sql.split('\n').length + 1))}
        spellCheck={false}
        aria-label="SQL para ejecutar"
      />
      <div className="row">
        <button type="button" className="primary" onClick={ejecutar} disabled={corriendo}>
          {corriendo ? 'Ejecutando…' : 'Ejecutar (Ctrl + Enter)'}
        </button>
        <button type="button" onClick={() => setSql(inicial)}>
          Volver al original
        </button>
        <span className="muted playground-nota">SQLite en tu navegador · cada ejecución arranca con los datos de ejemplo</span>
      </div>
      {salidas?.map((salida, i) => <SalidaSql key={i} salida={salida} />)}
    </div>
  )
}
