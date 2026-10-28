import { createElement, type ComponentProps, type ReactElement, type ReactNode } from 'react'
import { IS_PRINT } from '../lib/print'
import { slugify, textOf } from '../lib/text'
import { CodeBlock, CopyButton } from './CodeBlock'

export function Pre({ children }: ComponentProps<'pre'>) {
  const code = children as ReactElement<{ className?: string; children?: string }>
  const language = code.props.className?.replace('language-', '') ?? 'text'
  const text = String(code.props.children ?? '')
  return (
    <div className="code-static">
      {!IS_PRINT && <CopyButton text={text.trimEnd()} />}
      <CodeBlock code={text} language={language} />
    </div>
  )
}

// En la versión impresa los capítulos son h2, así que los títulos bajan un nivel.
function Heading({ level, children }: { level: number; children?: ReactNode }) {
  const tag = `h${IS_PRINT ? level + 1 : level}`
  return createElement(tag, IS_PRINT ? {} : { id: slugify(textOf(children)) }, children)
}

export const H2 = ({ children }: { children?: ReactNode }) => <Heading level={2}>{children}</Heading>
export const H3 = ({ children }: { children?: ReactNode }) => <Heading level={3}>{children}</Heading>

export function Anchor({ href = '', children }: ComponentProps<'a'>) {
  if (href.startsWith('#/')) {
    // Link a otro capítulo: en el PDF apunta al ancla del capítulo.
    return <a href={IS_PRINT ? `#cap-${href.slice(2)}` : href}>{children}</a>
  }
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function Table(props: ComponentProps<'table'>) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  )
}
