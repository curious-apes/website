import type React from 'react'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(raw: string): string {
  let s = escapeHtml(raw)
  s = s.replace(/`([^`]+?)`/g, '<code class="bpp__inline-code">$1</code>')
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|#[^\s)]*)\)/g,
    '<a class="bpp__link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  return s
}

export function renderMarkdown(content: string): React.ReactNode[] | null {
  if (!content.trim()) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={`pre-${i}`} className="bpp__codeblock">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(line)) {
      const m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)!
      elements.push(
        <img key={i} className="bpp__image" src={m[2]} alt={m[1]} loading="lazy" />
      )
    } else if (/^-{3,}\s*$/.test(line) || /^\*{3,}\s*$/.test(line)) {
      elements.push(<hr key={i} className="bpp__hr" />)
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="bpp__h1" dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="bpp__h2" dangerouslySetInnerHTML={{ __html: inline(line.slice(3)) }} />
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="bpp__h3" dangerouslySetInnerHTML={{ __html: inline(line.slice(4)) }} />
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="bpp__ul">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(item) }} />
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="bpp__ol">
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inline(item) }} />
          ))}
        </ol>
      )
      continue
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="bpp__blockquote" dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />
      )
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="bpp__p" dangerouslySetInnerHTML={{ __html: inline(line) }} />
      )
    }
    i++
  }

  return elements
}
