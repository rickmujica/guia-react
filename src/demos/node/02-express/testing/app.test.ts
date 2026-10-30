import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { after, before, describe, test } from 'node:test'
import { crearApp } from '../capas/app.ts'

// Tests de la API entera: se levanta en un puerto libre y se le pega con fetch
describe('API de ofertas', () => {
  let base = ''
  const servidor = crearApp().listen(0)
  before(() => {
    base = `http://localhost:${(servidor.address() as AddressInfo).port}`
  })
  after(() => servidor.close())

  const publicar = (cuerpo: object) =>
    fetch(`${base}/ofertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })

  test('GET /ofertas lista las ofertas', async () => {
    const res = await fetch(`${base}/ofertas`)
    assert.equal(res.status, 200)
    const ofertas = (await res.json()) as unknown[]
    assert.equal(ofertas.length, 2)
  })

  test('POST /ofertas crea una oferta (201)', async () => {
    const res = await publicar({ titulo: 'Backend Node', empresa: 'Nubelia' })
    assert.equal(res.status, 201)
    assert.equal(res.headers.get('location'), '/ofertas/3')
    const oferta = (await res.json()) as { modalidad: string }
    assert.equal(oferta.modalidad, 'remoto') // el valor por defecto
  })

  test('POST /ofertas con datos inválidos da 400', async () => {
    const res = await publicar({ titulo: 'X' })
    assert.equal(res.status, 400)
    const error = (await res.json()) as { detalles: string[] }
    assert.deepEqual(error.detalles, ['titulo', 'empresa'])
  })

  test('GET /ofertas/99 da 404', async () => {
    assert.equal((await fetch(`${base}/ofertas/99`)).status, 404)
  })
})
