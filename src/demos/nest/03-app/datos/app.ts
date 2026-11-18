import { Module, StandardSchemaValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { OfertasModule } from './ofertas.module.js'

@Module({ imports: [OfertasModule] })
export class AppModule {}

export async function crearApp() {
  const app = await NestFactory.create(AppModule, { logger: false })
  app.useGlobalPipes(new StandardSchemaValidationPipe())
  return app
}
