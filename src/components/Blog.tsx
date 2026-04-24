import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPublishedBlogs, type BlogPost } from '../lib/blogs'
import './Blog.css'

gsap.registerPlugin(ScrollTrigger)

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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        delay: index * 0.08,
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
      }
    )
  }, [index])

  const displayDate = new Date(post.date).toLocaleDateString('en-IN', {
    month: 'short', year: 'numeric',
  })

  return (
    <article ref={cardRef} className={`blog-card ${post.featured ? 'blog-card--featured' : ''}`}>
      {post.ogImage && (
        <Link to={`/blog/${post.slug}`} className="blog-card__image-link" aria-label={post.title}>
          <img className="blog-card__image" src={post.ogImage} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="blog-card__inner">
        <div className="blog-card__top">
          <span
            className="blog-card__tag"
            style={{
              background: tagColors[post.tag] ?? 'rgba(255,255,255,0.06)',
              color:      tagText[post.tag]   ?? 'var(--text-muted)',
            }}
          >
            {post.tag}
          </span>
          {post.featured && <span className="blog-card__featured-badge">Featured</span>}
        </div>

        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>

        <div className="blog-card__footer">
          <div className="blog-card__meta">
            <span className="blog-card__date">{displayDate}</span>
            {post.readTime && (
              <>
                <span className="blog-card__sep">·</span>
                <span className="blog-card__read">{post.readTime} read</span>
              </>
            )}
          </div>
          <Link to={`/blog/${post.slug}`} className="blog-card__cta" aria-label={`Read ${post.title}`}>
            Read more
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className="blog-card__glow" />
    </article>
  )
}

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    let active = true
    getPublishedBlogs()
      .then(p => { if (active) setPosts(p) })
      .catch(err => {
        console.error('Failed to load blog posts:', err)
        if (active) setPosts([])
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (posts.length === 0 || !sectionRef.current || !headRef.current) return

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
        )
      }

      const lines = headRef.current!.querySelectorAll('.blog__line-inner')
      if (lines.length > 0) {
        gsap.fromTo(lines,
          { y: 80, opacity: 0, skewY: 2 },
          { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.1, ease: 'power4.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
        )
      }

      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 88%' } }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [posts])

  if (posts.length === 0) return null

  const featured = posts.find(p => p.featured) ?? posts[0]
  const rest = posts.filter(p => p.id !== featured.id).slice(0, 4)
  const isSingle = posts.length === 1

  return (
    <section id="blog" ref={sectionRef} className="blog">
      <div className="container">

        <div className="blog__header">
          <div ref={labelRef} className="section-label">From the Desk</div>
          <div ref={headRef} className="blog__headline">
            <div className="blog__line"><span className="blog__line-inner">Insights &amp;</span></div>
            <div className="blog__line"><span className="blog__line-inner blog__line-inner--grad">Playbooks.</span></div>
          </div>
          <p className="blog__intro">
            Real strategies. Real numbers. No fluff — just what's working for Indian D2C brands right now.
          </p>
        </div>

        {/* Featured post — full width when there's a grid below, capped/centered when alone */}
        <div className={isSingle ? 'blog__single' : ''}>
          <BlogCard post={featured} index={0} />
        </div>

        {/* Secondary grid */}
        {rest.length > 0 && (
          <div className="blog__grid">
            {rest.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i + 1} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div ref={ctaRef} className="blog__bottom-cta">
          <p className="blog__bottom-text">Want strategies like these for your brand?</p>
          <a href="#contact" className="btn btn--primary">
            Let's Talk Growth
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
