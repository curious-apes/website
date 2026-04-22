import { supabase, STORAGE_BUCKET } from './supabase'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']

export async function uploadBlogImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Use PNG, JPG, WEBP, GIF, or SVG.`)
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 5 MB.`)
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeBase = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40) || 'image'
  const path = `${new Date().getFullYear()}/${safeBase}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
