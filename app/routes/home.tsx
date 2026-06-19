import type { MetaFunction } from 'react-router'
import App from '../../src/App'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Curious Apes — Creative & Tech Agency',
      description:
        'Curious Apes — A creative and technology agency crafting bold digital experiences for ambitious D2C brands.',
      path: '/',
    },
    originFromMatches(matches),
  )

export default App
