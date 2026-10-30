// La plantilla de Vite activa "erasableSyntaxOnly": solo se permite sintaxis de TypeScript
// que se pueda borrar sin cambiar el JavaScript. Es lo que también exige Node.js para
// ejecutar archivos .ts directo. Los enum generan código, así que quedan afuera:

// @ts-expect-error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
enum EstadoEnum {
  Postulado,
  Entrevista,
}

// La alternativa moderna: una unión de literales...
type Estado = 'postulado' | 'entrevista' | 'oferta'

// ...o un objeto "as const" si además querés los valores en runtime (para listarlos, por ejemplo).
const ESTADO = {
  Postulado: 'postulado',
  Entrevista: 'entrevista',
  Oferta: 'oferta',
} as const

type EstadoDesdeObjeto = (typeof ESTADO)[keyof typeof ESTADO] // 'postulado' | 'entrevista' | 'oferta'

function mover(estado: EstadoDesdeObjeto) {
  return estado === ESTADO.Oferta ? '¡Felicitaciones!' : 'Seguimos'
}
mover(ESTADO.Entrevista)
mover('oferta') // también vale el string directo
