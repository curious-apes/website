import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import ScrollToTop from './ScrollToTop'
import Cursor from './Cursor'
import visual1 from '../assets/visual_1.jpeg'
import visual2 from '../assets/visual_2.png'
import visual3 from '../assets/visual_3.jpeg'
import './VisualsPage.css'

const services = [
  {
    number: '01',
    title: 'Leveraging Creative Analytics',
    description:
      'Tracking creative metrics including hook rate, hold rate, and engagement signals to identify high-performing angles and narratives.',
    secondary:
      'Studying and benchmarking top-performing ads across brands using advanced creative intelligence tools, and aligning insights with performance marketing teams to continuously refine and scale winning creatives.',
    image: visual1,
    imageAlt: 'Creative analytics and insights',
  },
  {
    number: '02',
    title: 'In-House Video Production Team and Studio',
    description:
      'Our dedicated in-house production team creates high-impact UGC content, e-commerce product shoots, documentaries, and commercial advertisements tailored for digital performance.',
    secondary:
      'Every piece of content is built with performance in mind — crafted to stop the scroll, hold attention, and drive action across Meta, Google, and beyond.',
    image: visual2,
    imageAlt: 'In-house video production studio',
  },
  {
    number: '03',
    title: 'Social Media Management',
    description:
      'Monitoring competitor activity and emerging platform trends to keep your brand ahead of the curve.',
    secondary:
      'Building content around highly shareable formats and concepts to maximize reach, engagement, and brand recall across every platform.',
    image: visual3,
    imageAlt: 'Social media management',
  },
]

export default function VisualsPage() {
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
        <section className="vis-hero">
          <div className="vis-hero__orb vis-hero__orb--1" />
          <div className="vis-hero__orb vis-hero__orb--2" />
          <div className="container vis-hero__inner">
            <div className="section-label vis-hero__eyebrow">Visuals &amp; Creative</div>
            <h1 className="vis-hero__title">
              Creative Production<br />
              <span className="vis-hero__title--grad">is a Science.</span>
            </h1>
            <p className="vis-hero__sub">
              Data-led Insights, In-House Production, Performance-Driven Execution.
            </p>
            <div className="vis-hero__actions">
              <a
                href="#contact"
                className="btn btn-primary vis-hero__btn"
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
        <section className="vis-services">
          <div className="container">
            {services.map((svc, i) => (
              <div key={svc.number} className={`vis-services__item ${i % 2 === 1 ? 'vis-services__item--rev' : ''}`}>
                <div className="vis-services__content">
                  <span className="vis-services__number">{svc.number}</span>
                  <h2 className="vis-services__title">{svc.title}</h2>
                  <p className="vis-services__desc">{svc.description}</p>
                  <p className="vis-services__secondary">{svc.secondary}</p>
                  <a
                    href="#contact"
                    className="btn btn-primary vis-services__cta"
                    onClick={(e) => { e.preventDefault(); openPopup() }}
                  >
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <div className="vis-services__media">
                  <div className="vis-services__img-wrap">
                    <img src={svc.image} alt={svc.imageAlt} className="vis-services__img" />
                    <div className="vis-services__img-glow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="vis-cta">
          <div className="vis-cta__orb" />
          <div className="container vis-cta__inner">
            <p className="section-label vis-cta__eyebrow">Ready to Create?</p>
            <h2 className="vis-cta__heading">
              Stop Blending In.<br />
              <span className="vis-cta__heading--grad">Start Standing Out.</span>
            </h2>
            <p className="vis-cta__sub">
              Let&apos;s build a creative strategy backed by data that stops the scroll and drives real results.
            </p>
            <div className="vis-cta__actions">
              <a
                href="#contact"
                className="btn btn-primary vis-cta__btn"
                onClick={(e) => { e.preventDefault(); openPopup() }}
              >
                Get a Free Audit
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline vis-cta__btn--outline">
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
