import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getBlogs, saveBlog, updateBlog, deleteBlog, slugify,
  type BlogPost, type BlogStatus,
} from '../lib/blogs'
import { uploadBlogImage } from '../lib/storage'
import { renderMarkdown } from '../lib/markdown'
import { convertHtmlToMarkdown } from '../lib/htmlToMarkdown'

// ─── Markdown toolbar actions ─────────────────────────────────────────────────
type ToolbarAction =
  | { kind: 'wrap'; before: string; after: string; placeholder: string }
  | { kind: 'linePrefix'; prefix: string }
  | { kind: 'insertBlock'; template: string; selectStart: number; selectEnd: number }

function applyAction(
  el: HTMLTextAreaElement,
  action: ToolbarAction,
  setValue: (next: string) => void
) {
  const { selectionStart: s, selectionEnd: e, value } = el

  if (action.kind === 'wrap') {
    const selected = value.slice(s, e) || action.placeholder
    const next = value.slice(0, s) + action.before + selected + action.after + value.slice(e)
    setValue(next)
    requestAnimationFrame(() => {
      el.focus()
      const cs = s + action.before.length
      const ce = cs + selected.length
      el.setSelectionRange(cs, ce)
    })
    return
  }

  if (action.kind === 'linePrefix') {
    const lineStart = value.lastIndexOf('\n', s - 1) + 1
    const lineEnd = value.indexOf('\n', e)
    const end = lineEnd === -1 ? value.length : lineEnd
    const block = value.slice(lineStart, end)
    const prefixed = block
      .split('\n')
      .map(ln => (ln.startsWith(action.prefix) ? ln : action.prefix + ln))
      .join('\n')
    const next = value.slice(0, lineStart) + prefixed + value.slice(end)
    setValue(next)
    requestAnimationFrame(() => {
      el.focus()
      const newEnd = lineStart + prefixed.length
      el.setSelectionRange(newEnd, newEnd)
    })
    return
  }

  if (action.kind === 'insertBlock') {
    const needsNewlineBefore = s > 0 && value[s - 1] !== '\n'
    const prefix = needsNewlineBefore ? '\n' : ''
    const block = prefix + action.template
    const next = value.slice(0, s) + block + value.slice(e)
    setValue(next)
    requestAnimationFrame(() => {
      el.focus()
      const cs = s + prefix.length + action.selectStart
      const ce = s + prefix.length + action.selectEnd
      el.setSelectionRange(cs, ce)
    })
  }
}

type ToolbarButton = {
  label: string
  title: string
  action: ToolbarAction
}

const TOOLBAR_BUTTONS: Array<ToolbarButton | 'divider'> = [
  { label: 'H1', title: 'Heading 1',    action: { kind: 'linePrefix', prefix: '# ' } },
  { label: 'H2', title: 'Heading 2',    action: { kind: 'linePrefix', prefix: '## ' } },
  { label: 'H3', title: 'Heading 3',    action: { kind: 'linePrefix', prefix: '### ' } },
  'divider',
  { label: 'B',  title: 'Bold (Ctrl+B)',   action: { kind: 'wrap', before: '**', after: '**', placeholder: 'bold text' } },
  { label: 'I',  title: 'Italic (Ctrl+I)', action: { kind: 'wrap', before: '*',  after: '*',  placeholder: 'italic text' } },
  { label: '<>', title: 'Inline code',     action: { kind: 'wrap', before: '`',  after: '`',  placeholder: 'code' } },
  'divider',
  { label: '• List',  title: 'Bullet list',   action: { kind: 'linePrefix', prefix: '- ' } },
  { label: '1. List', title: 'Numbered list', action: { kind: 'linePrefix', prefix: '1. ' } },
  { label: '" Quote', title: 'Blockquote',    action: { kind: 'linePrefix', prefix: '> ' } },
  'divider',
  { label: 'Link',  title: 'Link',       action: { kind: 'wrap', before: '[', after: '](https://)', placeholder: 'link text' } },
  { label: 'Image', title: 'Image',      action: { kind: 'insertBlock', template: '![alt text](https://)\n', selectStart: 2, selectEnd: 10 } },
  { label: '—',     title: 'Horizontal rule', action: { kind: 'insertBlock', template: '\n---\n\n', selectStart: 5, selectEnd: 5 } },
  { label: '{ }',   title: 'Code block', action: { kind: 'insertBlock', template: '```\ncode\n```\n', selectStart: 4, selectEnd: 8 } },
]

