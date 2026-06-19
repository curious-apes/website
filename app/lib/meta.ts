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
export function buildMeta(input: PageMetaInput, origin: string): MetaDescriptor[] {
  const url = origin + input.path
  const image = input.image
    ? input.image.startsWith('http')
      ? input.image
      : origin + input.image
    : undefined

  const tags: MetaDescriptor[] = [
    { title: input.title },
    { name: 'description', content: input.description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: input.description },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Curious Apes' },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: input.description },
  ]
  if (image) {
    tags.push({ property: 'og:image', content: image })
    tags.push({ name: 'twitter:image', content: image })
  }
  if (input.noindex) tags.push({ name: 'robots', content: 'noindex' })
  return tags
}

/** Extract the request origin that the root loader exposed. */
export function originFromMatches(matches: Array<{ id: string; data: unknown } | undefined>): string {
  const root = matches?.find((m) => m?.id === 'root') as { data?: { origin?: string } } | undefined
  return root?.data?.origin ?? ''
}
