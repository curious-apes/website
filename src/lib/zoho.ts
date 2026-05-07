// Zoho CRM Web-to-Lead helper
// Submits a lead to Zoho's WebToLeadForm endpoint via a hidden iframe so
// the cross-origin POST doesn't navigate the main window away from /thankyou.
// Called *after* the Supabase save succeeds — Zoho is a secondary destination,
// fire-and-forget, never blocks the user.

const ZOHO_CONFIG = {
  endpoint: 'https://crm.zoho.in/crm/WebToLeadForm',
  // These are public form identifiers from Zoho's embed code — designed
  // to live in client-side HTML. Not credentials.
  // Updated 2026-05-01 after Aniket added Email + Company + Lead Source fields.
  xnQsjsdp: '78b386e402c68b5f97aa410d573364c005212e2762b22fbc966850256f670d8b',
  xmIwtLD:  'ad2caa0dd8466f37c8e934a2b4a43ad86fefbe94d7bfe83da971820ec062b8794d855e9f54cb7021354c0902a71cd152',
  actionType: 'TGVhZHM=',
  returnURL: 'https://www.curiousapes.in/thankyou',
} as const

export interface ZohoLead {
  name: string
  phone: string
  email?: string
  website?: string
  message?: string
  source?: 'contact_section' | 'popup'
}

// Lead Source must match one of Zoho's picklist values exactly, otherwise
// the field is silently dropped. Map our internal source IDs to existing
// picklist options so we keep some distinction between the two forms.
// To get cleaner labels (e.g. "Website - Contact Form"), add custom
// picklist values in Zoho: Setup → Customization → Modules and Fields →
// Leads → Lead Source → Add new options.
const LEAD_SOURCE_LABELS: Record<NonNullable<ZohoLead['source']>, string> = {
  contact_section: 'Web Research',
  popup:           'Chat',
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
  addField('Email',     (lead.email ?? '').trim())
  addField('Website',   (lead.website ?? '').trim())
  addField('Description', (lead.message ?? '').trim())

  // Company (Zoho often requires this for B2B leads). Derived from website.
  addField('Company', deriveCompany(lead.website))

  // Lead Source — must be a valid Zoho picklist value (see LEAD_SOURCE_LABELS)
  addField('Lead Source', lead.source ? LEAD_SOURCE_LABELS[lead.source] : 'Web Research')

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
