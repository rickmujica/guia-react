import { Injectable, NotFoundException } from '@nestjs/common'
import { ofertas as datos, type Oferta } from '../../datos.js'

export type NuevaOferta = Omit<Oferta, 'id'>

// La lógica y los datos, sin nada de HTTP (salvo la excepción, que Nest traduce a un 404)
@Injectable()
export class OfertasService {
  private readonly ofertas: Oferta[] = structuredClone(datos)
  private siguienteId = 6

  constructor() {
    console.log('OfertasService creado') // una sola vez: es un singleton
  }

  listar(modalidad?: string) {
    return modalidad ? this.ofertas.filter((o) => o.modalidad === modalidad) : this.ofertas
  }

  obtener(id: number) {
    const oferta = this.ofertas.find((o) => o.id === id)
    if (!oferta) throw new NotFoundException(`No existe la oferta ${id}`)
    return oferta
  }

  crear(nueva: NuevaOferta) {
    const oferta = { ...nueva, id: this.siguienteId++ }
    this.ofertas.push(oferta)
    return oferta
  }
}
