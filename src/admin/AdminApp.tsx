import { useState, useEffect, useCallback } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard, { EnquiryFilters } from './AdminDashboard'
import BlogManager from './BlogManager'
import { getEnquiries, type Enquiry, type EnquiryStatus } from '../lib/enquiries'
import { supabase } from '../lib/supabase'
import './Admin.css'

type AdminView = 'enquiries' | 'blog'
type AuthState = 'loading' | 'signed-out' | 'signed-in'

export default function AdminApp() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [view, setView] = useState<AdminView>('enquiries')
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('all')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])

  const refreshEnquiries = useCallback(async () => {
    try {
      setEnquiries(await getEnquiries())
    } catch (err) {
      console.error('Failed to load enquiries:', err)
      setEnquiries([])
    }
  }, [])

  // Watch Supabase session
  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setAuthState(data.session ? 'signed-in' : 'signed-out')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? 'signed-in' : 'signed-out')
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authState === 'signed-in') refreshEnquiries()
  }, [authState, refreshEnquiries])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (authState === 'loading') {
    return (
      <div className="admin-login">
        <div className="admin-login__card" style={{ alignItems: 'center' }}>
          <p className="admin-login__sub">Loading…</p>
        </div>
      </div>
    )
  }

  if (authState === 'signed-out') {
    return <AdminLogin onLogin={() => { /* onAuthStateChange will flip to signed-in */ }} />
  }

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <img src="/src/assets/original_logo.webp" alt="Curious Apes" className="adm-sidebar__logo" />
          <span>Admin</span>
        </div>

        <nav className="adm-sidebar__nav">
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
