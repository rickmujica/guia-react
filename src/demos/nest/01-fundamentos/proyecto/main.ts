import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'

// El punto de entrada: crea la app a partir del módulo raíz y la levanta
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
}
await bootstrap()
