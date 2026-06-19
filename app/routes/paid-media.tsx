import type { MetaFunction } from 'react-router'
import PaidMediaPage from '../../src/components/PaidMediaPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Paid Media — Meta & Google Ads | Curious Apes',
      description:
        'Performance-driven Meta and Google Ads management that turns ad spend into profitable, scalable growth.',
      path: '/services/paid-media',
    },
    originFromMatches(matches),
  )

export default PaidMediaPage
