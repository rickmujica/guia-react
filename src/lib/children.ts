import { isValidElement, type ReactNode } from 'react'

/**
 * El texto de un bloque de código de MDX, que llega a un componente como children
 * (<pre><code>…</code></pre>). Lo usan <Consulta> y <Api>.
 */
export function textoDe(nodo: ReactNode): string {
  if (typeof nodo === 'string') return nodo
  if (Array.isArray(nodo)) return nodo.map(textoDe).join('')
  if (isValidElement<{ children?: ReactNode }>(nodo)) return textoDe(nodo.props.children)
  return ''
}
