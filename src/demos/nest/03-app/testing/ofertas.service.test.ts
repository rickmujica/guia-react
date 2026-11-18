import { ConflictException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import assert from 'node:assert/strict'
import { beforeEach, describe, it, mock } from 'node:test'
import { RepositorioOfertas } from '../datos/ofertas.repositorio.js'
import { OfertasService } from '../datos/ofertas.service.js'

// Test unitario: el servicio de verdad, con un repositorio falso (un mock)
describe('OfertasService', () => {
  let servicio: OfertasService
  const repo = {
    listar: mock.fn(async () => [{ id: 1, titulo: 'Frontend React', empresa: 'Nubelia', modalidad: 'remoto' as const, salarioMax: null }]),
    buscar: mock.fn(async () => undefined),
    crear: mock.fn(async (datos: object) => ({ ...datos, id: 99 })),
  }

  beforeEach(async () => {
    repo.crear.mock.resetCalls()
    // Un módulo de prueba: solo lo que el test necesita, y el repositorio reemplazado
    const modulo = await Test.createTestingModule({
      providers: [OfertasService, { provide: RepositorioOfertas, useValue: repo }],
    }).compile()
    servicio = modulo.get(OfertasService)
  })

  it('publica una oferta nueva', async () => {
    const oferta = await servicio.publicar({ titulo: 'Backend Node', empresa: 'Nubelia', modalidad: 'remoto', salarioMax: null })
    assert.equal(oferta.id, 99)
    assert.equal(repo.crear.mock.callCount(), 1)
  })

  it('no deja publicar dos veces el mismo título (sin importar mayúsculas)', async () => {
    await assert.rejects(
      servicio.publicar({ titulo: 'frontend react', empresa: 'Nubelia', modalidad: 'remoto', salarioMax: null }),
      ConflictException,
    )
    assert.equal(repo.crear.mock.callCount(), 0)
  })

  it('responde 404 si la oferta no existe', async () => {
    await assert.rejects(servicio.obtener(7), { name: 'NotFoundException', message: 'No existe la oferta 7' })
  })
})
