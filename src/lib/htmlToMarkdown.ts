import TurndownService from 'turndown'
import { supabase, STORAGE_BUCKET } from './supabase'

// ─── Turndown setup ──────────────────────────────────────────────────────────
function createTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',           // # instead of underline
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  })

  // Google Docs wraps bold / italic in <span style="font-weight:700">, not <strong>.
  // Detect span styling and emit the right markdown.
  td.addRule('gdocs-span-bold', {
    filter: (node) => {
      if (node.nodeName !== 'SPAN') return false
      const weight = (node as HTMLElement).style.fontWeight
      return weight === 'bold' || Number(weight) >= 600
    },
    replacement: (content) => (content.trim() ? `**${content}**` : content),
  })

  td.addRule('gdocs-span-italic', {
    filter: (node) => {
      if (node.nodeName !== 'SPAN') return false
      return (node as HTMLElement).style.fontStyle === 'italic'
    },
    replacement: (content) => (content.trim() ? `*${content}*` : content),
  })

  // Drop Google Docs' outer wrapper <b id="docs-internal-guid-...">
  td.addRule('gdocs-wrapper', {
    filter: (node) =>
      node.nodeName === 'B' && /^docs-internal-guid-/.test((node as HTMLElement).id || ''),
    replacement: (content) => content,
  })

  // Strip empty paragraphs / spans that Google Docs leaves everywhere
  td.addRule('drop-empty', {
    filter: (node) => {
      const t = node.textContent?.trim() ?? ''
      return (node.nodeName === 'P' || node.nodeName === 'SPAN') && t === ''
    },
    replacement: () => '',
  })

  // Underline → no markdown equivalent, keep as plain text
  td.addRule('underline-plain', {
    filter: (node) => {
      if (node.nodeName !== 'SPAN') return false
      return (node as HTMLElement).style.textDecoration?.includes('underline') ?? false
    },
    replacement: (content) => content,
  })

  // Strikethrough — both semantic tags and Google Docs' span styling
  td.addRule('strikethrough-tag', {
    filter: ['s', 'del'],
    replacement: (content) => (content.trim() ? `~~${content}~~` : content),
  })

  td.addRule('strikethrough-span', {
    filter: (node) => {
      if (node.nodeName !== 'SPAN') return false
      return (node as HTMLElement).style.textDecoration?.includes('line-through') ?? false
    },
    replacement: (content) => (content.trim() ? `~~${content}~~` : content),
  })

  return td
}

// ─── Image collection for async upload ───────────────────────────────────────
export interface PasteImage {
  placeholder: string   // token inserted into markdown, replaced after upload
  src: string           // original src from pasted HTML
  alt: string
}

function collectImages(container: HTMLElement): PasteImage[] {
  const imgs = Array.from(container.querySelectorAll('img'))
  return imgs.map((img, i) => {
    const placeholder = `__CA_PASTE_IMG_${Date.now()}_${i}__`
    img.setAttribute('data-ca-placeholder', placeholder)
    const src = img.getAttribute('src') ?? ''
    const alt = img.getAttribute('alt') || `pasted-image-${i + 1}`
    // Replace the src with a marker inside an <img> so turndown emits ![alt](placeholder)
    img.setAttribute('src', placeholder)
    return { placeholder, src, alt }
  })
}

// ─── Upload a single pasted image ────────────────────────────────────────────
async function uploadPastedImage(image: PasteImage): Promise<string | null> {
  const { src } = image

  // Data URLs (base64) — what Google Docs usually gives us
  if (src.startsWith('data:image/')) {
    const match = src.match(/^data:(image\/[a-z+]+);base64,(.+)$/i)
    if (!match) return null
    const mime = match[1]
    const ext = mime.split('/')[1].split('+')[0].replace('jpeg', 'jpg')
    const binary = atob(match[2])
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: mime })
    const path = `pasted/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
      contentType: mime,
    })
    if (error) return null
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
  }

  // googleusercontent.com URLs — only you can view these, can't use them. Skip.
  if (/googleusercontent\.com|blogspot\.com/.test(src)) return null

  // Any public http(s) URL — leave as-is (already hosted somewhere public)
  if (/^https?:\/\//.test(src)) return src

  return null
}

// ─── Main conversion ─────────────────────────────────────────────────────────
export interface ConvertResult {
  markdown: string
  imagesFound: number
  imagesUploaded: number
  imagesFailed: number
}

export async function convertHtmlToMarkdown(html: string): Promise<ConvertResult> {
  // Parse into a DOM we can mutate before feeding to turndown
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const container = doc.body

  // Tag images with placeholders so we can swap in real URLs after upload
  const images = collectImages(container)

  // Convert to markdown
  const td = createTurndown()
  let markdown = td.turndown(container.innerHTML).trim()

  // Upload each image and substitute its placeholder in the markdown
  let uploaded = 0
  let failed = 0
  for (const image of images) {
    const url = await uploadPastedImage(image)
    if (url) {
      markdown = markdown.split(image.placeholder).join(url)
      uploaded++
    } else {
      // Strip the broken image line entirely
      markdown = markdown
        .split('\n')
        .filter(line => !line.includes(image.placeholder))
        .join('\n')
      failed++
    }
  }

  // Clean up Google-Docs-ish noise: multiple blank lines, trailing spaces
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim()

  return {
    markdown,
    imagesFound: images.length,
    imagesUploaded: uploaded,
    imagesFailed: failed,
  }
}
