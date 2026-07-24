import type { LoaderFunctionArgs } from 'react-router'
import { getPublishedBlogs } from '../../src/lib/blogs'

// Static, indexable routes and their relative priority / change cadence.
// (admin, thankyou, and 404 are intentionally excluded — they're noindex.)
const STATIC_ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/paid-media', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/growth-marketing', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ecommerce-performance-marketing', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/visuals-creative', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/tech-cro', priority: '0.9', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
]

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry(loc: string, lastmod?: string, changefreq?: string, priority?: string): string {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority ? `    <priority>${priority}</priority>` : '',
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin

  const entries: string[] = STATIC_ROUTES.map((r) =>
    urlEntry(origin + r.path, undefined, r.changefreq, r.priority),
  )

  // Append every published blog post. Never let a data hiccup break the whole
  // sitemap — degrade to just the static routes if Supabase is unreachable.
  try {
    const posts = await getPublishedBlogs()
    for (const post of posts) {
      const lastmod = (post.updatedAt || post.date || '').slice(0, 10) || undefined
      entries.push(
        urlEntry(`${origin}/blog/${post.slug}`, lastmod, 'monthly', '0.7'),
      )
    }
  } catch (err) {
    console.error('sitemap: failed to load blog posts', err)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Cache at the edge for an hour; crawlers don't need real-time freshness.
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
