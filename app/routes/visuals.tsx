import type { MetaFunction } from 'react-router'
import VisualsPage from '../../src/components/VisualsPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Visuals & Creative — Content That Converts | Curious Apes',
      description:
        'Scroll-stopping creative and content built to convert — from performance ads to brand storytelling.',
      path: '/services/visuals-creative',
    },
    originFromMatches(matches),
  )

export default VisualsPage
