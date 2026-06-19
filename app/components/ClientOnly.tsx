import { useEffect, useState, type ReactNode } from 'react'

/**
 * Renders children only after the component has mounted in the browser.
 * Used to keep client-only subtrees (e.g. the auth-gated admin panel) out of
 * the server-rendered HTML so they never touch localStorage / window on the server.
 */
export function ClientOnly({ children, fallback = null }: { children: () => ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return <>{mounted ? children() : fallback}</>
}
