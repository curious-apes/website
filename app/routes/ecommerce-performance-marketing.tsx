import type { MetaFunction } from 'react-router'
import EcommercePerformanceMarketingPage, { faqs } from '../../src/components/EcommercePerformanceMarketingPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) => {
  const base = buildMeta(
    {
      title: 'Ecommerce Performance Marketing Agency | Curious Apes',
      description:
        'Curious Apes is an ecommerce performance marketing agency helping D2C brands scale with paid media, SEO, CRO, analytics, and retention. Drive measurable growth and higher ROAS.',
      path: '/services/ecommerce-performance-marketing',
    },
    originFromMatches(matches),
  )

  // FAQPage structured data so Google can surface the Q&As as rich results.
  const faqSchema = {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  }

  return [...base, faqSchema]
}

export default EcommercePerformanceMarketingPage
