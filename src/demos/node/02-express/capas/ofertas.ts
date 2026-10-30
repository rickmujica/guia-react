import { z } from 'zod'

// El modelo: los tipos y las reglas de forma de una oferta, sin nada de HTTP ni de base de datos
export const Modalidad = z.enum(['remoto', 'hibrido', 'presencial'])

export const OfertaNueva = z.object({
  titulo: z.string().trim().min(3),
  empresa: z.string().trim().min(1),
  modalidad: Modalidad.default('remoto'),
  salarioMax: z.number().int().positive().nullable().default(null),
})
export type OfertaNueva = z.infer<typeof OfertaNueva>
export type Oferta = OfertaNueva & { id: number }

export const Filtros = z.object({
  modalidad: Modalidad.optional(),
  empresa: z.string().optional(),
})
export type Filtros = z.infer<typeof Filtros>

/** Un error esperable del negocio, con el status HTTP que le corresponde. */
export class ErrorDeNegocio extends Error {
  readonly status: number
  constructor(status: number, mensaje: string) {
    super(mensaje)
    this.status = status
  }
}
