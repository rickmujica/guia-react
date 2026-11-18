import { Injectable } from '@nestjs/common'
import { ofertas } from '../../datos.js'
import type { Filtros, NuevaOferta, Oferta } from './oferta.js'
import { RepositorioOfertas } from './ofertas.repositorio.js'

@Injectable()
export class RepositorioEnMemoria extends RepositorioOfertas {
  private readonly ofertas: Oferta[] = structuredClone(ofertas)

  async listar({ modalidad, empresa }: Filtros) {
    return this.ofertas.filter((o) => (!modalidad || o.modalidad === modalidad) && (!empresa || o.empresa === empresa))
  }

  async buscar(id: number) {
    return this.ofertas.find((o) => o.id === id)
  }

  async crear(datos: NuevaOferta) {
    const oferta = { ...datos, id: Math.max(...this.ofertas.map((o) => o.id)) + 1 }
    this.ofertas.push(oferta)
    return oferta
  }
}
