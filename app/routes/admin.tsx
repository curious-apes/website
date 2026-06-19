import type { MetaFunction } from 'react-router'
import { ClientOnly } from '../components/ClientOnly'
import AdminApp from '../../src/admin/AdminApp'

// Admin is auth-gated with no SEO value, so it renders client-only and is kept
// out of search indexes.
export const meta: MetaFunction = () => [
  { title: 'Admin — Curious Apes' },
  { name: 'robots', content: 'noindex, nofollow' },
]

export default function AdminRoute() {
  return <ClientOnly>{() => <AdminApp />}</ClientOnly>
}