// ─── Tag options ──────────────────────────────────────────────────────────────
const TAG_OPTIONS = [
  'Meta Ads', 'Google Ads', 'Creative Strategy',
  'CRO & Shopify', 'Retention', 'D2C Strategy',
  'Brand Identity', 'Analytics', 'Email & SMS',
]

// ─── Empty form state ─────────────────────────────────────────────────────────
function emptyForm(): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: '',
    slug: '',
    tag: TAG_OPTIONS[0],
    excerpt: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
    canonicalUrl: '',
    status: 'draft',
    featured: false,
    readTime: '',
    date: new Date().toISOString().slice(0, 10),
  }
}

// ─── SEO Score helper ─────────────────────────────────────────────────────────
function seoScore(form: ReturnType<typeof emptyForm>): { score: number; tips: string[] } {
  const tips: string[] = []
  let score = 0

  if (form.seoTitle.length >= 30 && form.seoTitle.length <= 60) score += 20
  else tips.push(`SEO title: ${form.seoTitle.length === 0 ? 'missing' : form.seoTitle.length < 30 ? 'too short (30–60 chars)' : 'too long (30–60 chars)'}`)

  if (form.seoDescription.length >= 120 && form.seoDescription.length <= 160) score += 20
  else tips.push(`Meta description: ${form.seoDescription.length === 0 ? 'missing' : form.seoDescription.length < 120 ? 'too short (120–160 chars)' : 'too long (120–160 chars)'}`)

  if (form.seoKeywords.trim().length > 0) score += 15
  else tips.push('Add focus keywords')

  if (form.slug.length > 0 && !form.slug.includes(' ')) score += 15
  else tips.push('Slug should be lowercase with hyphens')

  if (form.excerpt.length >= 80) score += 15
  else tips.push('Excerpt too short (80+ chars recommended)')

  if (form.ogImage.length > 0) score += 15
  else tips.push('Add OG image URL for social sharing')

  return { score, tips }
}

// ─── Char counter colour ──────────────────────────────────────────────────────
function charColor(len: number, min: number, max: number): string {
  if (len === 0) return 'rgba(220,245,245,0.3)'
  if (len < min) return '#f59e0b'
  if (len > max) return '#f87171'
  return '#34d399'
}

// ─── Field wrapper (module-scoped so it stays mounted across renders) ────────
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="blg-field">
      <label className="blg-field__label">{label}</label>
      {children}
      {hint && <span className="blg-field__hint">{hint}</span>}
    </div>
  )
}

