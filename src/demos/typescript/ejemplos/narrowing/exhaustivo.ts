type Estado = 'postulado' | 'entrevista' | 'oferta' | 'rechazado'

// Si un día agregás un estado nuevo, este helper hace que el switch deje de compilar
// hasta que lo manejes: en el default, "estado" tendría que ser never.
function sinCasoFaltante(valor: never): never {
  throw new Error(`Caso no manejado: ${String(valor)}`)
}

function color(estado: Estado) {
  switch (estado) {
    case 'postulado':
      return 'gris'
    case 'entrevista':
      return 'azul'
    case 'oferta':
      return 'verde'
    case 'rechazado':
      return 'rojo'
    default:
      return sinCasoFaltante(estado) // estado es never: no queda ninguna opción
  }
}

type EstadoNuevo = Estado | 'archivado'

function colorIncompleto(estado: EstadoNuevo) {
  switch (estado) {
    case 'postulado':
    case 'entrevista':
    case 'oferta':
    case 'rechazado':
      return 'algún color'
    default:
      // @ts-expect-error: Argument of type '"archivado"' is not assignable to parameter of type 'never'.
      return sinCasoFaltante(estado)
  }
}
