import type { SupabaseClient } from '@supabase/supabase-js'

// Same lazy-load rationale as enquiries.ts — keep supabase-js out of the
// initial homepage bundle.
let _client: SupabaseClient | null = null
async function db(): Promise<SupabaseClient> {
  if (!_client) _client = (await import('./supabase')).supabase
  return _client
}

export type ScaleLeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost'

export interface ScaleLead {
  id: string
  phone: string
  brand: string
  website: string
  monthlySales: string
  monthlyAdSpend: string
  source: string
  referrer: string
  utm: Record<string, string> | null
  status: ScaleLeadStatus
  notes: string | null
  createdAt: string
}

const SELECT_COLS =
  'id, phone, brand, website, monthlySales:monthly_sales, monthlyAdSpend:monthly_ad_spend, source, referrer, utm, status, notes, createdAt:created_at'

/**
 * Save a public lead from the /scale landing page.
 *
 * Deliberately does NOT `.select()` the inserted row back — see the same
 * gotcha documented in `saveEnquiry` (enquiries.ts): asking Postgres to
 * return the row makes it evaluate the SELECT policy too, which anonymous
 * visitors must fail.
 */
export async function saveScaleLead(
  data: Pick<ScaleLead, 'phone' | 'brand' | 'website' | 'monthlySales' | 'monthlyAdSpend' | 'source' | 'referrer'> & {
    utm?: Record<string, string>
  }
): Promise<void> {
  const payload = {
    phone: data.phone,
    brand: data.brand,
    website: data.website,
    monthly_sales: data.monthlySales,
    monthly_ad_spend: data.monthlyAdSpend,
    source: data.source,
    referrer: data.referrer ?? '',
    utm: data.utm && Object.keys(data.utm).length ? data.utm : null,
  }
  const supabase = await db()
  const { error } = await supabase.from('scale_leads').insert(payload)
  if (error) throw error
}

export async function getScaleLeads(): Promise<ScaleLead[]> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('scale_leads')
    .select(SELECT_COLS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ScaleLead[]
}

export async function updateScaleLeadStatus(id: string, status: ScaleLeadStatus): Promise<void> {
  const supabase = await db()
  const { error } = await supabase
    .from('scale_leads')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteScaleLead(id: string): Promise<void> {
  const supabase = await db()
  const { error } = await supabase
    .from('scale_leads')
    .delete()
    .eq('id', id)
  if (error) throw error
}
