import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common'
import { PostulacionesService } from './postulaciones.service.js'

@Controller('ofertas/:ofertaId/postulaciones')
export class PostulacionesController {
  constructor(private readonly postulaciones: PostulacionesService) {}

  @Post()
  postular(@Param('ofertaId', ParseIntPipe) ofertaId: number, @Body('email') email: string) {
    return this.postulaciones.postular(ofertaId, email)
  }
}
