// Datos de ejemplo en memoria (cada ejemplo arranca con estos mismos)
export type Modalidad = 'remoto' | 'hibrido' | 'presencial'

export type Oferta = {
  id: number
  titulo: string
  empresa: string
  modalidad: Modalidad
  salarioMax: number | null
}

export const ofertas: Oferta[] = [
  { id: 1, titulo: 'Frontend React Senior', empresa: 'Nubelia', modalidad: 'remoto', salarioMax: 4000 },
  { id: 2, titulo: 'Fullstack Node', empresa: 'Nubelia', modalidad: 'remoto', salarioMax: 3000 },
  { id: 3, titulo: 'React Native Developer', empresa: 'Pagos Sur', modalidad: 'hibrido', salarioMax: 3200 },
  { id: 4, titulo: 'Frontend Junior', empresa: 'Mate Cloud', modalidad: 'presencial', salarioMax: 1600 },
  { id: 5, titulo: 'Senior Frontend Engineer', empresa: 'Delta Pay', modalidad: 'remoto', salarioMax: 6000 },
]
