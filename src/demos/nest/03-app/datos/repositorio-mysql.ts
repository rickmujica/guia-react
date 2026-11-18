import { Inject, Injectable, Module, type OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createPool, type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import type { Filtros, NuevaOferta, Oferta } from './oferta.js'
import { RepositorioOfertas } from './ofertas.repositorio.js'

// El pool de conexiones como provider, armado con una fábrica que lee la configuración
export const MYSQL = Symbol('MYSQL')

@Module({
  providers: [
    {
      provide: MYSQL,
      useFactory: (config: ConfigService) => createPool({ uri: config.getOrThrow('DB_URL'), connectionLimit: 10 }),
      inject: [ConfigService],
    },
  ],
  exports: [MYSQL],
})
export class MysqlModule implements OnApplicationShutdown {
  constructor(@Inject(MYSQL) private readonly pool: Pool) {}

  // Al apagar la app (con enableShutdownHooks), cierra las conexiones
  onApplicationShutdown() {
    return this.pool.end()
  }
}

type Fila = RowDataPacket & { id: number; titulo: string; empresa: string; modalidad: Oferta['modalidad']; salario_max: number | null }

const aOferta = (f: Fila): Oferta => ({
  id: f.id,
  titulo: f.titulo,
  empresa: f.empresa,
  modalidad: f.modalidad,
  salarioMax: f.salario_max,
})

// La misma clase abstracta, guardando en MySQL (las consultas de la guía de Node y Express)
@Injectable()
export class RepositorioMysql extends RepositorioOfertas {
  constructor(@Inject(MYSQL) private readonly pool: Pool) {
    super()
  }

  async listar({ modalidad, empresa }: Filtros) {
    const [filas] = await this.pool.execute<Fila[]>(
      `SELECT o.id, o.titulo, e.nombre AS empresa, o.modalidad, o.salario_max
       FROM ofertas o JOIN empresas e ON e.id = o.empresa_id
       WHERE (? IS NULL OR o.modalidad = ?) AND (? IS NULL OR e.nombre = ?)
       ORDER BY o.id`,
      [modalidad ?? null, modalidad ?? null, empresa ?? null, empresa ?? null],
    )
    return filas.map(aOferta)
  }

  async buscar(id: number) {
    const [filas] = await this.pool.execute<Fila[]>(
      `SELECT o.id, o.titulo, e.nombre AS empresa, o.modalidad, o.salario_max
       FROM ofertas o JOIN empresas e ON e.id = o.empresa_id
       WHERE o.id = ?`,
      [id],
    )
    return filas[0] && aOferta(filas[0])
  }

  async crear(datos: NuevaOferta) {
    const [resultado] = await this.pool.execute<ResultSetHeader>(
      `INSERT INTO ofertas (empresa_id, titulo, modalidad, salario_max, seniority, publicada)
       SELECT id, ?, ?, ?, 'semi', CURDATE() FROM empresas WHERE nombre = ?`,
      [datos.titulo, datos.modalidad, datos.salarioMax, datos.empresa],
    )
    return { ...datos, id: resultado.insertId }
  }
}
