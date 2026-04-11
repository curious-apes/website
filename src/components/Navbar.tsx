import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import './Navbar.css'
import logoImg from '../assets/logo.png'

const services = [
  { label: 'Paid Media',         tagline: 'Meta & Google Ads',     href: '/services/paid-media' },
  { label: 'Growth Marketing',   tagline: 'Profitable Scaling',    href: '/services/growth-marketing' },
  { label: 'Visuals & Creative', tagline: 'Content that Converts', href: '/services/visuals-creative' },
  { label: 'Tech & CRO',         tagline: 'End-to-End eCommerce',  href: '/services/tech-cro' },
]

export default function Navbar() {
  const navRef   = useRef<HTMLElement>(null)
  const [menuOpen,           setMenuOpen]           = useState(false)
  const [scrolled,           setScrolled]           = useState(false)
  const [mobileServices,     setMobileServices]     = useState(false)
  const [desktopServices,    setDesktopServices]    = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
    )
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setDesktopServices(false)
  }, [location])

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!desktopServices) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopServices(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [desktopServices])

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHashLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault()
      scrollToSection(href.replace('/', ''))
    }
    setMenuOpen(false)
  }

  return (
    <>
    <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src={logoImg} alt="Curious Apes" className="navbar__logo-img" />
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">

          <li>
            <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'is-active' : ''}`}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" className={`navbar__link ${location.pathname === '/about' ? 'is-active' : ''}`}>
              About
            </Link>
          </li>

          {/* Services — click dropdown */}
          <li ref={dropdownRef} className={`navbar__dropdown-wrap ${desktopServices ? 'is-open' : ''}`}>
            <span
              className="navbar__link navbar__dropdown-trigger"
              style={{ cursor: 'pointer' }}
              onClick={() => setDesktopServices(prev => !prev)}
            >
              Services
              <svg className="navbar__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>

            <div className="navbar__dropdown">
              <div className="navbar__dropdown-inner">
                {services.map((s) => (
                  <Link
                    key={s.label}
                    to={s.href}
                    className="navbar__dropdown-item"
                    onClick={(e) => { handleHashLink(e as any, s.href); setDesktopServices(false) }}
                  >
                    <span className="navbar__dropdown-item-label">{s.label}</span>
                    <span className="navbar__dropdown-item-tagline">{s.tagline}</span>
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
            <Link
              to="/blog"
              className={`navbar__link ${location.pathname === '/blog' ? 'is-active' : ''}`}
            >
              Blog
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className={`navbar__link ${location.pathname === '/contact' ? 'is-active' : ''}`}
            >
              Contact
            </Link>
          </li>

        </ul>

        <Link to="/contact" className="navbar__cta btn btn-primary">
          Let&apos;s Talk
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

    </nav>

    {/* Mobile menu — outside <nav> to avoid z-index stacking context trap */}
    <div className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}>
      <ul className="navbar__mobile-links">
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </li>
        <li className="navbar__mobile-dropdown">
          <button
            className="navbar__mobile-dropdown-trigger"
            onClick={() => setMobileServices(!mobileServices)}
          >
            Services
            <svg className={`navbar__chevron ${mobileServices ? 'is-open' : ''}`} width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {mobileServices && (
            <ul className="navbar__mobile-services">
              {services.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.href}
                    onClick={(e) => { handleHashLink(e as any, s.href); setMenuOpen(false) }}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </li>
      </ul>
    </div>
    </>
  )
}
