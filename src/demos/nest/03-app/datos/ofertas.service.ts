import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import type { Filtros, NuevaOferta } from './oferta.js'
import { RepositorioOfertas } from './ofertas.repositorio.js'

// Las reglas del negocio. Recibe "un" repositorio: no sabe si es MySQL o memoria.
@Injectable()
export class OfertasService {
  constructor(private readonly repo: RepositorioOfertas) {}

  listar(filtros: Filtros) {
    return this.repo.listar(filtros)
  }

  async obtener(id: number) {
    const oferta = await this.repo.buscar(id)
    if (!oferta) throw new NotFoundException(`No existe la oferta ${id}`)
    return oferta
  }

  async publicar(datos: NuevaOferta) {
    const deLaEmpresa = await this.repo.listar({ empresa: datos.empresa })
    if (deLaEmpresa.some((o) => o.titulo.toLowerCase() === datos.titulo.toLowerCase())) {
      throw new ConflictException(`${datos.empresa} ya publicó "${datos.titulo}"`)
    }
    return this.repo.crear(datos)
  }
}
