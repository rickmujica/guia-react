import { Highlight, themes } from 'prism-react-renderer'
import { useState, type CSSProperties } from 'react'
import { useColorScheme } from '../lib/useColorScheme'

function parseLines(spec?: string) {
  const lines = new Set<number>()
  for (const part of spec?.split(',') ?? []) {
    const [from, to = from] = part.split('-').map(Number)
    for (let n = from; n <= to; n++) lines.add(n)
  }
  return lines
}

type CodeBlockProps = {
  code: string
  language?: string
  /** Líneas a resaltar, por ejemplo "3,5-8" */
  highlight?: string
}

export function CodeBlock({ code, language = 'tsx', highlight }: CodeBlockProps) {
  const scheme = useColorScheme()
  const marked = parseLines(highlight)
  return (
    <Highlight
      code={code.trimEnd()}
      language={language}
      theme={scheme === 'dark' ? themes.oneDark : themes.oneLight}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`code ${className}`} style={{ ...style, background: 'var(--code-bg)' }}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line })
            const isMarked = marked.has(i + 1)
            // Sangría de la línea: en el PDF, si una línea larga se parte, la continuación
            // queda un poco más adentro que el inicio (ver .token-line en global.css).
            const text = line.map((token) => token.content).join('')
            const indent = text.length - text.trimStart().length
            return (
              <div
                key={i}
                {...lineProps}
                style={{ ...lineProps.style, '--indent': indent } as CSSProperties}
                className={`${lineProps.className}${isMarked ? ' code-line--marked' : ''}`}
              >
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button type="button" className="copy-button" onClick={copy}>
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}
