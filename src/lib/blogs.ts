// ─────────────────────────────────────────────
//  BLOG DATA LAYER  (localStorage → Supabase-ready)
// ─────────────────────────────────────────────

export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  // Content
  title: string
  slug: string
  tag: string
  excerpt: string
  content: string      // markdown / rich text body
  // SEO
  seoTitle: string     // <title> tag override (falls back to title)
  seoDescription: string  // meta description
  seoKeywords: string  // comma-separated
  ogImage: string      // Open Graph image URL
  canonicalUrl: string // optional canonical override
  // Meta
  status: BlogStatus
  featured: boolean
  readTime: string     // e.g. "5 min"
  date: string         // ISO date string, display date
  createdAt: string    // ISO 8601 — set on create
  updatedAt: string    // ISO 8601 — set on every save
}

const KEY = 'ca_blogs'

// ─── seed defaults so the site isn't blank on first load ──────────────────────
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How We Scaled a D2C Brand from ₹0 to ₹30L/Month in 4 Months',
    slug: 'meta-ads-d2c-scale',
    tag: 'Meta Ads',
    excerpt: 'A deep-dive into the exact Meta Ads framework we used — audience stacking, creative iteration cycles, and budget scaling rules that actually hold.',
    content: '',
    seoTitle: 'D2C Meta Ads Case Study: ₹0 to ₹30L/Month | Curious Apes',
    seoDescription: 'How Curious Apes scaled a D2C brand from zero to ₹30 lakh per month in just 4 months using Meta Ads audience stacking and creative iteration.',
    seoKeywords: 'meta ads, d2c marketing, facebook ads india, performance marketing',
    ogImage: '',
    canonicalUrl: '',
    status: 'published',
    featured: true,
    readTime: '7 min',
    date: '2025-03-01',
    createdAt: '2025-03-01T09:00:00.000Z',
    updatedAt: '2025-03-01T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Why UGC Outperforms Studio Ads for Indian D2C Brands',
    slug: 'ugc-creative-strategy',
    tag: 'Creative Strategy',
    excerpt: "Raw, authentic content consistently beats polished studio creative on Meta. Here's the data behind that claim and how we build winning UGC pipelines.",
    content: '',
    seoTitle: 'UGC vs Studio Ads for Indian D2C | Curious Apes',
    seoDescription: 'Data-backed comparison of UGC vs studio creative for Indian D2C brands on Meta Ads, plus how to build a winning UGC pipeline.',
    seoKeywords: 'ugc ads, user generated content, d2c creatives, meta ads india',
    ogImage: '',
    canonicalUrl: '',
    status: 'published',
    featured: false,
    readTime: '5 min',
    date: '2025-02-01',
    createdAt: '2025-02-01T09:00:00.000Z',
    updatedAt: '2025-02-01T09:00:00.000Z',
  },
  {
    id: '3',
    title: 'The 12-Point CRO Checklist We Run on Every New Shopify Store',
    slug: 'cro-shopify-checklist',
    tag: 'CRO & Shopify',
    excerpt: 'Before we touch ads, we audit the store. These 12 conversion rate optimisations can add 15–40% revenue without spending a single extra rupee on traffic.',
    content: '',
    seoTitle: '12-Point Shopify CRO Checklist | Curious Apes',
    seoDescription: 'The exact 12-point CRO audit Curious Apes runs on every new Shopify store before launching paid ads.',
    seoKeywords: 'shopify cro, conversion rate optimisation, shopify checklist, d2c shopify',
    ogImage: '',
    canonicalUrl: '',
    status: 'published',
    featured: false,
    readTime: '6 min',
    date: '2025-01-01',
    createdAt: '2025-01-01T09:00:00.000Z',
    updatedAt: '2025-01-01T09:00:00.000Z',
  },
  {
    id: '4',
    title: 'Performance Max vs Standard Shopping: Which Wins for D2C in India?',
    slug: 'google-ads-pmax-vs-standard',
    tag: 'Google Ads',
    excerpt: "We ran both side-by-side across 8 brands. The results surprised us. Here's when to use PMax, when to avoid it, and how to structure both correctly.",
    content: '',
    seoTitle: 'Performance Max vs Standard Shopping India | Curious Apes',
    seoDescription: 'Head-to-head Google Ads comparison: Performance Max vs Standard Shopping across 8 Indian D2C brands.',
    seoKeywords: 'performance max, google shopping ads, pmax india, d2c google ads',
    ogImage: '',
    canonicalUrl: '',
    status: 'published',
    featured: false,
    readTime: '8 min',
    date: '2024-12-01',
    createdAt: '2024-12-01T09:00:00.000Z',
    updatedAt: '2024-12-01T09:00:00.000Z',
  },
  {
    id: '5',
    title: 'Email + SMS Flows That Recovered ₹12L in Lost Revenue',
    slug: 'email-sms-retention-flows',
    tag: 'Retention',
    excerpt: 'Abandoned cart, browse abandonment, post-purchase — the three automation flows that every D2C brand needs running before they scale paid media.',
    content: '',
    seoTitle: 'Email & SMS Retention Flows for D2C | Curious Apes',
    seoDescription: 'The three email + SMS automation flows that recovered ₹12 lakh in lost revenue for our D2C clients.',
    seoKeywords: 'email marketing d2c, sms flows, klaviyo india, retention marketing',
    ogImage: '',
    canonicalUrl: '',
    status: 'published',
    featured: false,
    readTime: '5 min',
    date: '2024-11-01',
    createdAt: '2024-11-01T09:00:00.000Z',
    updatedAt: '2024-11-01T09:00:00.000Z',
  },
]

