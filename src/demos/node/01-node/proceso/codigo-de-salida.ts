const archivos = process.argv.slice(2)

if (archivos.length === 0) {
  console.error('Uso: node codigo-de-salida.ts <archivo>...')
  // 0 = todo bien; cualquier otro número = algo falló (lo leen los scripts, CI, Docker…)
  process.exitCode = 1
} else {
  console.log('Procesando', archivos)
}
