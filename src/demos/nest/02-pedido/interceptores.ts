import {
  Controller,
  Get,
  Injectable,
  Module,
  RequestTimeoutException,
  UseInterceptors,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { Request } from 'express'
import { catchError, map, throwError, timeout, TimeoutError } from 'rxjs'
import { setTimeout as esperar } from 'node:timers/promises'

// next.handle() es un Observable de RxJS con lo que devuelve el handler: con sus operadores
// (map, tap, timeout, catchError…) se transforma la respuesta.

// Envuelve todas las respuestas en { datos, ruta }
@Injectable()
class EnvolverInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const { url } = context.switchToHttp().getRequest<Request>()
    return next.handle().pipe(map((datos) => ({ datos, ruta: url })))
  }
}

// Corta los handlers que tardan más de lo permitido
@Injectable()
class TimeoutInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(100),
      catchError((error) =>
        throwError(() => (error instanceof TimeoutError ? new RequestTimeoutException('Tardó demasiado') : error)),
      ),
    )
  }
}

@Controller('ofertas')
@UseInterceptors(EnvolverInterceptor) // en todo el controlador
class OfertasController {
  @Get()
  listar() {
    return [{ id: 1, titulo: 'Frontend React Senior' }]
  }

  @Get('lenta')
  @UseInterceptors(TimeoutInterceptor) // solo en este handler
  async lenta() {
    await esperar(300)
    return 'nunca llega'
  }
}

@Module({ controllers: [OfertasController] })
class AppModule {}

export const crearApp = () => NestFactory.create(AppModule, { logger: false })
