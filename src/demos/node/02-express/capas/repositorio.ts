import type { Filtros, Oferta, OfertaNueva } from './ofertas.ts'

// El repositorio es lo único que sabe DÓNDE se guardan los datos.
// El servicio y las rutas usan esta interfaz y no se enteran si es memoria o MySQL.
export interface RepositorioOfertas {
  listar(filtros: Filtros): Promise<Oferta[]>
  buscar(id: number): Promise<Oferta | undefined>
  crear(datos: OfertaNueva): Promise<Oferta>
}

// En memoria: para desarrollar y para los tests
export function crearRepoEnMemoria(iniciales: Oferta[] = []): RepositorioOfertas {
  const ofertas = structuredClone(iniciales)
  return {
    async listar({ modalidad, empresa }) {
      return ofertas.filter((o) => (!modalidad || o.modalidad === modalidad) && (!empresa || o.empresa === empresa))
    },
    async buscar(id) {
      return ofertas.find((o) => o.id === id)
    },
    async crear(datos) {
      const oferta = { ...datos, id: Math.max(0, ...ofertas.map((o) => o.id)) + 1 }
      ofertas.push(oferta)
      return oferta
    },
  }
}
