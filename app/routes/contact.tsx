import type { MetaFunction } from 'react-router'
import ContactPage from '../../src/components/ContactPage'
import { buildMeta, originFromMatches } from '../lib/meta'

export const meta: MetaFunction = ({ matches }) =>
  buildMeta(
    {
      title: 'Contact — Curious Apes',
      description: 'Let’s talk growth. Get in touch with Curious Apes to scale your brand.',
      path: '/contact',
    },
    originFromMatches(matches),
  )

export default ContactPage
