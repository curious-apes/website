import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('ca_theme') as 'dark' | 'light') || 'dark'
  })
  const btnRef = useRef<HTMLButtonElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ca_theme', theme)
  }, [theme])

  useEffect(() => {
    if (!pulseRef.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    tl.fromTo(pulseRef.current,
      { scale: 1, opacity: 0.6 },
      { scale: 2.4, opacity: 0, duration: 1.4, ease: 'power2.out' }
    )
    return () => { tl.kill() }
  }, [])

  const toggle = () => {
    if (!btnRef.current) return
    gsap.fromTo(btnRef.current,
      { scale: 0.85, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
    )
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      ref={btnRef}
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span ref={pulseRef} className="theme-toggle__pulse" />
      <span className="theme-toggle__track">
        <span className="theme-toggle__icon">
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        <span className="theme-toggle__label">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </span>
    </button>
  )
}
