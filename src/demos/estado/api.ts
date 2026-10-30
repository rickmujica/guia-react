// API falsa compartida por las demos de estado global: responde con demora y puede fallar.
import { sleep } from '../shared/utils'

export type Etapa = 'postulado' | 'entrevista' | 'oferta' | 'rechazado'
export type Postulacion = { id: number; empresa: string; etapa: Etapa }

const iniciales: Postulacion[] = [
  { id: 1, empresa: 'Nubelia', etapa: 'entrevista' },
  { id: 2, empresa: 'Pagos Sur', etapa: 'postulado' },
  { id: 3, empresa: 'Andes Labs', etapa: 'postulado' },
]

const empresas = [
  'Andes Labs',
  'Banco Austral',
  'Cumbre Data',
  'Delta Pay',
  'Estudio Norte',
  'Fintual Sur',
  'Globant Lite',
  'Hornero Apps',
  'Mate Cloud',
  'Nubelia',
  'Pagos Sur',
  'Pampa Health',
  'Quebracho AI',
  'Remoto.dev',
  'Tereré Tech',
  'Yerba Labs',
]

let siguienteId = 100

export const api = {
  /** La lista de postulaciones. Con falla: true, el "servidor" responde con error. */
  async listar({ falla = false } = {}): Promise<Postulacion[]> {
    await sleep(700)
    if (falla) throw new Error('500: el servidor no responde')
    return iniciales.map((p) => ({ ...p }))
  },

  async crear(empresa: string): Promise<Postulacion> {
    await sleep(400)
    return { id: siguienteId++, empresa, etapa: 'postulado' }
  },

  /** Busca empresas. Tarda más con textos cortos, para que se note la cancelación. */
  async buscarEmpresas(texto: string): Promise<string[]> {
    await sleep(texto.length < 3 ? 1200 : 500)
    const t = texto.toLowerCase()
    return empresas.filter((e) => e.toLowerCase().includes(t))
  },

  /** Cuántas ofertas nuevas hay (para la demo de polling). */
  async ofertasNuevas(): Promise<number> {
    await sleep(300)
    return Math.floor(Math.random() * 5)
  },

  /** Una respuesta lenta: entre 0,5 y 3 segundos (para la demo de timeout). */
  async lenta(): Promise<string> {
    const ms = 500 + Math.random() * 2500
    await sleep(ms)
    return `respondió en ${(ms / 1000).toFixed(1).replace('.', ',')} s`
  },
}

export const siguienteEtapa: Record<Etapa, Etapa> = {
  postulado: 'entrevista',
  entrevista: 'oferta',
  oferta: 'oferta',
  rechazado: 'rechazado',
}
