// ── Data layer ───────────────────────────────────────────────────────────────
// Currently uses localStorage. Swap saveEnquiry / getEnquiries / updateEnquiry
// for Supabase/API calls when backend is ready — no other file needs to change.

export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed'

export interface Enquiry {
  id: string
  name: string
  phone: string
  website: string
  message: string
  status: EnquiryStatus
  source: 'contact_section' | 'popup'
  createdAt: string
}

const KEY = 'ca_enquiries'

function load(): Enquiry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(list: Enquiry[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function saveEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Enquiry {
  const enquiry: Enquiry = {
    ...data,
    id: crypto.randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  const list = load()
  list.unshift(enquiry)
  save(list)
  return enquiry
}

export function getEnquiries(): Enquiry[] {
  return load()
}

export function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const list = load()
  const idx = list.findIndex(e => e.id === id)
  if (idx !== -1) { list[idx].status = status; save(list) }
}

export function deleteEnquiry(id: string) {
  save(load().filter(e => e.id !== id))
}
