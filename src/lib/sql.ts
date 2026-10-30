// Utilidades compartidas entre el componente <Consulta> y scripts/sql-resultados.mjs.

/** Saca la sangría común y las líneas vacías de los bordes: así se escribe el SQL en el MDX. */
export function dedent(text: string) {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n')
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length))
  return lines.map((l) => l.slice(indent)).join('\n')
}

/** Separa un script en sentencias (alcanza para los ejemplos de la guía: no hay ; dentro de strings). */
export function splitStatements(sql: string) {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s && !/^(--[^\n]*\n?)+$/.test(s))
}

export type Salida =
  | { tipo: 'filas'; columnas: string[]; filas: (string | number | null)[][] }
  | { tipo: 'ok'; afectadas: number; info?: string }
  | { tipo: 'error'; mensaje: string }

export type Resultado = { salidas: Salida[]; playground: boolean }
export type Resultados = { version: string; consultas: Record<string, Resultado> }
