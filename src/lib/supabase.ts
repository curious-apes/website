import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Lazily create the client so that *importing* this module never throws — a
// missing env var must not crash the SSR server at boot (it's eagerly imported
// into the server bundle). The check still fires, but only on first actual use,
// where loaders catch it and degrade gracefully instead of taking down the page.
let _client: SupabaseClient | null = null
function getClient(): SupabaseClient {
  if (_client) return _client
  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (dev) and in your Vercel project (prod).'
    )
  }
  _client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return _client
}

// Drop-in replacement for the previous eager `supabase` export: every property
// access initialises the client on demand, so existing `supabase.from(...)` /
// `supabase.auth...` call sites work unchanged.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = Reflect.get(client as object, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export const STORAGE_BUCKET = 'blog-images'
