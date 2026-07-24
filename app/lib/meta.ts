import type { MetaDescriptor } from 'react-router'

export interface PageMetaInput {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

/** Build full SEO + OpenGraph + Twitter meta with absolute URLs (so social
 *  link previews resolve correctly). `origin` comes from the root loader. */
/** Shared social-share image used when a page doesn't set its own. Lives at a
 *  stable, crawlable public URL (social scrapers can't read hashed asset URLs). */
const DEFAULT_OG_IMAGE = '/og-default.png'

export function buildMeta(input: PageMetaInput, origin: string): MetaDescriptor[] {
  const url = origin + input.path
  const rawImage = input.image ?? DEFAULT_OG_IMAGE
  const image = rawImage.startsWith('http') ? rawImage : origin + rawImage

  // Explicit, self-referencing robots directive on every indexable page. Tells
  // Google to allow full snippets, large image previews, and full video previews.
  const robots = input.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

  const tags: MetaDescriptor[] = [
    { title: input.title },
    { name: 'description', content: input.description },
    { name: 'robots', content: robots },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: input.description },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Curious Apes' },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: input.description },
    { name: 'twitter:image', content: image },
  ]
  return tags
}

/** Extract the request origin that the root loader exposed. */
export function originFromMatches(matches: Array<{ id: string; data: unknown } | undefined>): string {
  const root = matches?.find((m) => m?.id === 'root') as { data?: { origin?: string } } | undefined
  return root?.data?.origin ?? ''
}
