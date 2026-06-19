import { data, Link } from 'react-router'
import type { MetaFunction } from 'react-router'
import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'

export function loader() {
  // Real 404 status so unknown URLs aren't treated as soft-200s by crawlers.
  return data(null, { status: 404 })
}

export const meta: MetaFunction = () => [
  { title: 'Page not found — Curious Apes' },
  { name: 'robots', content: 'noindex' },
]

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 16,
          padding: '120px 24px',
        }}
      >
        <p style={{ color: 'var(--accent-sand)', letterSpacing: '0.2em', fontWeight: 600 }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 56px)' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 420 }}>
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
          Back home
        </Link>
      </main>
      <Footer />
    </>
  )
}
