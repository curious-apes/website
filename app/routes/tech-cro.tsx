import type { MetaFunction } from 'react-router'
import TechCROPage from '../../src/components/TechCROPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'CRO & Ecommerce Development Agency | Tech Solutions for Growth',
      description:
        'Improve conversions with CRO, landing page optimization, analytics, tracking, and eCommerce technology solutions designed to maximize revenue.',
      path: '/services/tech-cro',
    },
    originFromMatches(matches),
  )

export default TechCROPage
