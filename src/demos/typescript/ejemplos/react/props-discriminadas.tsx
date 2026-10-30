// Props que dependen de otra prop: una unión discriminada evita combinaciones inválidas.
type AvisoProps =
  | { tipo: 'exito'; mensaje: string }
  | { tipo: 'error'; mensaje: string; reintentar: () => void } // reintentar solo existe en error

export function Aviso(props: AvisoProps) {
  if (props.tipo === 'error') {
    return (
      <p role="alert">
        {props.mensaje} <button onClick={props.reintentar}>Reintentar</button>
      </p>
    )
  }
  return <p>{props.mensaje}</p>
}

export function Uso() {
  return (
    <>
      <Aviso tipo="exito" mensaje="Guardado" />
      <Aviso tipo="error" mensaje="Falló" reintentar={() => {}} />
      {/* @ts-expect-error: falta reintentar, que es obligatorio cuando tipo es "error". */}
      <Aviso tipo="error" mensaje="Falló" />
    </>
  )
}

// No hace falta React.FC: una función con props tipadas alcanza y se lee mejor.
// (React.FC ya no agrega children implícitos, pero tampoco suma nada.)
