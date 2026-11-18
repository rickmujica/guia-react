import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { OfertasModule } from './ofertas/ofertas.module.js'
import { PostulacionesModule } from './postulaciones/postulaciones.module.js'

// El módulo raíz no tiene lógica: junta los módulos de cada feature
@Module({ imports: [OfertasModule, PostulacionesModule] })
export class AppModule {}

export const crearApp = () => NestFactory.create(AppModule)
