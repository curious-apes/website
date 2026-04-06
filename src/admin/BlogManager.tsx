import { useState, useEffect, useCallback } from 'react'
import {
  getBlogs, saveBlog, updateBlog, deleteBlog, slugify,
  type BlogPost, type BlogStatus,
} from '../lib/blogs'

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
  const [slugManual, setSlugManual] = useState(!!post)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    if (!form.slug.trim())  { setError('Slug is required'); return }
    setSaving(true)
    if (post) {
      updateBlog(post.id, form)
    } else {
      saveBlog(form)
    }
    setSaving(false)
    onSave()
  }

  const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="blg-field">
      <label className="blg-field__label">{label}</label>
      {children}
      {hint && <span className="blg-field__hint">{hint}</span>}
    </div>
  )

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

              <Field label="Full Article Content">
                <textarea
                  className="blg-input blg-textarea blg-textarea--tall"
                  rows={14}
                  value={form.content}
                  onChange={e => set('content', e.target.value)}
                  placeholder="Write your article here (markdown supported)…"
                />
              </Field>

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

              <Field label="OG Image URL" hint="Recommended: 1200×630px. Used in social media link previews.">
                <input
                  className="blg-input"
                  value={form.ogImage}
                  onChange={e => set('ogImage', e.target.value)}
                  placeholder="https://curiousapes.in/og/post-name.jpg"
                />
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

  const refresh = useCallback(() => setPosts(getBlogs()), [])
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

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog post? This cannot be undone.')) {
      deleteBlog(id)
      refresh()
    }
  }

  const handleToggleStatus = (post: BlogPost) => {
    updateBlog(post.id, { status: post.status === 'published' ? 'draft' : 'published' })
    refresh()
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
        {filtered.length === 0 ? (
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
