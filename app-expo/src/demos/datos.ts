// Datos de ejemplo para las demos y la app: ofertas de trabajo de empresas inventadas.
export type Modalidad = 'remoto' | 'hibrido' | 'presencial'

export type Oferta = {
  id: number
  titulo: string
  empresa: string
  modalidad: Modalidad
  pais: string
  salarioMax: number
  stack: string[]
}

export const ofertas: Oferta[] = [
  { id: 1, titulo: 'React Native Developer', empresa: 'Nubelia', modalidad: 'remoto', pais: 'PY', salarioMax: 4200, stack: ['React Native', 'Expo', 'TypeScript'] },
  { id: 2, titulo: 'Frontend React Senior', empresa: 'Delta Pay', modalidad: 'remoto', pais: 'AR', salarioMax: 5000, stack: ['React', 'Next.js'] },
  { id: 3, titulo: 'Mobile Engineer', empresa: 'Mate Cloud', modalidad: 'hibrido', pais: 'UY', salarioMax: 3800, stack: ['React Native', 'GraphQL'] },
  { id: 4, titulo: 'Fullstack Node', empresa: 'Cumbre Data', modalidad: 'remoto', pais: 'MX', salarioMax: 4500, stack: ['Node', 'React'] },
  { id: 5, titulo: 'Expo Developer', empresa: 'Yerba Labs', modalidad: 'remoto', pais: 'PY', salarioMax: 3600, stack: ['Expo', 'Zustand'] },
  { id: 6, titulo: 'Frontend Junior', empresa: 'Mate Cloud', modalidad: 'presencial', pais: 'UY', salarioMax: 1800, stack: ['React'] },
  { id: 7, titulo: 'Senior Mobile (iOS y Android)', empresa: 'Delta Pay', modalidad: 'remoto', pais: 'AR', salarioMax: 6000, stack: ['React Native', 'Swift'] },
  { id: 8, titulo: 'UI Engineer', empresa: 'Nubelia', modalidad: 'hibrido', pais: 'PY', salarioMax: 3200, stack: ['React', 'Design Systems'] },
  { id: 9, titulo: 'React Native Semi Senior', empresa: 'Cumbre Data', modalidad: 'remoto', pais: 'CO', salarioMax: 3500, stack: ['React Native', 'Redux'] },
  { id: 10, titulo: 'Tech Lead Mobile', empresa: 'Yerba Labs', modalidad: 'remoto', pais: 'PY', salarioMax: 7000, stack: ['React Native', 'Expo', 'EAS'] },
  { id: 11, titulo: 'Frontend Vue/React', empresa: 'Andes Soft', modalidad: 'presencial', pais: 'CL', salarioMax: 2600, stack: ['Vue', 'React'] },
  { id: 12, titulo: 'Mobile QA Automation', empresa: 'Andes Soft', modalidad: 'hibrido', pais: 'CL', salarioMax: 2900, stack: ['Maestro', 'Detox'] },
]

export const nombreModalidad: Record<Modalidad, string> = {
  remoto: 'Remoto',
  hibrido: 'Híbrido',
  presencial: 'Presencial',
}