// ─── Blog list row ────────────────────────────────────────────────────────────
function BlogRow({ post, onEdit, onDelete, onToggleStatus }: {
  post: BlogPost
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
}) {
  return (
    <tr>
      <td className="adm-table__name" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {post.featured && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 100, background: 'rgba(0,196,212,0.12)', color: '#00c4d4'
            }}>Featured</span>
          )}
          {post.title}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(220,245,245,0.35)', fontWeight: 400 }}>/{post.slug}</span>
      </td>
      <td>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
          background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
        }}>{post.tag}</span>
      </td>
      <td>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus() }}
          className={`adm-status-btn ${post.status === 'published' ? 'is-active' : ''}`}
          style={{ '--sc': post.status === 'published' ? '#10b981' : '#6b7280' } as React.CSSProperties}
        >
          {post.status === 'published' ? 'Published' : 'Draft'}
        </button>
      </td>
      <td className="adm-muted">{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
      <td className="adm-muted">{post.readTime}</td>
      <td>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-icon-btn" onClick={(e) => { e.stopPropagation(); onEdit() }} aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="adm-icon-btn" style={{ color: '#f87171' }} onClick={(e) => { e.stopPropagation(); onDelete() }} aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5 3.5V2h4v1.5M4.5 3.5l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Blog Editor (create / edit) ──────────────────────────────────────────────
function BlogEditor({ post, onSave, onCancel }: {
  post: BlogPost | null   // null = create new
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>(
    post ? {
      title: post.title, slug: post.slug, tag: post.tag,
      excerpt: post.excerpt, content: post.content,
      seoTitle: post.seoTitle, seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords, ogImage: post.ogImage,
      canonicalUrl: post.canonicalUrl,
      status: post.status, featured: post.featured,
      readTime: post.readTime, date: post.date,
    } : emptyForm()
  )
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
  const [contentMode, setContentMode] = useState<'write' | 'preview'>('write')
  const [slugManual, setSlugManual] = useState(!!post)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const runAction = (action: ToolbarAction) => {
    if (!contentRef.current) return
    applyAction(contentRef.current, action, (next) => set('content', next))
  }

  const onContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return
    const k = e.key.toLowerCase()
    if (k === 'b') {
      e.preventDefault()
      runAction({ kind: 'wrap', before: '**', after: '**', placeholder: 'bold text' })
    } else if (k === 'i') {
      e.preventDefault()
      runAction({ kind: 'wrap', before: '*', after: '*', placeholder: 'italic text' })
    } else if (k === 'k') {
      e.preventDefault()
      runAction({ kind: 'wrap', before: '[', after: '](https://)', placeholder: 'link text' })
    }
  }

  // ── Paste handler: convert Google Docs / rich HTML to markdown ──────────────
  const [pasteStatus, setPasteStatus] = useState<string>('')

  const onContentPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html')
    if (!html || !html.trim()) return // plain-text paste — let textarea handle it

    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const beforeValue = el.value

    setPasteStatus('Converting pasted content…')
    try {
      const result = await convertHtmlToMarkdown(html)

      const inserted = result.markdown
      const next = beforeValue.slice(0, start) + inserted + beforeValue.slice(end)
      set('content', next)

      requestAnimationFrame(() => {
        if (!contentRef.current) return
        contentRef.current.focus()
        const pos = start + inserted.length
        contentRef.current.setSelectionRange(pos, pos)
      })

      if (result.imagesFound > 0) {
        const parts: string[] = []
        if (result.imagesUploaded > 0) parts.push(`${result.imagesUploaded} image${result.imagesUploaded !== 1 ? 's' : ''} uploaded`)
        if (result.imagesFailed > 0)   parts.push(`${result.imagesFailed} skipped (not accessible)`)
        setPasteStatus(`Pasted · ${parts.join(', ')}`)
      } else {
        setPasteStatus('Pasted and formatted.')
      }
      setTimeout(() => setPasteStatus(''), 4000)
    } catch (err) {
      console.error('Paste conversion failed:', err)
      setPasteStatus('Could not convert pasted content — fell back to plain text.')
      // Fallback: insert plain text manually
      const plain = e.clipboardData.getData('text/plain')
      const next = beforeValue.slice(0, start) + plain + beforeValue.slice(end)
      set('content', next)
      setTimeout(() => setPasteStatus(''), 4000)
    }
  }

  const set = (key: keyof typeof form, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }))

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && form.title) set('slug', slugify(form.title))
  }, [form.title, slugManual]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fill SEO title from title
  useEffect(() => {
    if (!form.seoTitle && form.title) set('seoTitle', `${form.title} | Curious Apes`)
  }, [form.title]) // eslint-disable-line react-hooks/exhaustive-deps

  const { score, tips } = seoScore(form)

  const scoreColor = score >= 80 ? '#34d399' : score >= 50 ? '#f59e0b' : '#f87171'
  const scoreLabel = score >= 80 ? 'Good' : score >= 50 ? 'Needs work' : 'Poor'

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.slug.trim())  { setError('Slug is required'); return }
    if (saving) return
    setSaving(true)
    setError('')
    try {
      if (post) {
        await updateBlog(post.id, form)
      } else {
        await saveBlog(form)
      }
      onSave()
    } catch (err) {
      console.error('Failed to save blog post:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Could not save: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  // ── Image upload — OG image field ──────────────────────────────────────────
  const ogFileRef = useRef<HTMLInputElement>(null)
  const [ogUploading, setOgUploading] = useState(false)
  const [ogUploadError, setOgUploadError] = useState('')

  const handleOgUpload = async (file: File) => {
    setOgUploading(true)
    setOgUploadError('')
    try {
      const url = await uploadBlogImage(file)
      set('ogImage', url)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setOgUploadError(msg)
    } finally {
      setOgUploading(false)
    }
  }

  // ── Image upload — inline (from toolbar) ───────────────────────────────────
  const inlineFileRef = useRef<HTMLInputElement>(null)
  const [inlineUploading, setInlineUploading] = useState(false)

  const handleInlineUpload = async (file: File) => {
    if (!contentRef.current) return
    setInlineUploading(true)
    try {
      const url = await uploadBlogImage(file)
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
      const template = `![${alt}](${url})\n`
      applyAction(
        contentRef.current,
        { kind: 'insertBlock', template, selectStart: template.length, selectEnd: template.length },
        (next) => set('content', next)
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      alert(`Image upload failed: ${msg}`)
    } finally {
      setInlineUploading(false)
    }
  }

  return (
    <div className="blg-editor-overlay">
      <div className="blg-editor">
        {/* Header */}
        <div className="blg-editor__head">
          <div>
            <h2 className="blg-editor__title">{post ? 'Edit Post' : 'New Blog Post'}</h2>
            <p className="blg-editor__sub">{post ? post.title : 'Fill content and SEO fields below'}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* SEO score pill */}
            <div className="blg-seo-pill" style={{ '--sc': scoreColor } as React.CSSProperties}>
              <span className="blg-seo-pill__score">{score}</span>
              <span className="blg-seo-pill__label">SEO · {scoreLabel}</span>
            </div>
            <button className="adm-icon-btn" onClick={onCancel} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="blg-editor__tabs">
          {(['content', 'seo'] as const).map(t => (
            <button
              key={t}
              className={`blg-editor__tab ${activeTab === t ? 'is-active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'content' ? 'Content' : 'SEO & Meta'}
              {t === 'seo' && tips.length > 0 && (
                <span className="blg-editor__tab-badge">{tips.length}</span>
              )}
            </button>
          ))}
        </div>

        <form className="blg-editor__body" onSubmit={handleSubmit}>
          {error && <p className="blg-editor__error">{error}</p>}

          {/* ── CONTENT TAB ── */}
          {activeTab === 'content' && (
            <div className="blg-editor__section">

              <div className="blg-two-col">
                <Field label="Status">
                  <select
                    className="blg-input"
                    value={form.status}
                    onChange={e => set('status', e.target.value as BlogStatus)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </Field>
                <Field label="Category / Tag">
                  <select
                    className="blg-input"
                    value={form.tag}
                    onChange={e => set('tag', e.target.value)}
                  >
                    {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Post Title *">
                <input
                  className="blg-input"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="How We Scaled a Brand from ₹0 to ₹30L/Month"
                />
              </Field>

              <Field label="URL Slug *">
                <div className="blg-slug-wrap">
                  <span className="blg-slug-prefix">/blog/</span>
                  <input
                    className="blg-input blg-input--slug"
                    value={form.slug}
                    onChange={e => { setSlugManual(true); set('slug', slugify(e.target.value)) }}
                    placeholder="meta-ads-d2c-scale"
                  />
                  <button
                    type="button"
                    className="blg-slug-regen"
                    onClick={() => { setSlugManual(false); set('slug', slugify(form.title)) }}
                    title="Re-generate from title"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6a5 5 0 1 0 1-2.9M1 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </Field>

              <Field label="Excerpt (shown on Blog cards)" hint={`${form.excerpt.length} chars · aim for 120–200`}>
                <textarea
                  className="blg-input blg-textarea"
                  rows={3}
                  value={form.excerpt}
                  onChange={e => set('excerpt', e.target.value)}
                  placeholder="A short summary shown in the blog card grid…"
                />
              </Field>

              <div className="blg-field">
                <div className="blg-content-head">
                  <label className="blg-field__label">Full Article Content</label>
                  <div className="blg-content-tabs" role="tablist">
                    <button
                      type="button"
                      className={`blg-content-tab ${contentMode === 'write' ? 'is-active' : ''}`}
                      onClick={() => setContentMode('write')}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      className={`blg-content-tab ${contentMode === 'preview' ? 'is-active' : ''}`}
                      onClick={() => setContentMode('preview')}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {contentMode === 'write' ? (
                  <div className="blg-md-wrap">
                    <div className="blg-md-toolbar">
                      {TOOLBAR_BUTTONS.map((btn, idx) =>
                        btn === 'divider' ? (
                          <span key={`div-${idx}`} className="blg-md-toolbar__divider" aria-hidden="true" />
                        ) : (
                          <button
                            key={btn.title}
                            type="button"
                            className="blg-md-btn"
                            title={btn.title}
                            aria-label={btn.title}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => runAction(btn.action)}
                            data-label={btn.label}
                          >
                            {btn.label}
                          </button>
                        )
                      )}
                      <span className="blg-md-toolbar__divider" aria-hidden="true" />
                      <input
                        ref={inlineFileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) handleInlineUpload(f)
                          e.target.value = ''
                        }}
                      />
                      <button
                        type="button"
                        className="blg-md-btn"
                        title="Upload an image into the post"
                        aria-label="Upload image"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => inlineFileRef.current?.click()}
                        disabled={inlineUploading}
                      >
                        {inlineUploading ? 'Uploading…' : '📤 Upload'}
                      </button>
                    </div>
                    <textarea
                      ref={contentRef}
                      className="blg-input blg-textarea blg-textarea--tall blg-md-textarea"
                      rows={14}
                      value={form.content}
                      onChange={e => set('content', e.target.value)}
                      onKeyDown={onContentKeyDown}
                      onPaste={onContentPaste}
                      placeholder="Write your article here — or paste from Google Docs and formatting will be preserved."
                      spellCheck
                    />
                    {pasteStatus && (
                      <div className="blg-paste-status">{pasteStatus}</div>
                    )}
                  </div>
                ) : (
                  <div className="blg-md-preview bpp__article">
                    {form.content.trim()
                      ? renderMarkdown(form.content)
                      : <p className="blg-md-preview__empty">Nothing to preview yet — write something in the editor.</p>
                    }
                  </div>
                )}
                <span className="blg-field__hint">
                  Shortcuts: <strong>Ctrl+B</strong> bold, <strong>Ctrl+I</strong> italic, <strong>Ctrl+K</strong> link
                </span>
              </div>

              <div className="blg-two-col">
                <Field label="Publish Date">
                  <input
                    type="date"
                    className="blg-input"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                  />
                </Field>
                <Field label="Read Time">
                  <input
                    className="blg-input"
                    value={form.readTime}
                    onChange={e => set('readTime', e.target.value)}
                    placeholder="5 min"
                  />
                </Field>
              </div>

              <label className="blg-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                />
                <span>Feature this post (shown as the wide card at top of Blog section)</span>
              </label>

              {form.status === 'published' && !form.ogImage && (
                <div className="blg-publish-warning">
                  ⚠️ This post is set to <strong>Published</strong> but has no cover image. It won't appear on the public blog page until you add one in the <strong>SEO &amp; Meta</strong> tab → <strong>OG / Cover Image</strong>.
                </div>
              )}

            </div>
          )}

          {/* ── SEO TAB ── */}
          {activeTab === 'seo' && (
            <div className="blg-editor__section">

              {/* Tips */}
              {tips.length > 0 && (
                <div className="blg-seo-tips">
                  <p className="blg-seo-tips__head">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="5.5" stroke="#f59e0b" strokeWidth="1.2"/>
                      <path d="M6.5 4v3M6.5 9v.5" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    {tips.length} issue{tips.length !== 1 ? 's' : ''} to fix
                  </p>
                  <ul>
                    {tips.map(t => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}

              {/* SEO Score bar */}
              <div className="blg-score-bar-wrap">
                <div className="blg-score-bar">
                  <div
                    className="blg-score-bar__fill"
                    style={{ width: `${score}%`, background: scoreColor }}
                  />
                </div>
                <span style={{ fontSize: 12, color: scoreColor, fontWeight: 700 }}>{score}/100 — {scoreLabel}</span>
              </div>

              <Field
                label="SEO Title (browser tab / Google headline)"
                hint={`${form.seoTitle.length} / 60 chars`}
              >
                <input
                  className="blg-input"
                  value={form.seoTitle}
                  onChange={e => set('seoTitle', e.target.value)}
                  placeholder="Post Title | Curious Apes"
                  style={{ borderColor: charColor(form.seoTitle.length, 30, 60) }}
                />
                <div className="blg-char-bar">
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (form.seoTitle.length / 60) * 100)}%`,
                    background: charColor(form.seoTitle.length, 30, 60),
                    borderRadius: 2,
                    transition: 'width 0.2s, background 0.2s',
                  }} />
                </div>
              </Field>

              <Field
                label="Meta Description (Google snippet)"
                hint={`${form.seoDescription.length} / 160 chars`}
              >
                <textarea
                  className="blg-input blg-textarea"
                  rows={3}
                  value={form.seoDescription}
                  onChange={e => set('seoDescription', e.target.value)}
                  placeholder="A compelling 120–160 character description that appears in Google search results…"
                  style={{ borderColor: charColor(form.seoDescription.length, 120, 160) }}
                />
                <div className="blg-char-bar">
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (form.seoDescription.length / 160) * 100)}%`,
                    background: charColor(form.seoDescription.length, 120, 160),
                    borderRadius: 2,
                    transition: 'width 0.2s, background 0.2s',
                  }} />
                </div>
              </Field>

              <Field label="Focus Keywords" hint="Comma-separated, e.g. meta ads, d2c marketing india">
                <input
                  className="blg-input"
                  value={form.seoKeywords}
                  onChange={e => set('seoKeywords', e.target.value)}
                  placeholder="meta ads, d2c marketing, performance marketing india"
                />
              </Field>

              <Field label="OG / Cover Image" hint="Recommended: 1200×630px. Used as cover and in social link previews. Upload or paste a URL.">
                <div className="blg-image-row">
                  <input
                    className="blg-input"
                    value={form.ogImage}
                    onChange={e => set('ogImage', e.target.value)}
                    placeholder="https://… or click Upload"
                  />
                  <input
                    ref={ogFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) handleOgUpload(f)
                      e.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    className="adm-btn adm-btn--outline blg-image-upload-btn"
                    onClick={() => ogFileRef.current?.click()}
                    disabled={ogUploading}
                  >
                    {ogUploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
                {ogUploadError && <span className="blg-image-error">{ogUploadError}</span>}
                {form.ogImage && !ogUploading && (
                  <div className="blg-image-preview">
                    <img src={form.ogImage} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </Field>

              <Field label="Canonical URL" hint="Leave blank to use default page URL. Set only if this content exists elsewhere.">
                <input
                  className="blg-input"
                  value={form.canonicalUrl}
                  onChange={e => set('canonicalUrl', e.target.value)}
                  placeholder="https://curiousapes.in/blog/post-slug"
                />
              </Field>

              {/* Google preview */}
              <div className="blg-serp-preview">
                <p className="blg-serp-preview__label">Google Preview</p>
                <div className="blg-serp-card">
                  <div className="blg-serp-card__site">curiousapes.in › blog › {form.slug || 'post-slug'}</div>
                  <div className="blg-serp-card__title">
                    {form.seoTitle || form.title || 'Post title will appear here'}
                  </div>
                  <div className="blg-serp-card__desc">
                    {form.seoDescription || form.excerpt || 'Meta description will appear here in Google search results.'}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer actions */}
          <div className="blg-editor__footer">
            <button type="button" className="adm-btn adm-btn--outline" onClick={onCancel}>
              Cancel
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                className="adm-btn"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#c8dada' }}
                onClick={() => set('status', 'draft')}
                disabled={saving}
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="adm-btn adm-btn--primary"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={() => set('status', 'published')}
                disabled={saving}
              >
                {saving ? 'Saving…' : post ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main BlogManager ─────────────────────────────────────────────────────────
// editing: null = list view, 'new' = create form, BlogPost = edit form
export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<BlogPost | 'new' | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<BlogStatus | 'all'>('all')

  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setPosts(await getBlogs())
    } catch (err) {
      console.error('Failed to load blog posts:', err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const filtered = posts.filter(p => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || p.slug.includes(q)
    return matchStatus && matchSearch
  })

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.featured).length,
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return
    try {
      await deleteBlog(id)
      await refresh()
    } catch (err) {
      console.error('Failed to delete blog post:', err)
      alert('Could not delete post. Please try again.')
    }
  }

  const handleToggleStatus = async (post: BlogPost) => {
    try {
      await updateBlog(post.id, { status: post.status === 'published' ? 'draft' : 'published' })
      await refresh()
    } catch (err) {
      console.error('Failed to toggle status:', err)
      alert('Could not update status. Please try again.')
    }
  }

  return (
    <>
      <div className="adm-header">
        <div>
          <h1 className="adm-header__title">Blog Posts</h1>
          <p className="adm-header__sub">Manage content, SEO, and publishing</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="adm-header__search">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder="Search posts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="adm-btn adm-btn--primary"
            style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
            onClick={() => setEditing('new')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="adm-stats">
        <div className="adm-stat"><span className="adm-stat__value">{stats.total}</span><span className="adm-stat__label">Total</span></div>
        <div className="adm-stat"><span className="adm-stat__value">{stats.published}</span><span className="adm-stat__label">Published</span><span className="adm-stat__sub">Live on site</span></div>
        <div className="adm-stat"><span className="adm-stat__value">{stats.draft}</span><span className="adm-stat__label">Drafts</span></div>
        <div className="adm-stat"><span className="adm-stat__value">{stats.featured}</span><span className="adm-stat__label">Featured</span><span className="adm-stat__sub">Wide card</span></div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {(['all', 'published', 'draft'] as const).map(f => (
          <button
            key={f}
            className={`adm-sidebar__nav-item ${filterStatus === f ? 'is-active' : ''}`}
            style={{ width: 'auto', padding: '7px 16px' }}
            onClick={() => setFilterStatus(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="adm-sidebar__nav-count">
              {f === 'all' ? posts.length : posts.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-empty"><p>Loading blog posts…</p></div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
              <path d="M16 24h16M24 16v16" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p>{search ? 'No posts found' : 'No blog posts yet — create your first one!'}</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title / Slug</th>
                <th>Tag</th>
                <th>Status</th>
                <th>Date</th>
                <th>Read Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <BlogRow
                  key={post.id}
                  post={post}
                  onEdit={() => setEditing(post)}
                  onDelete={() => handleDelete(post.id)}
                  onToggleStatus={() => handleToggleStatus(post)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor overlay */}
      {editing !== null && (
        <BlogEditor
          post={editing === 'new' ? null : editing}
          onSave={() => { refresh(); setEditing(null) }}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  )
}
