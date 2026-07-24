import type { MetaFunction } from 'react-router'
import VisualsPage from '../../src/components/VisualsPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Creative Agency for Ecommerce Brands | Visuals That Convert',
      description:
        'Create scroll-stopping visuals and high-converting creatives for ads, social media, websites, and eCommerce campaigns that drive user engagement and sales.',
      path: '/services/visuals-creative',
    },
    originFromMatches(matches),
  )

export default VisualsPage
