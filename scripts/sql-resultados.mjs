// Corre cada <Consulta> de la guía de MySQL contra un MySQL de verdad y guarda lo que devuelve
// en src/content/mysql/resultados.json. La guía muestra esos resultados debajo de cada consulta.
//
// Uso:  npm run sql
// Necesita un MySQL 8 corriendo. Por defecto se conecta como root sin contraseña a localhost:3306
// (lo que deja `brew install mysql`). Si no, usá variables de entorno:
//   MYSQL_USER=yo MYSQL_PASSWORD=secreto npm run sql
//
// Para cada consulta crea la base guia_sql desde cero (schema.sql + datos.sql), así una no
// afecta a la siguiente. Además la corre en SQLite (el motor del playground del navegador):
// si el resultado es el mismo, la consulta se puede probar en el navegador.
import { readFile, writeFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import initSqlJs from 'sql.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const leer = (ruta) => readFile(root + ruta, 'utf8')
const { dedent, splitStatements } = await import('../src/lib/sql.ts')

const schema = await leer('src/demos/mysql/schema.sql')
const schemaSqlite = await leer('src/demos/mysql/schema.sqlite.sql')
const datos = await leer('src/demos/mysql/datos.sql')

// 1) Juntar las consultas de los .mdx
const consultas = []
for await (const archivo of glob('src/content/mysql/**/*.mdx', { cwd: root })) {
  const texto = await leer(archivo)
  for (const m of texto.matchAll(/<Consulta\b([^>]*)>\s*```sql\n([\s\S]*?)```\s*<\/Consulta>/g)) {
    const atributos = m[1]
    consultas.push({
      archivo,
      sql: dedent(m[2]),
      esperaError: /\berror\b/.test(atributos),
      // soloMysql: el resultado coincide con SQLite solo por redondeo, y en el playground confundiría.
      soloMysql: /\bsoloMysql\b/.test(atributos),
    })
  }
}

// 2) Correrlas en MySQL
const conexion = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  multipleStatements: true, // solo para cargar schema.sql y datos.sql de una vez
  dateStrings: true, // fechas como las muestra MySQL ('2026-10-01'), no como objetos Date
  rowsAsArray: true,
  typeCast: (campo, siguiente) => (campo.type === 'JSON' ? campo.string('utf-8') : siguiente()), // JSON tal cual lo escribe MySQL
})
const [[[version]]] = await conexion.query('SELECT VERSION()')

async function correrEnMysql(sql) {
  await conexion.query('DROP DATABASE IF EXISTS guia_sql; CREATE DATABASE guia_sql; USE guia_sql;')
  await conexion.query(schema + '\n' + datos)
  const salidas = []
  for (const sentencia of splitStatements(sql)) {
    try {
      const [resultado, campos] = await conexion.query(sentencia)
      if (Array.isArray(campos?.[0])) {
        // Un CALL a un procedimiento: devuelve una tabla por cada SELECT y al final un "OK".
        resultado.forEach((filas, i) => {
          if (Array.isArray(filas)) salidas.push({ tipo: 'filas', columnas: campos[i].map((c) => c.name), filas })
        })
      } else if (Array.isArray(resultado)) {
        salidas.push({ tipo: 'filas', columnas: campos.map((c) => c.name), filas: resultado })
      } else {
        const info = resultado.info?.trim()
        salidas.push({ tipo: 'ok', afectadas: resultado.affectedRows, ...(info ? { info } : {}) })
      }
    } catch (e) {
      salidas.push({ tipo: 'error', mensaje: `ERROR ${e.errno} (${e.sqlState}): ${e.sqlMessage}` })
      break // como el cliente de MySQL: después de un error, no sigue
    }
  }
  return salidas
}

// 3) Correrlas en SQLite para saber si el playground da lo mismo
const SQL = await initSqlJs()
function correrEnSqlite(sql) {
  const db = new SQL.Database()
  try {
    db.exec(schemaSqlite + datos)
    return splitStatements(sql).flatMap((s) => db.exec(s).map((r) => r.values))
  } catch {
    return null
  } finally {
    db.close()
  }
}

const normalizar = (v) =>
  typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v) ? Number(Number(v).toFixed(4)) : typeof v === 'number' ? Number(v.toFixed(4)) : v
const firma = (tablas) => JSON.stringify(tablas.map((filas) => filas.map((f) => JSON.stringify(f.map(normalizar))).sort()))

const resultados = { version, consultas: {} }
const problemas = []
for (const { archivo, sql, esperaError, soloMysql } of consultas) {
  const salidas = await correrEnMysql(sql)
  const huboError = salidas.some((s) => s.tipo === 'error')
  if (huboError !== esperaError) {
    problemas.push(`${archivo}: ${esperaError ? 'se esperaba un error y no lo hubo' : salidas.at(-1).mensaje}\n${sql}`)
  }
  const tablasMysql = salidas.filter((s) => s.tipo === 'filas').map((s) => s.filas)
  const tablasSqlite = huboError || soloMysql ? null : correrEnSqlite(sql)
  const playground = tablasSqlite !== null && tablasMysql.length > 0 && firma(tablasMysql) === firma(tablasSqlite)
  resultados.consultas[sql] = { salidas, playground }
}
await conexion.end()

await writeFile(root + 'src/content/mysql/resultados.json', JSON.stringify(resultados, null, 1) + '\n')
const enPlayground = Object.values(resultados.consultas).filter((r) => r.playground).length
console.log(`MySQL ${version}: ${consultas.length} consultas (${enPlayground} también corren igual en SQLite)`)
if (problemas.length) {
  console.error(`\n${problemas.length} consultas no dieron lo esperado:\n\n${problemas.join('\n\n')}`)
  process.exit(1)
}
