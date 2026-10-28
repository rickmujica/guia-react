import type { MDXComponents } from 'mdx/types'
import { AntesAhora, Entrevista, Nota, Ojo, Probalo, Tip, Version } from '../components/Callouts'
import { Demo, Source } from '../components/Demo'
import { Anchor, H2, H3, Pre, Table } from '../components/MdxElements'

// Componentes disponibles dentro de los .mdx sin necesidad de importarlos.
export const mdxComponents: MDXComponents = {
  pre: Pre,
  h2: H2,
  h3: H3,
  a: Anchor,
  table: Table,
  Demo,
  Source,
  Nota,
  Ojo,
  Tip,
  Probalo,
  Entrevista,
  AntesAhora,
  Version,
}
