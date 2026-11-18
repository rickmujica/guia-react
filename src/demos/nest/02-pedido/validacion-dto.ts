import { Body, Controller, Module, Post, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

// La forma clásica (la que vas a ver en casi todos los proyectos de Nest): un DTO
// (Data Transfer Object) como clase, con decoradores de class-validator
export class CrearOfertaDto {
  @IsString()
  @MinLength(3, { message: 'El título tiene que tener al menos 3 letras' })
  titulo: string

  @IsString()
  empresa: string

  @IsIn(['remoto', 'hibrido', 'presencial'])
  modalidad: 'remoto' | 'hibrido' | 'presencial' = 'remoto'

  @IsOptional()
  @Type(() => Number) // class-transformer: convierte antes de validar
  @IsInt()
  @IsPositive()
  salarioMax?: number
}

@Controller('ofertas')
class OfertasController {
  // El tipo del parámetro ES la validación: ValidationPipe lo lee de los metadatos
  @Post()
  crear(@Body() oferta: CrearOfertaDto) {
    return { id: 6, ...oferta, esInstancia: oferta instanceof CrearOfertaDto }
  }
}

@Module({ controllers: [OfertasController] })
class AppModule {}

export async function crearApp() {
  const app = await NestFactory.create(AppModule, { logger: false })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // borra las propiedades sin decoradores
      forbidNonWhitelisted: true, // …o mejor, responde 400 si vienen
      transform: true, // el body llega como instancia de CrearOfertaDto (y aplica los valores por defecto)
    }),
  )
  return app
}
