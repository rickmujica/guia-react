import { connect, type ConnectedProps } from 'react-redux'
import type { Action, State } from '../redux-vanilla/store'

// La forma "legacy": connect() con mapStateToProps y mapDispatchToProps.
// La vas a encontrar en proyectos viejos. En código nuevo, usá los hooks.
const mapStateToProps = (state: State) => ({ total: state.postulaciones.length })
const mapDispatchToProps = {
  limpiarFiltro: (): Action => ({ type: 'filtro/cambiado', payload: '' }),
}

const conector = connect(mapStateToProps, mapDispatchToProps)

function Total({ total, limpiarFiltro }: ConnectedProps<typeof conector>) {
  return (
    <p>
      Total (con connect): <strong>{total}</strong> <button onClick={limpiarFiltro}>Limpiar filtro</button>
    </p>
  )
}

const TotalConectado = conector(Total)
export default TotalConectado
