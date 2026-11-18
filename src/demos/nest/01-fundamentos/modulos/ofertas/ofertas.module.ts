import { Module } from '@nestjs/common'
import { OfertasController } from '../../providers/ofertas.controller.js'
import { OfertasService } from '../../providers/ofertas.service.js'

// El módulo de la feature "ofertas": sus rutas y su servicio
@Module({
  controllers: [OfertasController],
  providers: [OfertasService],
  exports: [OfertasService], // lo que pueden usar los módulos que importen este
})
export class OfertasModule {}
