import type { MetaFunction } from 'react-router'
import GrowthPage from '../../src/components/GrowthPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Growth Marketing Agency for D2C Brands | Curious Apes',
      description:
        'Accelerate customer acquisition, retention, and revenue with growth marketing strategies designed for scaling D2C and eCommerce brands.',
      path: '/services/growth-marketing',
    },
    originFromMatches(matches),
  )

export default GrowthPage
