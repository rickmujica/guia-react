import {
  Catch,
  Controller,
  Get,
  HttpException,
  Injectable,
  Module,
  Param,
  type ArgumentMetadata,
  type ArgumentsHost,
  type CallHandler,
  type CanActivate,
  type ExceptionFilter,
  type ExecutionContext,
  type MiddlewareConsumer,
  type NestInterceptor,
  type NestMiddleware,
  type NestModule,
  type PipeTransform,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NextFunction, Request, Response } from 'express'
import { tap } from 'rxjs'

// Cada pieza del ciclo imprime su paso, para ver en qué orden corren.

// 1. Middleware: lo mismo que en Express. No sabe qué handler va a atender el pedido.
@Injectable()
class Middleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log('1. middleware', req.method, req.originalUrl)
    next()
  }
}

// 2. Guard: decide si el pedido sigue (true) o no (false = 403). Sabe qué handler toca.
@Injectable()
class Guard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>()
    console.log('2. guard →', context.getClass().name, context.getHandler().name)
    return req.get('x-bloquear') === undefined
  }
}

// 3. Interceptor: envuelve al handler, antes y después
@Injectable()
class Interceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    console.log('3. interceptor (antes)')
    return next.handle().pipe(tap((respuesta) => console.log('6. interceptor (después):', respuesta)))
  }
}

// 4. Pipe: transforma o valida cada argumento del handler
class SoloNumeros implements PipeTransform {
  transform(valor: string, { type, data }: ArgumentMetadata) {
    console.log(`4. pipe (${type} "${data}")`)
    if (!/^\d+$/.test(valor)) throw new HttpException(`"${valor}" no es un número`, 400)
    return Number(valor)
  }
}

// Filtro de excepciones: atrapa lo que se lanza en cualquier paso y arma la respuesta de error
@Catch(HttpException)
class Filtro implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    console.log('✗ filtro:', error.message)
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(error.getStatus())
      .json({ status: error.getStatus(), error: error.message })
  }
}

@Controller('ofertas')
class OfertasController {
  @Get(':id')
  obtener(@Param('id', SoloNumeros) id: number) {
    console.log('5. handler, id =', id)
    return { id, titulo: 'Frontend React Senior' }
  }
}

@Module({ controllers: [OfertasController] })
class AppModule implements NestModule {
  // Los middlewares se registran en el módulo, por ruta
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('*path')
  }
}

export async function crearApp() {
  const app = await NestFactory.create(AppModule, { logger: false })
  // Guards, interceptores, pipes y filtros pueden ser globales (como acá), por controlador
  // o por handler (con @UseGuards, @UseInterceptors, @UsePipes y @UseFilters)
  app.useGlobalGuards(new Guard())
  app.useGlobalInterceptors(new Interceptor())
  app.useGlobalFilters(new Filtro())
  return app
}
