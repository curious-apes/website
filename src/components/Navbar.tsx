import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Navbar.css'
import logoImg from '../assets/logo.png'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Team', href: '#team' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('ca_theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ca_theme', theme)
  }, [theme])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
    )

    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo" onClick={(e) => handleNavClick(e, '#hero')}>
          <img
            src={logoImg}
            alt="Curious Apes"
            className="navbar__logo-img"
          />
        </a>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="navbar__link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="navbar__theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <a
          href="#contact"
          className="navbar__cta btn btn-primary"
          onClick={(e) => handleNavClick(e, '#contact')}
        >
          Let&apos;s Talk
        </a>

        <button
          className={`navbar__hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}>
        <ul className="navbar__mobile-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
