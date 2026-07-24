import type { MetaFunction } from 'react-router'
import AboutPage from '../../src/components/AboutPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'About Curious Apes | D2C Growth & Ecommerce Marketing Experts',
      description:
        'Learn how Curious Apes helps D2C brands grow through performance marketing, creative strategy, CRO, and technology solutions focused on measurable results.',
      path: '/about',
    },
    originFromMatches(matches),
  )

export default AboutPage
