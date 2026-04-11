import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import ScrollToTop from './ScrollToTop'
import Cursor from './Cursor'
import aboutImg from '../assets/about.png'
import './AboutPage.css'

export default function AboutPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>

        {/* ── 1. ABOUT ── */}
        <section className="ap-about">
          <div className="ap-about__orb ap-about__orb--1" />
          <div className="ap-about__orb ap-about__orb--2" />
          <div className="container ap-about__inner">
            <div className="section-label ap-about__eyebrow">Who We Are</div>
            <div className="ap-about__top">
              <h1 className="ap-about__title">
                Profitable Growth,<br />
                <span className="ap-about__title--grad">Not Just Pretty Ads.</span>
              </h1>
              <div className="ap-about__text-col">
                <p className="ap-about__body">
                  Curious Apes is a growth marketing company helping Indian D2C brands scale profitably
                  through a data-driven, profit-first approach. We bring together Paid Media,
                  high-converting visuals and creatives, growth marketing, and e-commerce tech — all
                  delivered in-house, from UGC video production and social media marketing to CRO and
                  performance marketing.
                </p>
                <p className="ap-about__body">
                  Based in Jaipur with 8+ years of experience, and backed by our sister concern{' '}
                  <strong>The Cogent</strong>, we focus on building scalable systems that drive
                  sustainable growth, not just short-term results.
                </p>
              </div>
            </div>
          </div>
          <div className="ap-about__full-img-wrap">
            <img src={aboutImg} alt="Curious Apes team" className="ap-about__full-img" />
          </div>
        </section>

        {/* ── 2. FOUNDER ── */}
        <section className="ap-founder">
          <div className="container ap-founder__inner">
            <div className="section-label ap-founder__eyebrow">The Founder</div>
            <div className="ap-founder__card">
              <div className="ap-founder__avatar">
                <span className="ap-founder__initials">CA</span>
              </div>
              <div className="ap-founder__info">
                <h2 className="ap-founder__name">Anup Jain</h2>
                <p className="ap-founder__role">Founder &amp; CEO, Curious Apes</p>
                <blockquote className="ap-founder__quote">
                  &ldquo;We started Curious Apes because we saw D2C brands burning money on ads
                  without a system behind them. Our mission is simple — help brands grow
                  profitably, with data at the centre of every decision we make.&rdquo;
                </blockquote>
                <div className="ap-founder__socials">
                  <a
                    href="https://www.linkedin.com/company/curious-apesin/"
                    target="_blank"
                    rel="noreferrer"
                    className="ap-founder__social-link"
                    aria-label="LinkedIn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://www.instagram.com/curious.apes/"
                    target="_blank"
                    rel="noreferrer"
                    className="ap-founder__social-link"
                    aria-label="Instagram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. LIFE AT CURIOUS APES ── */}
        <section className="ap-life">
          <div className="ap-life__orb" />
          <div className="container ap-life__inner">
            <div className="section-label ap-life__eyebrow">Life at Curious Apes</div>
            <h2 className="ap-life__title">
              Where Curiosity<br />
              <span className="ap-life__title--grad">Meets Ambition.</span>
            </h2>
            <p className="ap-life__sub">
              We&apos;re a tight-knit team of marketers, creators, and builders who move fast,
              think deep, and genuinely care about the brands we work with.
            </p>
            <div className="ap-life__pillars">
              <div className="ap-life__pillar">
                <div className="ap-life__pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4L17 10L24 11L19 16L20.5 23L14 20L7.5 23L9 16L4 11L11 10L14 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="ap-life__pillar-title">Data First</h3>
                <p className="ap-life__pillar-desc">Every decision — creative, media, or growth — is backed by real numbers, not gut feel.</p>
              </div>
              <div className="ap-life__pillar">
                <div className="ap-life__pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M10 14L13 17L18 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="ap-life__pillar-title">Ownership Culture</h3>
                <p className="ap-life__pillar-desc">We treat every brand like our own — taking full accountability for outcomes, not just outputs.</p>
              </div>
              <div className="ap-life__pillar">
                <div className="ap-life__pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 20L14 6L22 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 16H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="ap-life__pillar-title">Always Learning</h3>
                <p className="ap-life__pillar-desc">Platforms change, algorithms shift — we stay ahead by constantly testing, learning, and iterating.</p>
              </div>
              <div className="ap-life__pillar">
                <div className="ap-life__pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4C14 4 6 8 6 15C6 19.4 9.6 23 14 23C18.4 23 22 19.4 22 15C22 8 14 4 14 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    <path d="M14 23V17M10 13L14 17L18 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="ap-life__pillar-title">In-House Everything</h3>
                <p className="ap-life__pillar-desc">No outsourcing, no middle-men. Strategy, production, and execution all happen under one roof.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. CONTACT STRIP ── */}
        <section className="ap-cta">
          <div className="ap-cta__orb" />
          <div className="container ap-cta__inner">
            <p className="section-label ap-cta__eyebrow">Ready to Scale?</p>
            <h2 className="ap-cta__heading">
              Let&apos;s Build Something<br />
              <span className="ap-cta__heading--grad">Worth Talking About.</span>
            </h2>
            <p className="ap-cta__sub">
              Whether you&apos;re at ₹0 or ₹1Cr/month — we&apos;ll take you to the next level.
            </p>
            <div className="ap-cta__actions">
              <a
                href="#contact"
                className="btn btn-primary ap-cta__btn"
                onClick={(e) => { e.preventDefault(); openPopup() }}
              >
                Start the Conversation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline ap-cta__btn--outline">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ScrollToTop />
      <ThemeToggle />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
