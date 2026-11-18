import { ConflictException, Injectable } from '@nestjs/common'
import { OfertasService } from '../../providers/ofertas.service.js'

type Postulacion = { id: number; ofertaId: number; email: string }

@Injectable()
export class PostulacionesService {
  private readonly postulaciones: Postulacion[] = []

  // Un servicio de otro módulo: funciona porque OfertasModule lo exporta
  constructor(private readonly ofertas: OfertasService) {}

  postular(ofertaId: number, email: string) {
    const oferta = this.ofertas.obtener(ofertaId) // 404 si no existe
    if (this.postulaciones.some((p) => p.ofertaId === ofertaId && p.email === email)) {
      throw new ConflictException('Ya te postulaste a esta oferta')
    }
    const postulacion = { id: this.postulaciones.length + 1, ofertaId, email }
    this.postulaciones.push(postulacion)
    return { ...postulacion, oferta: oferta.titulo }
  }
}
