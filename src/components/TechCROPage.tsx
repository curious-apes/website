import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import ScrollToTop from './ScrollToTop'
import Cursor from './Cursor'
import tech1 from '../assets/tech_1.jpg'
import tech2 from '../assets/tech_2.jpeg'
import tech3 from '../assets/tech_3.jpeg'
import './TechCROPage.css'

const services = [
  {
    number: '01',
    title: 'Conversion Rate Optimization',
    description:
      "Improving ATC% and Conversion Rate by making Value-Driven Changes, Enhancing Aesthetics, and Improving User Journey.",
    secondary:
      "Every Growth Experiment is Measured and Tracked by Data and is backed by User-Behavior Insights.",
    image: tech1,
    imageAlt: 'Conversion rate optimization',
  },
  {
    number: '02',
    title: 'E-Commerce Website Development',
    description:
      "Building high-performance, conversion-focused e-commerce websites optimized for speed, scalability, and seamless user experience.",
    secondary:
      "Designing mobile-first storefronts with clean UI/UX, optimized product pages, and frictionless checkout journeys aligned with brand goals.",
    image: tech2,
    imageAlt: 'E-commerce website development',
  },
  {
    number: '03',
    title: 'Integrating 3rd Party Apps and Tools',
    description:
      "Implementing and optimizing tools for inventory management, order processing, returns & exchanges, and logistics automation.",
    secondary:
      "Integrating retention and growth tools such as WhatsApp, email, loyalty, reviews, and analytics platforms to improve LTV and operational efficiency.",
    image: tech3,
    imageAlt: 'Third party app integrations',
  },
]

export default function TechCROPage() {
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
        <section className="tc-hero">
          <div className="tc-hero__orb tc-hero__orb--1" />
          <div className="tc-hero__orb tc-hero__orb--2" />
          <div className="container tc-hero__inner">
            <div className="section-label tc-hero__eyebrow">Tech &amp; CRO</div>
            <h1 className="tc-hero__title">
              Technology at the Core<br />
              <span className="tc-hero__title--grad">of Growth.</span>
            </h1>
            <p className="tc-hero__sub">
              Using Cutting-Edge Technology to Solve Business Challenges and Improve User Experience.
            </p>
            <div className="tc-hero__actions">
              <a
                href="#contact"
                className="btn btn-primary tc-hero__btn"
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
        <section className="tc-services">
          <div className="container">
            {services.map((svc, i) => (
              <div key={svc.number} className={`tc-services__item ${i % 2 === 1 ? 'tc-services__item--rev' : ''}`}>
                <div className="tc-services__content">
                  <span className="tc-services__number">{svc.number}</span>
                  <h2 className="tc-services__title">{svc.title}</h2>
                  <p className="tc-services__desc">{svc.description}</p>
                  <p className="tc-services__secondary">{svc.secondary}</p>
                  <a
                    href="#contact"
                    className="btn btn-primary tc-services__cta"
                    onClick={(e) => { e.preventDefault(); openPopup() }}
                  >
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <div className="tc-services__media">
                  <div className="tc-services__img-wrap">
                    <img src={svc.image} alt={svc.imageAlt} className="tc-services__img" />
                    <div className="tc-services__img-glow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="tc-cta">
          <div className="tc-cta__orb" />
          <div className="container tc-cta__inner">
            <p className="section-label tc-cta__eyebrow">Ready to Grow?</p>
            <h2 className="tc-cta__heading">
              Build Smarter.<br />
              <span className="tc-cta__heading--grad">Convert Better.</span>
            </h2>
            <p className="tc-cta__sub">
              Let&apos;s audit your tech stack and identify exactly where you&apos;re losing conversions and revenue.
            </p>
            <div className="tc-cta__actions">
              <a
                href="#contact"
                className="btn btn-primary tc-cta__btn"
                onClick={(e) => { e.preventDefault(); openPopup() }}
              >
                Get a Free Audit
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline tc-cta__btn--outline">
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
