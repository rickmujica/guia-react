import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { OfertasController } from './ofertas.controller.js'
import { OfertasService } from './ofertas.service.js'

@Module({
  controllers: [OfertasController],
  providers: [OfertasService], // lo que Nest puede crear e inyectar en este módulo
})
export class AppModule {}

export const crearApp = () => NestFactory.create(AppModule, { logger: false })
