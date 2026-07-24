import type { MetaFunction } from 'react-router'
import PaidMediaPage from '../../src/components/PaidMediaPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Paid Media Agency for D2C Brands | Meta & Google Ads Experts',
      description:
        'Scale faster with data-driven paid media services. We manage Meta Ads, Google Ads, audience targeting, creative testing, and ROAS-focused campaigns.',
      path: '/services/paid-media',
    },
    originFromMatches(matches),
  )

export default PaidMediaPage
