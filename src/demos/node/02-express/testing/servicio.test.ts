import assert from 'node:assert/strict'
import { mock, test } from 'node:test'
import type { RepositorioOfertas } from '../capas/repositorio.ts'
import { crearServicioOfertas } from '../capas/servicio.ts'

// Un repositorio falso: cada método es un mock que registra cómo lo llamaron
function repoFalso(existentes: Awaited<ReturnType<RepositorioOfertas['listar']>> = []) {
  return {
    listar: mock.fn(async () => existentes),
    buscar: mock.fn(async () => undefined),
    crear: mock.fn(async (datos) => ({ ...datos, id: 99 })),
  } satisfies RepositorioOfertas
}

const nueva = { titulo: 'Backend Node', empresa: 'Nubelia', modalidad: 'remoto' as const, salarioMax: null }

test('publicar guarda la oferta si no está repetida', async () => {
  const repo = repoFalso()
  const oferta = await crearServicioOfertas(repo).publicar(nueva)
  assert.equal(oferta.id, 99)
  assert.equal(repo.crear.mock.callCount(), 1)
  assert.deepEqual(repo.listar.mock.calls[0].arguments, [{ empresa: 'Nubelia' }])
})

test('publicar rechaza un título repetido en la misma empresa (409)', async () => {
  const repo = repoFalso([{ ...nueva, titulo: 'backend node', id: 1 }])
  await assert.rejects(crearServicioOfertas(repo).publicar(nueva), { status: 409 })
  assert.equal(repo.crear.mock.callCount(), 0)
})

test('obtener una que no existe da 404', async () => {
  await assert.rejects(crearServicioOfertas(repoFalso()).obtener(7), { status: 404 })
})
