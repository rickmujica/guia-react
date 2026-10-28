import { sleep } from '../shared/utils'

export type Job = { id: number; title: string; company: string; salary: string; stack: string[] }

const jobs: Job[] = [
  { id: 1, title: 'Frontend Engineer', company: 'Nubelia', salary: 'USD 3.200', stack: ['React', 'TypeScript', 'Next.js'] },
  { id: 2, title: 'React Developer', company: 'Pagos Sur', salary: 'USD 2.800', stack: ['React', 'Redux', 'Jest'] },
  { id: 3, title: 'UI Engineer', company: 'Datalab', salary: 'USD 4.100', stack: ['React', 'Tailwind', 'Storybook'] },
  { id: 4, title: 'Senior Frontend', company: 'Kuarahy', salary: '—', stack: [] },
]

// Caché de promesas: use() necesita recibir LA MISMA promesa en cada render.
const cache = new Map<number, Promise<Job>>()

export function fetchJob(id: number): Promise<Job> {
  if (!cache.has(id)) {
    cache.set(
      id,
      sleep(1200).then(() => {
        if (id === 4) throw new Error('Esta oferta ya no existe (404).')
        return jobs.find((job) => job.id === id)!
      }),
    )
  }
  return cache.get(id)!
}

export function clearJobsCache() {
  cache.clear()
}
