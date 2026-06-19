import type { MetaFunction } from 'react-router'
import ThankYouPage from '../../src/components/ThankYouPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Thank You — Curious Apes',
      description: 'Thanks for reaching out. We’ll be in touch shortly.',
      path: '/thankyou',
      noindex: true,
    },
    originFromMatches(matches),
  )

export default ThankYouPage
