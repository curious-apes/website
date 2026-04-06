import { useState, useEffect, useCallback } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard, { EnquiryFilters } from './AdminDashboard'
import BlogManager from './BlogManager'
import { getEnquiries, type Enquiry, type EnquiryStatus } from '../lib/enquiries'
import './Admin.css'

type AdminView = 'enquiries' | 'blog'

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ca_admin') === '1')
  const [view, setView] = useState<AdminView>('enquiries')
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('all')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])

  const refreshEnquiries = useCallback(() => setEnquiries(getEnquiries()), [])

  useEffect(() => {
    if (authed) refreshEnquiries()
  }, [authed, refreshEnquiries])

  const handleLogout = () => {
    sessionStorage.removeItem('ca_admin')
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <img src="/src/assets/original_logo.webp" alt="Curious Apes" className="adm-sidebar__logo" />
          <span>Admin</span>
        </div>

        <nav className="adm-sidebar__nav">
          {/* Top-level navigation */}
          <span className="adm-sidebar__nav-label">Navigation</span>
          <button
            className={`adm-sidebar__nav-item ${view === 'enquiries' ? 'is-active' : ''}`}
            onClick={() => setView('enquiries')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 2.5h12v9H1zM1 5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="4" cy="8.5" r="1" fill="currentColor"/>
            </svg>
            Enquiries
          </button>
          <button
            className={`adm-sidebar__nav-item ${view === 'blog' ? 'is-active' : ''}`}
            onClick={() => setView('blog')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h10v10H2zM4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Blog Posts
          </button>

          {/* Enquiry status filters — only shown on enquiries view */}
          {view === 'enquiries' && (
            <div style={{ marginTop: 16 }}>
              <EnquiryFilters
                filter={filter}
                setFilter={setFilter}
                enquiries={enquiries}
              />
            </div>
          )}
        </nav>

        <button className="adm-btn adm-btn--logout" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H2v12h4M11 5l3 3-3 3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Out
        </button>
      </aside>

      <main className="adm-main">
        {view === 'enquiries' && (
          <AdminDashboard
            onLogout={handleLogout}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        {view === 'blog' && <BlogManager />}
      </main>
    </div>
  )
}
