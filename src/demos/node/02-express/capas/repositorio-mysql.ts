import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import type { Oferta } from './ofertas.ts'
import type { RepositorioOfertas } from './repositorio.ts'

type Fila = RowDataPacket & { id: number; titulo: string; empresa: string; modalidad: Oferta['modalidad']; salario_max: number | null }

const aOferta = (f: Fila): Oferta => ({
  id: f.id,
  titulo: f.titulo,
  empresa: f.empresa,
  modalidad: f.modalidad,
  salarioMax: f.salario_max,
})

// La misma interfaz, guardando en MySQL (las tablas de la guía de MySQL, simplificadas)
export function crearRepoMysql(pool: Pool): RepositorioOfertas {
  return {
    async listar({ modalidad, empresa }) {
      const [filas] = await pool.execute<Fila[]>(
        `SELECT o.id, o.titulo, e.nombre AS empresa, o.modalidad, o.salario_max
         FROM ofertas o JOIN empresas e ON e.id = o.empresa_id
         WHERE (? IS NULL OR o.modalidad = ?) AND (? IS NULL OR e.nombre = ?)
         ORDER BY o.id`,
        [modalidad ?? null, modalidad ?? null, empresa ?? null, empresa ?? null],
      )
      return filas.map(aOferta)
    },
    async buscar(id) {
      const [filas] = await pool.execute<Fila[]>(
        `SELECT o.id, o.titulo, e.nombre AS empresa, o.modalidad, o.salario_max
         FROM ofertas o JOIN empresas e ON e.id = o.empresa_id
         WHERE o.id = ?`,
        [id],
      )
      return filas[0] && aOferta(filas[0])
    },
    async crear(datos) {
      const [resultado] = await pool.execute<ResultSetHeader>(
        `INSERT INTO ofertas (empresa_id, titulo, modalidad, salario_max, seniority, publicada)
         SELECT id, ?, ?, ?, 'semi', CURDATE() FROM empresas WHERE nombre = ?`,
        [datos.titulo, datos.modalidad, datos.salarioMax, datos.empresa],
      )
      return { ...datos, id: resultado.insertId }
    },
  }
}
