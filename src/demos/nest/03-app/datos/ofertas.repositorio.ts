import type { Filtros, NuevaOferta, Oferta } from './oferta.js'

// El contrato del acceso a datos. Es una clase abstracta (y no una interface) porque las
// interfaces desaparecen al compilar, y Nest necesita algo que exista en tiempo de ejecución
// para usar como token de inyección.
export abstract class RepositorioOfertas {
  abstract listar(filtros: Filtros): Promise<Oferta[]>
  abstract buscar(id: number): Promise<Oferta | undefined>
  abstract crear(datos: NuevaOferta): Promise<Oferta>
}
