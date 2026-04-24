import { supabase } from './supabase'

export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  id: string
  title: string
  slug: string
  tag: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  ogImage: string
  canonicalUrl: string
  status: BlogStatus
  featured: boolean
  readTime: string
  date: string
  createdAt: string
  updatedAt: string
}

const SELECT_COLS = `
  id, title, slug, tag, excerpt, content,
  seoTitle:seo_title,
  seoDescription:seo_description,
  seoKeywords:seo_keywords,
  ogImage:og_image,
  canonicalUrl:canonical_url,
  status, featured,
  readTime:read_time,
  date,
  createdAt:created_at,
  updatedAt:updated_at
`

type BlogWriteable = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>

function toDbPayload(post: Partial<BlogWriteable>) {
  const out: Record<string, unknown> = {}
  if (post.title           !== undefined) out.title           = post.title
  if (post.slug            !== undefined) out.slug            = post.slug
  if (post.tag             !== undefined) out.tag             = post.tag
  if (post.excerpt         !== undefined) out.excerpt         = post.excerpt
  if (post.content         !== undefined) out.content         = post.content
  if (post.seoTitle        !== undefined) out.seo_title       = post.seoTitle
  if (post.seoDescription  !== undefined) out.seo_description = post.seoDescription
  if (post.seoKeywords     !== undefined) out.seo_keywords    = post.seoKeywords
  if (post.ogImage         !== undefined) out.og_image        = post.ogImage
  if (post.canonicalUrl    !== undefined) out.canonical_url   = post.canonicalUrl
  if (post.status          !== undefined) out.status          = post.status
  if (post.featured        !== undefined) out.featured        = post.featured
  if (post.readTime        !== undefined) out.read_time       = post.readTime
  if (post.date            !== undefined) out.date            = post.date
  return out
}

export async function getBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(SELECT_COLS)
    .order('date', { ascending: false })
  if (error) throw error
  return (data ?? []) as BlogPost[]
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  // Public listing requires both: status='published' AND a cover image.
  // A published post without a featured image is treated as not-yet-ready.
  const { data, error } = await supabase
    .from('blogs')
    .select(SELECT_COLS)
    .eq('status', 'published')
    .neq('og_image', '')
    .order('date', { ascending: false })
  if (error) throw error
  return (data ?? []) as BlogPost[]
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase
    .from('blogs')
    .select(SELECT_COLS)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return (data ?? undefined) as BlogPost | undefined
}

export async function saveBlog(data: BlogWriteable): Promise<BlogPost> {
  const { data: row, error } = await supabase
    .from('blogs')
    .insert(toDbPayload(data))
    .select(SELECT_COLS)
    .single()
  if (error) throw error
  return row as BlogPost
}

export async function updateBlog(
  id: string,
  patch: Partial<BlogWriteable>
): Promise<BlogPost | null> {
  const { data: row, error } = await supabase
    .from('blogs')
    .update(toDbPayload(patch))
    .eq('id', id)
    .select(SELECT_COLS)
    .maybeSingle()
  if (error) throw error
  return (row ?? null) as BlogPost | null
}

export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
