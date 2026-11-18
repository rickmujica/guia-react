import {
  Controller,
  Get,
  Injectable,
  Logger,
  Module,
  VERSION_NEUTRAL,
  VersioningType,
  Version,
  type OnApplicationShutdown,
  type OnModuleInit,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

@Injectable()
class Cola implements OnModuleInit, OnApplicationShutdown {
  // El logger de Nest, con el nombre de la clase como contexto
  private readonly logger = new Logger(Cola.name)

  onModuleInit() {
    this.logger.log('Conectada')
  }

  onApplicationShutdown(senal?: string) {
    this.logger.log(`Cerrando (señal: ${senal})`)
  }
}

@Controller({ path: 'ofertas', version: '1' })
class OfertasController {
  @Get()
  listar() {
    return [{ id: 1, titulo: 'Frontend React Senior' }]
  }

  // La versión 2 de la misma ruta cambia el formato de la respuesta
  @Version('2')
  @Get()
  listarV2() {
    return { datos: [{ id: 1, titulo: 'Frontend React Senior' }], total: 1 }
  }
}

// Sin versión (VERSION_NEUTRAL) y fuera del prefijo: para el balanceador de carga o Kubernetes
@Controller({ path: 'salud', version: VERSION_NEUTRAL })
class SaludController {
  @Get()
  salud() {
    return { ok: true }
  }
}

@Module({ controllers: [OfertasController, SaludController], providers: [Cola] })
export class AppModule {}

export async function crearApp() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] })
  app.setGlobalPrefix('api', { exclude: ['salud'] }) // /api/v1/ofertas
  app.enableVersioning({ type: VersioningType.URI }) // la versión va en la URL: /v1/…
  app.enableCors({ origin: ['http://localhost:5173'] }) // el front de Vite
  app.enableShutdownHooks() // escuchar SIGTERM y SIGINT para llamar a los hooks de apagado
  return app
}

if (import.meta.main) {
  const app = await crearApp()
  await app.listen(process.env.PORT ?? 3000)
}
