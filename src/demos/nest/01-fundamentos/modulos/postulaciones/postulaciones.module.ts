import { Module } from '@nestjs/common'
import { OfertasModule } from '../ofertas/ofertas.module.js'
import { PostulacionesController } from './postulaciones.controller.js'
import { PostulacionesService } from './postulaciones.service.js'

@Module({
  imports: [OfertasModule], // para poder inyectar OfertasService
  controllers: [PostulacionesController],
  providers: [PostulacionesService],
})
export class PostulacionesModule {}
