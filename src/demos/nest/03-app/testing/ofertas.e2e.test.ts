import { StandardSchemaValidationPipe, type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import { AppModule } from '../datos/app.js'

// Test end-to-end: la app entera, con pedidos HTTP de verdad
describe('API de ofertas', () => {
  let app: INestApplication
  let url: string

  before(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      // Acá se reemplazaría el repositorio de MySQL por uno en memoria:
      // .overrideProvider(RepositorioOfertas).useClass(RepositorioEnMemoria)
      .compile()
    app = modulo.createNestApplication({ logger: false })
    app.useGlobalPipes(new StandardSchemaValidationPipe()) // lo mismo que en crearApp
    await app.listen(0) // un puerto libre
    url = await app.getUrl()
  })

  after(() => app.close())

  it('GET /ofertas filtra por modalidad', async () => {
    const r = await fetch(`${url}/ofertas?modalidad=hibrido`)
    assert.equal(r.status, 200)
    const ofertas = (await r.json()) as { id: number }[]
    assert.deepEqual(ofertas.map((o) => o.id), [3])
  })

  it('POST /ofertas valida el body', async () => {
    const r = await fetch(`${url}/ofertas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: 'QA' }),
    })
    assert.equal(r.status, 400)
  })

  it('POST /ofertas crea la oferta', async () => {
    const r = await fetch(`${url}/ofertas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titulo: 'Backend Node', empresa: 'Nubelia' }),
    })
    assert.equal(r.status, 201)
    assert.equal(((await r.json()) as { id: number }).id, 6)
  })
})
