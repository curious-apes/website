import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import ScrollToTop from './ScrollToTop'
import Cursor from './Cursor'
import growth1 from '../assets/growth_1.jpeg'
import growth2 from '../assets/growth_2.jpeg'
import growth3 from '../assets/growth_3.jpeg'
import './GrowthPage.css'

const services = [
  {
    number: '01',
    title: 'Increasing AOV',
    description:
      'Making Personalized Cart Value, Cross-Sell, and Upsell Offers to increase Cart Value.',
    secondary:
      'Analyzing Data of Categories that are bought together, and making Offers basis that to drive higher average order values across every transaction.',
    image: growth1,
    imageAlt: 'Increasing average order value',
  },
  {
    number: '02',
    title: "Decreasing RTO's",
    description:
      "Analyzing Pin-Code Wise RTO%, blocking High RTO Pincodes to reduce returns and protect margins.",
    secondary:
      "A/B Testing for Prepaid Discounts and COD fee, Checkout Screen for Best Results — converting more COD orders to prepaid and reducing return-to-origin rates.",
    image: growth2,
    imageAlt: 'Decreasing return to origin rates',
  },
  {
    number: '03',
    title: 'Retention Marketing',
    description:
      'Enabling Abandoned Cart, Past Purchasers, Post Purchase Flows to increase revenue from Repeat Users.',
    secondary:
      'Personalized Messages, according to User Behavior Using Advanced Data and Analytics — building loyalty and maximizing lifetime value from every customer.',
    image: growth3,
    imageAlt: 'Retention marketing automation',
  },
]

export default function GrowthPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gm-hero">
          <div className="gm-hero__orb gm-hero__orb--1" />
          <div className="gm-hero__orb gm-hero__orb--2" />
          <div className="container gm-hero__inner">
            <div className="section-label gm-hero__eyebrow">Growth Marketing</div>
            <h1 className="gm-hero__title">
              We go beyond<br />
              <span className="gm-hero__title--grad">Ads and Creatives.</span>
            </h1>
            <p className="gm-hero__sub">
              Solving Major Challenges like Low AOV, High RTO, Low Repeat Rates to Scale a brand Profitably.
            </p>
            <div className="gm-hero__actions">
              <a
                href="#contact"
                className="btn btn-primary gm-hero__btn"
                onClick={(e) => { e.preventDefault(); openPopup() }}
              >
                Let&apos;s Connect
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="gm-services">
          <div className="container">
            {services.map((svc, i) => (
              <div key={svc.number} className={`gm-services__item ${i % 2 === 1 ? 'gm-services__item--rev' : ''}`}>
                <div className="gm-services__content">
                  <span className="gm-services__number">{svc.number}</span>
                  <h2 className="gm-services__title">{svc.title}</h2>
                  <p className="gm-services__desc">{svc.description}</p>
                  <p className="gm-services__secondary">{svc.secondary}</p>
                  <a
                    href="#contact"
                    className="btn btn-primary gm-services__cta"
                    onClick={(e) => { e.preventDefault(); openPopup() }}
                  >
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <div className="gm-services__media">
                  <div className="gm-services__img-wrap">
                    <img src={svc.image} alt={svc.imageAlt} className="gm-services__img" />
                    <div className="gm-services__img-glow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="gm-cta">
          <div className="gm-cta__orb" />
          <div className="container gm-cta__inner">
            <p className="section-label gm-cta__eyebrow">Ready to Scale Profitably?</p>
            <h2 className="gm-cta__heading">
              Fix the Leaks.<br />
              <span className="gm-cta__heading--grad">Fuel the Growth.</span>
            </h2>
            <p className="gm-cta__sub">
              Let&apos;s identify what&apos;s holding back your growth and build a plan to scale profitably — from AOV to retention.
            </p>
            <div className="gm-cta__actions">
              <a
                href="#contact"
                className="btn btn-primary gm-cta__btn"
                onClick={(e) => { e.preventDefault(); openPopup() }}
              >
                Get a Free Audit
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline gm-cta__btn--outline">
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
