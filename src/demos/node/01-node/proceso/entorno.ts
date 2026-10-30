// Las variables de entorno siempre son strings (o undefined si no están)
const puerto = Number(process.env.PUERTO ?? 3000)
console.log('PUERTO:', puerto, typeof puerto)
console.log('DB_NAME:', process.env.DB_NAME)
console.log('NO_EXISTE:', process.env.NO_EXISTE)
console.log('API_KEY definida:', Boolean(process.env.API_KEY))

// Otros datos del proceso
console.log('Versión de Node:', process.version.split('.')[0])
