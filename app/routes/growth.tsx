import type { MetaFunction } from 'react-router'
import GrowthPage from '../../src/components/GrowthPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Growth Marketing — Profitable Scaling | Curious Apes',
      description:
        'Full-funnel growth marketing that scales Indian D2C brands profitably — strategy, retention, and performance.',
      path: '/services/growth-marketing',
    },
    originFromMatches(matches),
  )

export default GrowthPage
