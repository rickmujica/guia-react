import type { ComponentType } from 'react'
import Botones from './componentes/Botones'
import Confirmar from './componentes/Confirmar'
import PrimeraPantalla from './componentes/PrimeraPantalla'
import Flexbox from './estilos/Flexbox'
import Tema from './estilos/Tema'
import Postulacion from './formularios/Postulacion'
import Deslizar from './interaccion/Deslizar'
import Rebote from './interaccion/Rebote'
import ListaOfertas from './listas/ListaOfertas'
import ListaPorModalidad from './listas/ListaPorModalidad'

// Las mismas demos que se ven en la guía (allá con react-native-web, dentro de un celular
// dibujado). Acá corren de verdad en tu teléfono: pestaña "Demos" de la app.
export type Demo = { id: string; titulo: string; capitulo: string; Componente: ComponentType }

export const demos: Demo[] = [
  { id: 'primera-pantalla', titulo: 'View, Text y ScrollView', capitulo: 'Componentes', Componente: PrimeraPantalla },
  { id: 'botones', titulo: 'Pressable, Button y Switch', capitulo: 'Componentes', Componente: Botones },
  { id: 'confirmar', titulo: 'Modal', capitulo: 'Componentes', Componente: Confirmar },
  { id: 'flexbox', titulo: 'Flexbox', capitulo: 'Estilos', Componente: Flexbox },
  { id: 'tema', titulo: 'Tema y Platform', capitulo: 'Estilos', Componente: Tema },
  { id: 'lista-ofertas', titulo: 'FlatList con búsqueda', capitulo: 'Listas', Componente: ListaOfertas },
  { id: 'lista-por-modalidad', titulo: 'SectionList', capitulo: 'Listas', Componente: ListaPorModalidad },
  { id: 'postulacion', titulo: 'Formulario y teclado', capitulo: 'Formularios', Componente: Postulacion },
  { id: 'rebote', titulo: 'Animated', capitulo: 'Interacción', Componente: Rebote },
  { id: 'deslizar', titulo: 'Arrastrar una tarjeta', capitulo: 'Interacción', Componente: Deslizar },
]
