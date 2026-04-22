import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Admin.css'

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    })
    setLoading(false)
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials'
        ? 'Invalid email or password'
        : signInError.message)
      return
    }
    onLogin()
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <img src="/src/assets/original_logo.webp" alt="Curious Apes" />
        </div>
        <h1 className="admin-login__title">Admin Portal</h1>
        <p className="admin-login__sub">Sign in to manage the site</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email" autoComplete="email" required
              value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="you@curiousapes.in"
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
