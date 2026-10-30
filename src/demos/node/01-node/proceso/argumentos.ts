import { parseArgs } from 'node:util'

// Lo que se escribió después de "node argumentos.ts"
console.log('process.argv:', process.argv.slice(2))

// parseArgs: las opciones de la línea de comandos, con tipos y valores por defecto
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    seniority: { type: 'string', short: 's', default: 'semi' },
    remoto: { type: 'boolean', default: false },
    minimo: { type: 'string' },
  },
})
console.log('Opciones:', values)
console.log('Palabras clave:', positionals)