function load(): BlogPost[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_POSTS))
      return DEFAULT_POSTS
    }
    const parsed = JSON.parse(raw)
    // Validate it's a non-empty array of objects with required fields
    if (!Array.isArray(parsed) || parsed.length === 0 || typeof parsed[0]?.id === 'undefined') {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_POSTS))
      return DEFAULT_POSTS
    }
    // Backfill any missing fields added in later versions
    return parsed.map((p: Partial<BlogPost>): BlogPost => ({
      id: p.id ?? crypto.randomUUID(),
      title: p.title ?? '',
      slug: p.slug ?? '',
      tag: p.tag ?? '',
      excerpt: p.excerpt ?? '',
      content: p.content ?? '',
      seoTitle: p.seoTitle ?? '',
      seoDescription: p.seoDescription ?? '',
      seoKeywords: p.seoKeywords ?? '',
      ogImage: p.ogImage ?? '',
      canonicalUrl: p.canonicalUrl ?? '',
      status: p.status ?? 'draft',
      featured: p.featured ?? false,
      readTime: p.readTime ?? '',
      date: p.date ?? new Date().toISOString().slice(0, 10),
      createdAt: p.createdAt ?? new Date().toISOString(),
      updatedAt: p.updatedAt ?? new Date().toISOString(),
    }))
  } catch {
    return DEFAULT_POSTS
  }
}

function save(posts: BlogPost[]) {
  localStorage.setItem(KEY, JSON.stringify(posts))
  // Notify same-tab listeners (cross-tab listeners get the native storage event)
  window.dispatchEvent(new CustomEvent('ca_blogs_updated'))
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getBlogs(): BlogPost[] {
  return load().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPublishedBlogs(): BlogPost[] {
  return getBlogs().filter(p => p.status === 'published')
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return load().find(p => p.slug === slug)
}

export function saveBlog(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const posts = load()
  const now = new Date().toISOString()
  const post: BlogPost = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  posts.unshift(post)
  save(posts)
  return post
}

export function updateBlog(id: string, data: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | null {
  const posts = load()
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  posts[idx] = { ...posts[idx], ...data, updatedAt: new Date().toISOString() }
  save(posts)
  return posts[idx]
}

export function deleteBlog(id: string): void {
  save(load().filter(p => p.id !== id))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
