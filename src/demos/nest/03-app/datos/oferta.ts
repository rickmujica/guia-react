import { z } from 'zod'
import type { Oferta } from '../../datos.js'

export type { Oferta }

export const NuevaOferta = z.strictObject({
  titulo: z.string().trim().min(3),
  empresa: z.string().min(1),
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).default('remoto'),
  salarioMax: z.number().int().positive().nullable().default(null),
})
export type NuevaOferta = z.infer<typeof NuevaOferta>

export const Filtros = z.object({
  modalidad: z.enum(['remoto', 'hibrido', 'presencial']).optional(),
  empresa: z.string().optional(),
})
export type Filtros = z.infer<typeof Filtros>
