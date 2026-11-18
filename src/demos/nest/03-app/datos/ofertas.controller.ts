import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { Filtros, NuevaOferta } from './oferta.js'
import { OfertasService } from './ofertas.service.js'

@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertas: OfertasService) {}

  @Get()
  listar(@Query({ schema: Filtros }) filtros: Filtros) {
    return this.ofertas.listar(filtros)
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.ofertas.obtener(id)
  }

  @Post()
  publicar(@Body({ schema: NuevaOferta }) datos: NuevaOferta) {
    return this.ofertas.publicar(datos)
  }
}
