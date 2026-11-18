import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { OfertasController } from '../providers/ofertas.controller.js'
import { OfertasService } from '../providers/ofertas.service.js'
import { PostulacionesController } from './postulaciones/postulaciones.controller.js'
import { PostulacionesService } from './postulaciones/postulaciones.service.js'

// El error más común de Nest: OfertasModule NO exporta OfertasService
@Module({ controllers: [OfertasController], providers: [OfertasService] })
class OfertasModule {}

@Module({
  imports: [OfertasModule],
  controllers: [PostulacionesController],
  providers: [PostulacionesService],
})
class PostulacionesModule {}

@Module({ imports: [OfertasModule, PostulacionesModule] })
class AppModule {}

await NestFactory.create(AppModule, { logger: ['error'] })
