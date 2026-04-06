import { useState } from 'react'
import './Admin.css'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'curiousapes2024'

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('ca_admin', '1')
        onLogin()
      } else {
        setError('Invalid credentials')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <img src="/src/assets/original_logo.webp" alt="Curious Apes" />
        </div>
        <h1 className="admin-login__title">Admin Portal</h1>
        <p className="admin-login__sub">Sign in to manage enquiries</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Username</label>
            <input
              type="text" autoComplete="username" required
              value={user} onChange={e => { setUser(e.target.value); setError('') }}
              placeholder="admin"
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password" autoComplete="current-password" required
              value={pass} onChange={e => { setPass(e.target.value); setError('') }}
              placeholder="••••••••••"
            />
          </div>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="adm-btn adm-btn--primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
