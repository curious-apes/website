import type { SupabaseClient } from '@supabase/supabase-js'

// Load the Supabase client lazily so the ~50 KB (gzip) supabase-js library is
// split into its own async chunk instead of blocking the homepage's initial JS.
// It's fetched on first data access (blog fetch / enquiry submit), not on load.
let _client: SupabaseClient | null = null
async function db(): Promise<SupabaseClient> {
  if (!_client) _client = (await import('./supabase')).supabase
  return _client
}

export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed'
export type EnquirySource = 'contact_section' | 'popup'

export interface Enquiry {
  id: string
  name: string
  phone: string
  email: string
  website: string
  message: string
  status: EnquiryStatus
  source: EnquirySource
  createdAt: string
}

const SELECT_COLS = 'id, name, phone, email, website, message, status, source, createdAt:created_at'

export async function saveEnquiry(
  data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
): Promise<Enquiry> {
  const payload = {
    name: data.name,
    phone: data.phone,
    email: data.email ?? '',
    website: data.website ?? '',
    message: data.message ?? '',
    source: data.source,
  }
  const supabase = await db()
  const { data: row, error } = await supabase
    .from('enquiries')
    .insert(payload)
    .select(SELECT_COLS)
    .single()
  if (error) throw error
  return row as Enquiry
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('enquiries')
    .select(SELECT_COLS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Enquiry[]
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const supabase = await db()
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteEnquiry(id: string): Promise<void> {
  const supabase = await db()
  const { error } = await supabase
    .from('enquiries')
    .delete()
    .eq('id', id)
  if (error) throw error
}
