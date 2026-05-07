import { useState, useEffect, useCallback } from 'react'
import {
  getEnquiries, updateEnquiryStatus, deleteEnquiry,
  type Enquiry, type EnquiryStatus,
} from '../lib/enquiries'
import './Admin.css'

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed: 'Closed',
}

export const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: '#00c4d4',
  contacted: '#f59e0b',
  qualified: '#10b981',
  closed: '#6b7280',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="adm-stat">
      <span className="adm-stat__value">{value}</span>
      <span className="adm-stat__label">{label}</span>
      {sub && <span className="adm-stat__sub">{sub}</span>}
    </div>
  )
}

function EnquiryDrawer({ enquiry, onClose, onUpdate }: {
  enquiry: Enquiry
  onClose: () => void
  onUpdate: () => void
}) {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status)

  const handleStatus = async (s: EnquiryStatus) => {
    setStatus(s)
    try {
      await updateEnquiryStatus(enquiry.id, s)
      onUpdate()
    } catch (err) {
      console.error('Failed to update enquiry status:', err)
      alert('Failed to update status. Please try again.')
      setStatus(enquiry.status)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this enquiry?')) return
    try {
      await deleteEnquiry(enquiry.id)
      onUpdate()
      onClose()
    } catch (err) {
      console.error('Failed to delete enquiry:', err)
      alert('Failed to delete enquiry. Please try again.')
    }
  }

  return (
    <div className="adm-drawer-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="adm-drawer">
        <div className="adm-drawer__head">
          <div>
            <h2 className="adm-drawer__name">{enquiry.name}</h2>
            <span className="adm-drawer__time">{new Date(enquiry.createdAt).toLocaleString('en-IN')}</span>
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="adm-drawer__body">
          <section className="adm-drawer__section">
            <h3>Contact Details</h3>
            <div className="adm-drawer__grid">
              <div className="adm-drawer__field">
                <span className="adm-drawer__field-label">Phone</span>
                <a href={`tel:${enquiry.phone}`} className="adm-drawer__field-value adm-link">{enquiry.phone}</a>
              </div>
              {enquiry.email && (
                <div className="adm-drawer__field">
                  <span className="adm-drawer__field-label">Email</span>
                  <a href={`mailto:${enquiry.email}`} className="adm-drawer__field-value adm-link">{enquiry.email}</a>
                </div>
              )}
              {enquiry.website && (
                <div className="adm-drawer__field">
                  <span className="adm-drawer__field-label">Website</span>
                  <a href={enquiry.website} target="_blank" rel="noreferrer" className="adm-drawer__field-value adm-link">
                    {enquiry.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="adm-drawer__field">
                <span className="adm-drawer__field-label">Source</span>
                <span className="adm-drawer__field-value">
                  {enquiry.source === 'popup' ? 'Popup Form' : 'Contact Section'}
                </span>
              </div>
            </div>
          </section>

          {enquiry.message && (
            <section className="adm-drawer__section">
              <h3>Message</h3>
              <p className="adm-drawer__message">{enquiry.message}</p>
            </section>
          )}

          <section className="adm-drawer__section">
            <h3>Update Status</h3>
            <div className="adm-drawer__status-btns">
              {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map(s => (
                <button
                  key={s}
                  className={`adm-status-btn ${status === s ? 'is-active' : ''}`}
                  style={{ '--sc': STATUS_COLORS[s] } as React.CSSProperties}
                  onClick={() => handleStatus(s)}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </section>

          <section className="adm-drawer__section">
            <h3>Quick Actions</h3>
            <div className="adm-drawer__actions">
              <a href={`tel:${enquiry.phone}`} className="adm-btn adm-btn--outline">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 10.5L11 8.5C10.7 8.27 10.27 8.3 10 8.57L9 9.57C8.73 9.83 8.3 9.87 8 9.63C7.1 9 6 7.9 5.37 7C5.13 6.7 5.17 6.27 5.43 6L6.43 5C6.7 4.73 6.73 4.3 6.5 4L4.5 1.5C4.23 1.13 3.7 1.07 3.37 1.4L2.07 2.7C1.5 3.27 1.27 4.07 1.5 4.83C2.27 7.4 5.6 10.73 8.17 11.5C8.93 11.73 9.73 11.5 10.3 10.93L11.6 9.63C11.93 9.3 11.87 8.77 11.5 8.5Z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                Call
              </a>
              <a href={`https://wa.me/${enquiry.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="adm-btn adm-btn--outline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.547 4.1 1.504 5.832L0 24l6.335-1.657A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.572 9.572 0 01-4.892-1.34l-.351-.208-3.633.951.972-3.546-.228-.363A9.558 9.558 0 012.4 12c0-5.295 4.305-9.6 9.6-9.6s9.6 4.305 9.6 9.6-4.305 9.6-9.6 9.6z"/>
                </svg>
                WhatsApp
              </a>
              <button className="adm-btn adm-btn--danger" onClick={handleDelete}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar filter section — rendered by AdminApp ─────────────────────────────
export function EnquiryFilters({ filter, setFilter, enquiries }: {
  filter: EnquiryStatus | 'all'
  setFilter: (f: EnquiryStatus | 'all') => void
  enquiries: Enquiry[]
}) {
  return (
    <>
      <span className="adm-sidebar__nav-label">Filters</span>
      {(['all', 'new', 'contacted', 'qualified', 'closed'] as const).map(f => (
        <button
          key={f}
          className={`adm-sidebar__nav-item ${filter === f ? 'is-active' : ''}`}
          onClick={() => setFilter(f)}
        >
          <span className="adm-sidebar__nav-dot" style={f !== 'all' ? { background: STATUS_COLORS[f as EnquiryStatus] } : {}} />
          {f === 'all' ? 'All Enquiries' : STATUS_LABELS[f as EnquiryStatus]}
          <span className="adm-sidebar__nav-count">
            {f === 'all' ? enquiries.length : enquiries.filter(e => e.status === f).length}
          </span>
        </button>
      ))}
    </>
  )
}

// ── Main dashboard content (no layout wrapper) ────────────────────────────────
export default function AdminDashboard({
  filter,
}: {
  onLogout: () => void   // kept for backwards compat, not used here
  filter: EnquiryStatus | 'all'
  setFilter: (f: EnquiryStatus | 'all') => void
}) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setEnquiries(await getEnquiries())
    } catch (err) {
      console.error('Failed to load enquiries:', err)
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const filtered = enquiries.filter(e => {
    const matchStatus = filter === 'all' || e.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.website?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const stats = {
    total: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    qualified: enquiries.filter(e => e.status === 'qualified').length,
  }

  return (
    <>
      <div className="adm-header">
        <div>
          <h1 className="adm-header__title">Enquiries</h1>
          <p className="adm-header__sub">Manage and track all incoming leads</p>
        </div>
        <div className="adm-header__search">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="search" placeholder="Search name, phone, website…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="adm-stats">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="New" value={stats.new} sub="Needs action" />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Qualified" value={stats.qualified} sub="Hot leads" />
      </div>

      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-empty"><p>Loading enquiries…</p></div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
              <path d="M16 24h16M24 16v16" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p>{search ? 'No results found' : 'No enquiries yet'}</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Source</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className={e.status === 'new' ? 'is-new' : ''} onClick={() => setSelected(e)}>
                  <td className="adm-table__name">
                    {e.status === 'new' && <span className="adm-table__new-dot" />}
                    {e.name}
                  </td>
                  <td>
                    <a href={`tel:${e.phone}`} onClick={ev => ev.stopPropagation()} className="adm-link">{e.phone}</a>
                  </td>
                  <td>
                    {e.website
                      ? <a href={e.website} target="_blank" rel="noreferrer" onClick={ev => ev.stopPropagation()} className="adm-link adm-link--dim">
                          {e.website.replace(/^https?:\/\//, '').slice(0, 28)}
                        </a>
                      : <span className="adm-muted">—</span>}
                  </td>
                  <td>
                    <span className={`adm-source adm-source--${e.source === 'popup' ? 'popup' : 'contact'}`}>
                      {e.source === 'popup' ? 'Popup' : 'Contact'}
                    </span>
                  </td>
                  <td>
                    <span className="adm-badge" style={{ '--bc': STATUS_COLORS[e.status] } as React.CSSProperties}>
                      {STATUS_LABELS[e.status]}
                    </span>
                  </td>
                  <td className="adm-muted">{timeAgo(e.createdAt)}</td>
                  <td>
                    <button className="adm-icon-btn" onClick={ev => { ev.stopPropagation(); setSelected(e) }} aria-label="View">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3C4 3 1 8 1 8s3 5 7 5 7-5 7-5-3-5-7-5z" stroke="currentColor" strokeWidth="1.3"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <EnquiryDrawer
          enquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={async () => {
            const fresh = await getEnquiries()
            setEnquiries(fresh)
            setSelected(s => s ? (fresh.find(e => e.id === s.id) ?? null) : null)
          }}
        />
      )}
    </>
  )
}
