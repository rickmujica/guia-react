import { Module } from '@nestjs/common'
import { OfertasController } from './ofertas.controller.js'
import { OfertasService } from './ofertas.service.js'
import { RepositorioOfertas } from './ofertas.repositorio.js'
import { RepositorioEnMemoria } from './repositorio-memoria.js'

@Module({
  controllers: [OfertasController],
  providers: [
    OfertasService,
    // Quien pida RepositorioOfertas recibe un RepositorioEnMemoria. Para usar MySQL:
    //   imports: [MysqlModule], y useClass: RepositorioMysql
    { provide: RepositorioOfertas, useClass: RepositorioEnMemoria },
  ],
})
export class OfertasModule {}
