import type { MetaFunction } from 'react-router'
import AboutPage from '../../src/components/AboutPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'About — Curious Apes',
      description:
        'Meet Curious Apes — the creative and technology team building bold digital experiences and profitable growth for D2C brands.',
      path: '/about',
    },
    originFromMatches(matches),
  )

export default AboutPage
