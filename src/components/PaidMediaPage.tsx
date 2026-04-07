import { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import Cursor from './Cursor'
import perf1 from '../assets/performace-1.jpeg'
import perf2 from '../assets/performace-2.jpeg'
import perf3 from '../assets/performace-3.jpeg'
import './PaidMediaPage.css'

const services = [
  {
    number: '01',
    title: 'Data-Driven Campaign Optimization',
    description:
      "We go deep on every metric that matters \u2014 CTR, CPC, CVR, ATC %, AOV & MER \u2014 to understand exactly what's working and what's not. By identifying drop-offs across the funnel from ad to PDP to checkout, we fix leaks before scaling spend.",
    points: [
      'Deep analysis of CTR, CPC, CVR, ATC %, AOV & MER',
      'Identifying drop-offs across the funnel (ad → PDP → checkout)',
      'Weekly performance reports with clear action items',
    ],
    image: perf1,
    imageAlt: 'Data-driven campaign optimization',
  },
  {
    number: '02',
    title: 'Clean Ad Structures',
    description:
      'Messy account structures kill performance. We build clean, logical campaign architectures with clear segmentation across Testing, Scaling, Bestsellers & Category-level pushes — ensuring your budget always flows to the right place.',
    points: [
      'Separate campaigns for Testing, Scaling, Bestsellers & Category-level pushes',
      'Clear distinction between TOF, MOF and BOF to avoid audience overlap',
      'Budget allocation mapped to funnel stage performance',
    ],
    image: perf2,
    imageAlt: 'Clean ad structure setup',
  },
  {
    number: '03',
    title: 'Focusing on High Converting Products',
    description:
      'Not all products deserve equal ad spend. We identify your real winners — high sales velocity, strong ATC %, proven conversion rates — and build campaigns around them to maximise your returns.',
    points: [
      'Identifying products with high sales velocity & strong ATC %',
      'Prioritizing hero products and proven categories',
      'Creative strategy aligned to top-performing SKUs',
    ],
    image: perf3,
    imageAlt: 'High converting products strategy',
  },
]

export default function PaidMediaPage() {
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
        <section className="pm-hero">
          <div className="pm-hero__orb pm-hero__orb--1" />
          <div className="pm-hero__orb pm-hero__orb--2" />
          <div className="container pm-hero__inner">
            <div className="section-label pm-hero__eyebrow">Paid Media</div>
            <h1 className="pm-hero__title">
              Data-Driven Approach to<br />
              <span className="pm-hero__title--grad">Performance Marketing.</span>
            </h1>
            <p className="pm-hero__sub">
              We use real performance data — not guesswork — to optimise campaigns,
              scale winners, and drive sustainable, profitable growth.
            </p>
            <div className="pm-hero__actions">
              <a href="#contact" className="btn btn-primary pm-hero__btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Let's Connect
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="pm-services">
          <div className="container">
            {services.map((svc, i) => (
              <div key={svc.number} className={`pm-services__item ${i % 2 === 1 ? 'pm-services__item--rev' : ''}`}>
                <div className="pm-services__content">
                  <span className="pm-services__number">{svc.number}</span>
                  <h2 className="pm-services__title">{svc.title}</h2>
                  <p className="pm-services__desc">{svc.description}</p>
                  <ul className="pm-services__list">
                    {svc.points.map((pt) => (
                      <li key={pt} className="pm-services__list-item">
                        <span className="pm-services__check">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pm-services__media">
                  <div className="pm-services__img-wrap">
                    <img src={svc.image} alt={svc.imageAlt} className="pm-services__img" />
                    <div className="pm-services__img-glow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pm-cta">
          <div className="pm-cta__orb" />
          <div className="container pm-cta__inner">
            <p className="section-label pm-cta__eyebrow">Ready to Scale?</p>
            <h2 className="pm-cta__heading">
              Stop Guessing.<br />
              <span className="pm-cta__heading--grad">Start Scaling.</span>
            </h2>
            <p className="pm-cta__sub">
              Let's audit your current ad spend and show you exactly where you're leaving money on the table.
            </p>
            <div className="pm-cta__actions">
              <a href="#contact" className="btn btn-primary pm-cta__btn" onClick={(e) => { e.preventDefault(); openPopup() }}>
                Get a Free Audit
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/919982898842" target="_blank" rel="noreferrer" className="btn btn-outline pm-cta__btn--outline">
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
