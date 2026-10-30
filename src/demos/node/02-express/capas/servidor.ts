import mysql from 'mysql2/promise'
import { crearApp } from './app.ts'
import { crearRepoMysql } from './repositorio-mysql.ts'

// El punto de entrada en producción: arma las piezas de verdad y levanta el servidor.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const app = crearApp({ repo: crearRepoMysql(pool) })
const puerto = Number(process.env.PUERTO ?? 3000)
app.listen(puerto, () => console.log(`API en http://localhost:${puerto}`))
