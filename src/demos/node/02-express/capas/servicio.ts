import { ErrorDeNegocio, type Filtros, type OfertaNueva } from './ofertas.ts'
import type { RepositorioOfertas } from './repositorio.ts'

// El servicio tiene las reglas del negocio. No sabe nada de HTTP (ni de req ni de res),
// así se puede usar desde una ruta, un script o un test.
export function crearServicioOfertas(repo: RepositorioOfertas) {
  return {
    listar: (filtros: Filtros) => repo.listar(filtros),

    async obtener(id: number) {
      const oferta = await repo.buscar(id)
      if (!oferta) throw new ErrorDeNegocio(404, `No existe la oferta ${id}`)
      return oferta
    },

    async publicar(datos: OfertaNueva) {
      const deLaEmpresa = await repo.listar({ empresa: datos.empresa })
      if (deLaEmpresa.some((o) => o.titulo.toLowerCase() === datos.titulo.toLowerCase())) {
        throw new ErrorDeNegocio(409, `${datos.empresa} ya publicó "${datos.titulo}"`)
      }
      return repo.crear(datos)
    },
  }
}

export type ServicioOfertas = ReturnType<typeof crearServicioOfertas>
