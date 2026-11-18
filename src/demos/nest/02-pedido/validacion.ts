import {
  Body,
  Controller,
  Get,
  Module,
  Param,
  Patch,
  Post,
  Query,
  StandardSchemaValidationPipe,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { z } from 'zod'

// Los esquemas de Zod: la validación y el tipo salen del mismo lugar (como en la guía de Express)
export const NuevaOferta = z.strictObject({
  titulo: z.string().trim().min(3, 'El título tiene que tener al menos 3 letras'),
  empresa: z.string().min(1),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).default('remoto'),
  salarioMax: z.number().int().positive().nullable().default(null),
})
export type NuevaOferta = z.infer<typeof NuevaOferta>

// La query llega como strings: z.coerce los convierte
const Filtros = z.object({
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).optional(),
  pagina: z.coerce.number().int().min(1).default(1),
})

const Id = z.coerce.number().int().positive()

@Controller('ofertas')
class OfertasController {
  // Nest 12: el esquema va en el decorador del parámetro ({ schema }) y lo valida el pipe global
  @Get()
  listar(@Query({ schema: Filtros }) filtros: z.infer<typeof Filtros>) {
    return { filtros }
  }

  @Post()
  crear(@Body({ schema: NuevaOferta }) oferta: NuevaOferta) {
    return { id: 6, ...oferta } // oferta ya viene validada, con los valores por defecto
  }

  @Patch(':id')
  actualizar(@Param('id', { schema: Id }) id: number, @Body({ schema: NuevaOferta.partial() }) cambios: Partial<NuevaOferta>) {
    return { id, cambios }
  }
}

@Module({ controllers: [OfertasController] })
class AppModule {}

export async function crearApp() {
  const app = await NestFactory.create(AppModule, { logger: false })
  // Valida con el esquema de cada parámetro (cualquier librería de Standard Schema: Zod, Valibot, ArkType)
  app.useGlobalPipes(new StandardSchemaValidationPipe())
  return app
}
