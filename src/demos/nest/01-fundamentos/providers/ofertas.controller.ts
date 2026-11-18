import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { OfertasService, type NuevaOferta } from './ofertas.service.js'

// El controlador solo traduce HTTP: recibe el pedido y llama al servicio
@Controller('ofertas')
export class OfertasController {
  // Nest ve el tipo del parámetro (OfertasService) y le pasa la instancia que ya creó
  constructor(private readonly ofertasService: OfertasService) {}

  @Get()
  listar(@Query('modalidad') modalidad?: string) {
    return this.ofertasService.listar(modalidad)
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.ofertasService.obtener(id)
  }

  @Post()
  crear(@Body() body: NuevaOferta) {
    return this.ofertasService.crear(body)
  }
}
