import { useCallback, useState } from 'react'
import Navbar from './Navbar'
import About from './About'
import Clients from './Clients'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import Cursor from './Cursor'
import './AboutPage.css'

export default function AboutPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        {/* Hero banner */}
        <section className="about-page__hero">
          <div className="about-page__hero-orb about-page__hero-orb--1" />
          <div className="about-page__hero-orb about-page__hero-orb--2" />
          <div className="container about-page__hero-inner">
            <div className="about-page__eyebrow section-label">Who We Are</div>
            <h1 className="about-page__title">
              Built for Brands<br />
              That Want to <span className="about-page__title--grad">Scale.</span>
            </h1>
            <p className="about-page__sub">
              Curious Apes is a D2C growth marketing agency from Jaipur — combining
              Paid Media, Creatives, and Technology to help Indian brands grow profitably.
            </p>
          </div>
        </section>

        {/* About section (hidden from homepage) */}
        <About />

        {/* Client logos */}
        <Clients />

        {/* CTA strip */}
        <section className="about-page__cta">
          <div className="about-page__cta-orb" />
          <div className="container about-page__cta-inner">
            <p className="about-page__cta-eyebrow section-label">Ready to Scale?</p>
            <h2 className="about-page__cta-heading">
              Let's Build Something<br />
              <span className="about-page__cta-heading--grad">Worth Talking About.</span>
            </h2>
            <p className="about-page__cta-sub">
              Whether you're at ₹0 or ₹1Cr/month — we'll take you to the next level.
            </p>
            <div className="about-page__cta-actions">
              <a href="#contact" className="btn btn-primary about-page__cta-btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Start the Conversation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline about-page__cta-btn--outline">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ThemeToggle />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
