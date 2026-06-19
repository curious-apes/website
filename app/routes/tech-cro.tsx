import type { MetaFunction } from 'react-router'
import TechCROPage from '../../src/components/TechCROPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Tech & CRO — End-to-End eCommerce | Curious Apes',
      description:
        'Shopify development and conversion rate optimization that turn more of your traffic into revenue.',
      path: '/services/tech-cro',
    },
    originFromMatches(matches),
  )

export default TechCROPage
