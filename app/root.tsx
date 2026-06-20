import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router'
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from 'react-router'
import '../src/index.css'

// Expose the request origin so every route's meta() can build absolute
// OpenGraph / canonical URLs (needed for social link previews to resolve).
export function loader({ request }: LoaderFunctionArgs) {
  return { origin: new URL(request.url).origin }
}

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
  { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96.png' },
  { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
  { rel: 'apple-touch-icon', sizes: '192x192', href: '/favicon-192.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
  },
]

export const meta: MetaFunction = () => [
  { title: 'Curious Apes — Creative & Tech Agency' },
  {
    name: 'description',
    content:
      'Curious Apes — A creative and technology agency crafting bold digital experiences.',
  },
]

// Set the saved theme on <html> before first paint to avoid a flash and to keep
// the SSR markup consistent with what ThemeToggle reads on hydration.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('ca_theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

const GA_ID = 'G-9FRHBYW2FG'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

// Renders inside <Layout> for any thrown error / 404 so visitors never see a
// raw serverless crash page.
export function ErrorBoundary() {
  const error = useRouteError()
  let title = 'Something went wrong'
  let message = 'An unexpected error occurred. Please try again.'

  if (isRouteErrorResponse(error)) {
    title = String(error.status)
    message =
      error.status === 404
        ? 'The page you’re looking for doesn’t exist or may have moved.'
        : error.statusText || (typeof error.data === 'string' ? error.data : message)
  }

  return (
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
        fontFamily: 'var(--font-body, sans-serif)',
        color: 'var(--text-primary, #f0fafa)',
        background: 'var(--bg-primary, #0a0a0a)',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 'clamp(32px, 6vw, 56px)' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted, rgba(220,245,245,0.6))', maxWidth: 440 }}>{message}</p>
      <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Back home
      </a>
    </main>
  )
}
