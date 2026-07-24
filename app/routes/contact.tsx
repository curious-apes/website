import type { MetaFunction } from 'react-router'
import ContactPage from '../../src/components/ContactPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Contact Curious Apes | Ecommerce Growth & Marketing Experts',
      description:
        'Connect with Curious Apes to discuss paid media, growth marketing, creative production, CRO, and eCommerce growth solutions for your brand.',
      path: '/contact',
    },
    originFromMatches(matches),
  )

export default ContactPage
