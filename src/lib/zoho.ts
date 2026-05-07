// Zoho CRM Web-to-Lead helper
// Submits a lead to Zoho's WebToLeadForm endpoint via a hidden iframe so
// the cross-origin POST doesn't navigate the main window away from /thankyou.
// Called *after* the Supabase save succeeds — Zoho is a secondary destination,
// fire-and-forget, never blocks the user.

const ZOHO_CONFIG = {
  endpoint: 'https://crm.zoho.in/crm/WebToLeadForm',
  // These are public form identifiers from Zoho's embed code — designed
  // to live in client-side HTML. Not credentials.
  xnQsjsdp: '639f96cd098202bf672e8eb0d8e6365da69c65b2e5119e2997b7e0917a7e90c2',
  xmIwtLD:  '4d35a7a29d3a67aae67b48f9fa46d9b0a888602a9789f5d4c3d64ff27024dbfd0be67d0a6edaff933ee68968623a17e8',
  actionType: 'TGVhZHM=',
  returnURL: 'https://www.curiousapes.in/thankyou',
} as const

export interface ZohoLead {
  name: string
  phone: string
  website?: string
  message?: string
  source?: 'contact_section' | 'popup'
}

const LEAD_SOURCE_LABELS: Record<NonNullable<ZohoLead['source']>, string> = {
  contact_section: 'Website - Contact Form',
  popup:           'Website - Popup',
}

// Best-effort company name from a website URL.
// "https://www.yourbrand.com/contact" → "Yourbrand.com"
function deriveCompany(website: string | undefined): string {
  const w = (website ?? '').trim()
  if (!w) return ''
  const domain = w
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split('?')[0]
    .trim()
  if (!domain) return w
  return domain.charAt(0).toUpperCase() + domain.slice(1)
}

export function submitToZoho(lead: ZohoLead): void {
  if (typeof document === 'undefined') return

  const id = `zoho-frame-${Date.now()}`

  // Hidden iframe receives Zoho's response without navigating the main page.
  const iframe = document.createElement('iframe')
  iframe.name = id
  iframe.style.display = 'none'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  // Hidden form posts into the iframe.
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = ZOHO_CONFIG.endpoint
  form.target = id
  form.acceptCharset = 'UTF-8'
  form.style.display = 'none'

  const addField = (name: string, value: string) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  addField('xnQsjsdp', ZOHO_CONFIG.xnQsjsdp)
  addField('xmIwtLD',  ZOHO_CONFIG.xmIwtLD)
  addField('actionType', ZOHO_CONFIG.actionType)
  addField('returnURL', ZOHO_CONFIG.returnURL)

  // Map Curious Apes fields → Zoho field names
  addField('Last Name', lead.name.trim())
  addField('Phone',     lead.phone.trim())
  addField('Website',   (lead.website ?? '').trim())
  addField('Description', (lead.message ?? '').trim())

  // Company (Zoho often requires this for B2B leads). Derived from website.
  addField('Company', deriveCompany(lead.website))

  // Lead Source — distinguishes Contact form vs Popup so sales sees attribution
  addField('Lead Source', lead.source ? LEAD_SOURCE_LABELS[lead.source] : 'Website')

  // Honeypot — must stay empty (bots fill it; Zoho rejects those leads)
  addField('aG9uZXlwb3Q', '')

  document.body.appendChild(form)

  try {
    form.submit()
  } catch (err) {
    // If submission throws synchronously, log and clean up. Don't propagate
    // — Zoho is secondary, the user already has /thankyou in flight.
    // eslint-disable-next-line no-console
    console.warn('Zoho submission failed to dispatch:', err)
  }

  // Clean up DOM nodes after Zoho has had time to respond. The iframe is
  // attached to document.body so it survives React route changes.
  setTimeout(() => {
    try { form.remove() } catch { /* noop */ }
    try { iframe.remove() } catch { /* noop */ }
  }, 12000)
}
