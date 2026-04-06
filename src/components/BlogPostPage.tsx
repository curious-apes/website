import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { getBlogBySlug, type BlogPost } from '../lib/blogs'
import PopupForm from './PopupForm'
import './BlogPostPage.css'

const tagColors: Record<string, string> = {
  'Meta Ads':          'rgba(0,196,212,0.12)',
  'Creative Strategy': 'rgba(139,92,246,0.12)',
  'CRO & Shopify':     'rgba(16,185,129,0.12)',
  'Google Ads':        'rgba(245,158,11,0.12)',
  'Retention':         'rgba(239,68,68,0.12)',
  'D2C Strategy':      'rgba(0,196,212,0.12)',
  'Brand Identity':    'rgba(236,72,153,0.12)',
  'Analytics':         'rgba(99,102,241,0.12)',
  'Email & SMS':       'rgba(245,158,11,0.12)',
}

const tagText: Record<string, string> = {
  'Meta Ads':          '#00c4d4',
  'Creative Strategy': '#a78bfa',
  'CRO & Shopify':     '#34d399',
  'Google Ads':        '#fbbf24',
  'Retention':         '#f87171',
  'D2C Strategy':      '#00c4d4',
  'Brand Identity':    '#f472b6',
  'Analytics':         '#818cf8',
  'Email & SMS':       '#fbbf24',
}

function renderContent(content: string) {
  if (!content.trim()) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="bpp__h1">{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="bpp__h2">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="bpp__h3">{line.slice(4)}</h3>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="bpp__ul">
          {items.map((item, j) => <li key={j}>{item}</li>)}
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
          {items.map((item, j) => <li key={j}>{item}</li>)}
        </ol>
      )
      continue
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} className="bpp__blockquote">{line.slice(2)}</blockquote>)
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      const html = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bpp__inline-code">$1</code>')
      elements.push(<p key={i} className="bpp__p" dangerouslySetInnerHTML={{ __html: html }} />)
    }
    i++
  }

  return elements
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  // ── Live-wired to admin: re-read from localStorage on any blog update ──────
  const [post, setPost] = useState<BlogPost | undefined>(
    () => slug ? getBlogBySlug(slug) : undefined
  )

  useEffect(() => {
    const refresh = () => setPost(slug ? getBlogBySlug(slug) : undefined)
    window.addEventListener('ca_blogs_updated', refresh)  // same-tab admin changes
    window.addEventListener('storage', refresh)            // cross-tab changes
    return () => {
      window.removeEventListener('ca_blogs_updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [slug])

  // ── Scroll to top on slug change ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // ── Intercept all href="#contact" clicks → open popup ─────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a[href="#contact"]')
      if (!target) return
      e.preventDefault()
      openPopup()
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openPopup])

  // ── Entry animations ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!post || !heroRef.current) return
    gsap.fromTo(heroRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.1 }
    )
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.35 }
      )
    }
  }, [post])

  // ── 404 state ─────────────────────────────────────────────────────────────
  if (!post || post.status !== 'published') {
    return (
      <div className="bpp-not-found">
        <div className="container">
          <p className="bpp-not-found__label">404</p>
          <h1 className="bpp-not-found__title">Post not found</h1>
          <p className="bpp-not-found__sub">This post may have been removed or isn't published yet.</p>
          <button className="bpp-back-btn" onClick={() => navigate('/#blog')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  const displayDate = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const hasContent = post.content.trim().length > 0

  return (
    <>
      <div className="bpp">
        {/* Nav bar */}
        <nav className="bpp__nav">
          <div className="container">
            <button className="bpp-back-btn" onClick={() => navigate('/#blog')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Blog
            </button>
          </div>
        </nav>

        {/* Hero */}
        <header className="bpp__hero" ref={heroRef}>
          <div className="container bpp__hero-inner">
            <div className="bpp__hero-meta">
              <span
                className="bpp__tag"
                style={{
                  background: tagColors[post.tag] ?? 'rgba(255,255,255,0.06)',
                  color: tagText[post.tag] ?? 'var(--text-muted)',
                }}
              >
                {post.tag}
              </span>
              {post.featured && <span className="bpp__featured-badge">Featured</span>}
            </div>

            <h1 className="bpp__title">{post.title}</h1>
            <p className="bpp__excerpt">{post.excerpt}</p>

            <div className="bpp__byline">
              <div className="bpp__avatar">CA</div>
              <div className="bpp__byline-info">
                <span className="bpp__author">Curious Apes</span>
                <span className="bpp__date-read">
                  {displayDate}
                  {post.readTime && <> · {post.readTime} read</>}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article body */}
        <main className="bpp__body" ref={contentRef}>
          <div className="container bpp__body-inner">
            {hasContent ? (
              <article className="bpp__article">
                {renderContent(post.content)}
              </article>
            ) : (
              <div className="bpp__coming-soon">
                <div className="bpp__coming-soon__icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="rgba(0,196,212,0.3)" strokeWidth="1.5"/>
                    <path d="M20 12v8l5 5" stroke="#00c4d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="bpp__coming-soon__title">Full article coming soon</h2>
                <p className="bpp__coming-soon__sub">
                  The full content for this post hasn't been published yet.<br/>
                  In the meantime, get in touch to discuss this topic directly.
                </p>
                <a href="#contact" className="btn btn--primary" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', width: 'auto', padding: '14px 32px', marginTop: 8 }}>
                  Let's Talk
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            )}

            {/* CTA footer */}
            <div className="bpp__cta">
              <p className="bpp__cta__text">Want strategies like these for your brand?</p>
              <a href="#contact" className="btn btn--primary" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', width: 'auto', padding: '14px 32px' }}>
                Let's Talk Growth
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
