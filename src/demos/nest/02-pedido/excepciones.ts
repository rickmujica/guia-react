import {
  BadRequestException,
  Catch,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Module,
  Param,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { Request, Response } from 'express'

// Un error del negocio, que no sabe nada de HTTP (lo puede lanzar un servicio)
export class OfertaCerrada extends Error {
  constructor(readonly ofertaId: number) {
    super(`La oferta ${ofertaId} ya no recibe postulaciones`)
  }
}

// Un filtro que traduce ese error a HTTP. @Catch dice qué errores atrapa.
@Catch(OfertaCerrada)
class OfertaCerradaFilter implements ExceptionFilter {
  catch(error: OfertaCerrada, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    ctx.getResponse<Response>().status(HttpStatus.GONE).json({
      statusCode: 410,
      error: 'Gone',
      message: error.message,
      ruta: ctx.getRequest<Request>().url,
    })
  }
}

@Controller('errores')
class ErroresController {
  // Las excepciones de Nest ya traen su status y arman la respuesta
  @Get('conflicto')
  conflicto() {
    throw new ConflictException('Ya te postulaste a esta oferta')
  }

  @Get('detalle')
  detalle() {
    throw new BadRequestException({ message: 'Datos inválidos', campos: ['email'] })
  }

  @Get('propia')
  propia() {
    throw new HttpException('Probá de nuevo en un minuto', HttpStatus.TOO_MANY_REQUESTS)
  }

  @Get('cerrada/:id')
  cerrada(@Param('id') id: string) {
    throw new OfertaCerrada(Number(id))
  }

  // Cualquier otro error es un 500, y Nest lo registra en el log con el stack
  @Get('bug')
  bug() {
    const oferta = undefined as unknown as { titulo: string }
    return oferta.titulo
  }
}

@Module({ controllers: [ErroresController] })
class AppModule {}

export async function crearApp() {
  // Un logger con solo los errores, para ver qué registra Nest
  const app = await NestFactory.create(AppModule, { logger: ['error'] })
  app.useGlobalFilters(new OfertaCerradaFilter())
  return app
}
