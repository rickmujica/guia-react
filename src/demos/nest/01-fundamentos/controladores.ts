import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { Response } from 'express'
import { ofertas as datos, type Oferta } from '../datos.js'

// Por ahora los datos viven en el controlador. En el capítulo siguiente pasan a un servicio.
const ofertas: Oferta[] = structuredClone(datos)

@Controller('ofertas') // prefijo de todas las rutas de la clase
export class OfertasController {
  // GET /ofertas?modalidad=remoto
  @Get()
  listar(@Query('modalidad') modalidad?: string) {
    return modalidad ? ofertas.filter((o) => o.modalidad === modalidad) : ofertas
  }

  // GET /ofertas/3. ParseIntPipe convierte "3" en 3 (y responde 400 si no es un número)
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    const oferta = ofertas.find((o) => o.id === id)
    if (!oferta) throw new NotFoundException(`No existe la oferta ${id}`)
    return oferta
  }

  // POST responde 201 por defecto
  @Post()
  crear(@Body() body: Omit<Oferta, 'id'>) {
    const oferta = { ...body, id: Math.max(...ofertas.map((o) => o.id)) + 1 }
    ofertas.push(oferta)
    return oferta
  }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() cambios: Partial<Oferta>) {
    const oferta = this.obtener(id)
    return Object.assign(oferta, cambios, { id })
  }

  @Delete(':id')
  @HttpCode(204) // sin cuerpo
  borrar(@Param('id', ParseIntPipe) id: number) {
    ofertas.splice(ofertas.indexOf(this.obtener(id)), 1)
  }

  // Headers fijos con @Header. Un string se responde como texto.
  @Get('exportar/csv')
  @Header('Content-Type', 'text/csv')
  exportar() {
    return ofertas.map((o) => `${o.id},${o.titulo},${o.empresa}`).join('\n')
  }

  // La salida de emergencia: el objeto res de Express. Con passthrough, Nest sigue
  // respondiendo con lo que devolvés (y funcionan los interceptores).
  @Get('remotas/contar')
  contar(@Res({ passthrough: true }) res: Response) {
    const remotas = ofertas.filter((o) => o.modalidad === 'remoto')
    res.setHeader('X-Total', remotas.length) // un header calculado
    return remotas.map((o) => o.titulo)
  }
}

@Module({ controllers: [OfertasController] })
export class AppModule {}

export const crearApp = () => NestFactory.create(AppModule, { logger: false })
