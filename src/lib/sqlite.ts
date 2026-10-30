import type { SqlJsStatic } from 'sql.js'
import { splitStatements, type Salida } from './sql'
import schema from '../demos/mysql/schema.sqlite.sql?raw'
import datos from '../demos/mysql/datos.sql?raw'

// El playground corre SQLite compilado a WebAssembly (sql.js). Se descarga recién la
// primera vez que alguien toca "Probar", así no pesa en la carga de la guía.
let motor: Promise<SqlJsStatic> | null = null

function cargarMotor() {
  motor ??= Promise.all([import('sql.js'), import('sql.js/dist/sql-wasm-browser.wasm?url')]).then(
    ([{ default: initSqlJs }, { default: wasmUrl }]) => initSqlJs({ locateFile: () => wasmUrl }),
  )
  return motor
}

/** Corre el SQL en una base nueva con los datos de ejemplo (cada ejecución arranca de cero). */
export async function ejecutarEnSqlite(sql: string): Promise<Salida[]> {
  const SQL = await cargarMotor()
  const db = new SQL.Database()
  const salidas: Salida[] = []
  try {
    db.exec(schema + datos)
    for (const sentencia of splitStatements(sql)) {
      try {
        const tablas = db.exec(sentencia)
        if (tablas.length) {
          for (const t of tablas) {
            salidas.push({ tipo: 'filas', columnas: t.columns, filas: t.values as (string | number | null)[][] })
          }
        } else {
          salidas.push({ tipo: 'ok', afectadas: db.getRowsModified() })
        }
      } catch (e) {
        salidas.push({ tipo: 'error', mensaje: e instanceof Error ? e.message : String(e) })
        break
      }
    }
  } finally {
    db.close()
  }
  return salidas
}
