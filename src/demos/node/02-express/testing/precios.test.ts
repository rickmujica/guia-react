import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { rangoSalarial } from './precios.ts'

describe('rangoSalarial', () => {
  test('con mínimo y máximo', () => {
    assert.equal(rangoSalarial(3000, 4000), 'USD 3000 – 4000')
  })

  test('sin datos', () => {
    assert.equal(rangoSalarial(null, null), 'A convenir')
  })

  test('solo uno de los dos', () => {
    assert.equal(rangoSalarial(null, 4000), 'Hasta USD 4000')
    assert.equal(rangoSalarial(3000, null), 'Desde USD 3000')
  })

  test('mínimo mayor que máximo tira un error', () => {
    assert.throws(() => rangoSalarial(5000, 4000), RangeError)
  })
})
