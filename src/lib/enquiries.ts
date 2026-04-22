import { supabase } from './supabase'

export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed'
export type EnquirySource = 'contact_section' | 'popup'

export interface Enquiry {
  id: string
  name: string
  phone: string
  website: string
  message: string
  status: EnquiryStatus
  source: EnquirySource
  createdAt: string
}

const SELECT_COLS = 'id, name, phone, website, message, status, source, createdAt:created_at'

export async function saveEnquiry(
  data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
): Promise<Enquiry> {
  const payload = {
    name: data.name,
    phone: data.phone,
    website: data.website ?? '',
    message: data.message ?? '',
    source: data.source,
  }
  const { data: row, error } = await supabase
    .from('enquiries')
    .insert(payload)
    .select(SELECT_COLS)
    .single()
  if (error) throw error
  return row as Enquiry
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select(SELECT_COLS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Enquiry[]
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteEnquiry(id: string): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .delete()
    .eq('id', id)
  if (error) throw error
}
