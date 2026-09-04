import type { MetaFunction } from 'react-router'
import ScalePage from '../../src/components/ScalePage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Scale your D2C brand profitably | Curious Apes',
      description:
        'Stuck below profitable ROAS or stuck at breakeven? Curious Apes helps Indian D2C brands scale profitably. ₹50Cr+ ad budget managed, ₹200Cr+ revenue generated, 4x average ROAS.',
      path: '/scale',
      noindex: true,
    },
    originFromMatches(matches),
  )

export default ScalePage
