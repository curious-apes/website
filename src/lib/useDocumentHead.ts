import { useEffect } from 'react'

export interface DocumentHead {
  title?: string
  description?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  keywords?: string
}

const DEFAULTS = {
  title: 'Curious Apes — Creative & Tech Agency',
  description: 'Curious Apes — A creative and technology agency crafting bold digital experiences.',
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string | undefined) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!href) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useDocumentHead(head: DocumentHead) {
  useEffect(() => {
    const previousTitle = document.title

    if (head.title) document.title = head.title
    setMeta('meta[name="description"]', 'name', 'description', head.description)
    setMeta('meta[name="keywords"]', 'name', 'keywords', head.keywords)
    setLink('canonical', head.canonical)

    setMeta('meta[property="og:title"]', 'property', 'og:title', head.ogTitle ?? head.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', head.ogDescription ?? head.description)
    setMeta('meta[property="og:image"]', 'property', 'og:image', head.ogImage)
    setMeta('meta[property="og:url"]', 'property', 'og:url', head.ogUrl)
    setMeta('meta[property="og:type"]', 'property', 'og:type', head.ogType ?? 'website')

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', head.twitterCard ?? (head.ogImage ? 'summary_large_image' : 'summary'))
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', head.ogTitle ?? head.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', head.ogDescription ?? head.description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', head.ogImage)

    return () => {
      document.title = previousTitle
      // Reset the description back to the site default; remove transient OG/twitter tags
      setMeta('meta[name="description"]', 'name', 'description', DEFAULTS.description)
      setMeta('meta[name="keywords"]', 'name', 'keywords', undefined)
      setLink('canonical', undefined)
      setMeta('meta[property="og:title"]', 'property', 'og:title', undefined)
      setMeta('meta[property="og:description"]', 'property', 'og:description', undefined)
      setMeta('meta[property="og:image"]', 'property', 'og:image', undefined)
      setMeta('meta[property="og:url"]', 'property', 'og:url', undefined)
      setMeta('meta[property="og:type"]', 'property', 'og:type', undefined)
      setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', undefined)
      setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', undefined)
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', undefined)
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', undefined)
    }
  }, [
    head.title, head.description, head.canonical, head.keywords,
    head.ogTitle, head.ogDescription, head.ogImage, head.ogUrl, head.ogType,
    head.twitterCard,
  ])
}
