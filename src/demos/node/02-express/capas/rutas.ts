import { Router } from 'express'
import { Filtros, OfertaNueva } from './ofertas.ts'
import type { ServicioOfertas } from './servicio.ts'

// Las rutas solo traducen HTTP: leen y validan el pedido, llaman al servicio y responden.
export function crearRutasOfertas(servicio: ServicioOfertas) {
  const rutas = Router()

  rutas.get('/', async (req, res) => {
    res.json(await servicio.listar(Filtros.parse(req.query)))
  })

  rutas.get('/:id', async (req, res) => {
    res.json(await servicio.obtener(Number(req.params.id)))
  })

  rutas.post('/', async (req, res) => {
    const oferta = await servicio.publicar(OfertaNueva.parse(req.body))
    res.status(201).location(`/ofertas/${oferta.id}`).json(oferta)
  })

  return rutas
}
