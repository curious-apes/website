import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'
import GrowthDashboard from './GrowthDashboard'
import ndlClient1 from '../assets/number_dont_lie/client-1.png'
import ndlClient2 from '../assets/number_dont_lie/client-2.png'
import ndlClient3 from '../assets/number_dont_lie/client-3.png'
import ndlClient4 from '../assets/number_dont_lie/client-4.png'
import ndlClient5 from '../assets/number_dont_lie/client-5.png'
import ndlClient7 from '../assets/number_dont_lie/client-7.png'
import ndlClient8 from '../assets/number_dont_lie/client-8.png'
import ndlClient9 from '../assets/number_dont_lie/client-9.png'

const ndlClients = [
  { src: ndlClient1, alt: 'Client 1' },
  { src: ndlClient2, alt: 'Client 2' },
  { src: ndlClient3, alt: 'Client 3' },
  { src: ndlClient4, alt: 'Client 4' },
  { src: ndlClient5, alt: 'Client 5' },
  { src: ndlClient7, alt: 'Client 7' },
  { src: ndlClient8, alt: 'Client 8' },
  { src: ndlClient9, alt: 'Client 9' },
]

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ndlTrackRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const metricRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      tl.fromTo(badgeRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      const lines = headlineRef.current!.querySelectorAll('.hero__line-inner')
      tl.fromTo(lines,
        { y: 110, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out' },
        '-=0.5'
      )

      tl.fromTo(subRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )

      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )

      tl.fromTo(statsRef.current!.querySelectorAll('.hero__stat'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
        '-=0.4'
      )

      // Metric cards stagger in
      tl.fromTo(metricRefs.current.filter(Boolean),
        { scale: 0.7, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.5)' },
        '-=0.8'
      )

      // NDL cards scroll
      if (ndlTrackRef.current) {
        gsap.to(ndlTrackRef.current, {
          xPercent: -50,
          duration: 30,
          ease: 'none',
          repeat: -1,
        })
      }


    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="hero">
      <div className="hero__noise" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />
      <div ref={overlayRef} className="hero__scroll-overlay" />

      <div className="hero__main container">
        {/* LEFT — Copy */}
        <div className="hero__copy">
          <div ref={badgeRef} className="hero__badge">
            <span className="hero__badge-dot" />
            Growth Partner for India&apos;s Leading D2C Brands
          </div>

          <div ref={headlineRef} className="hero__headline">
            <div className="hero__line">
              <span className="hero__line-inner">Data-Driven</span>
            </div>
            <div className="hero__line">
              <span className="hero__line-inner hero__line-inner--grad">eCommerce</span>
            </div>
            <div className="hero__line">
              <span className="hero__line-inner">Agency</span>
            </div>
          </div>

          <p ref={subRef} className="hero__sub">
            We help brands scale their online presence with proven strategies
            and cutting-edge technology — combining Tech, Analytics, Visuals &amp; Paid Media.
          </p>

          <div ref={ctaRef} className="hero__actions">
            <a href="https://www.curiousapes.in/profile/company-profile.pdf" target="_blank" rel="noreferrer" className="btn btn-primary hero__cta-primary">
              View Profile
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#services" className="btn btn-outline hero__cta-secondary">
              Our Services
            </a>
          </div>

          <div ref={statsRef} className="hero__stats-inline">
            <div className="hero__stat">
              <span className="hero__stat-number">20Cr+</span>
              <span className="hero__stat-label">Ad Budget Managed</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">80Cr+</span>
              <span className="hero__stat-label">Revenue Generated</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">4x</span>
              <span className="hero__stat-label">Average ROAS</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Visual */}
        <div className="hero__visual">
          <GrowthDashboard />

          <div
            className="hero__metric hero__metric--1"
            ref={(el) => { metricRefs.current[0] = el }}
            data-cursor="hover"
          >
            <span className="hero__metric-arrow">↑</span>
            <span className="hero__metric-value">4x</span>
            <span className="hero__metric-label">Avg. ROAS</span>
          </div>

          <div
            className="hero__metric hero__metric--2"
            ref={(el) => { metricRefs.current[1] = el }}
            data-cursor="hover"
          >
            <span className="hero__metric-arrow">↑</span>
            <span className="hero__metric-value">80Cr+</span>
            <span className="hero__metric-label">Revenue</span>
          </div>

          <div
            className="hero__metric hero__metric--3"
            ref={(el) => { metricRefs.current[2] = el }}
            data-cursor="hover"
          >
            <span className="hero__metric-arrow">↑</span>
            <span className="hero__metric-value">50+</span>
            <span className="hero__metric-label">Brands</span>
          </div>
        </div>
      </div>

      {/* Numbers Don't Lie — cinematic proof strip */}
      <div className="hero__ndl">
        <div className="hero__ndl-header container">
          <div className="hero__ndl-eyebrow">
            <span className="hero__ndl-line" />
            <span className="hero__ndl-tag">Numbers Don&apos;t Lie</span>
            <span className="hero__ndl-line" />
          </div>
          <p className="hero__ndl-sub">Real results. Real brands. Real revenue.</p>
        </div>

        <div className="hero__ndl-track-wrap">
          <div className="hero__ndl-fade hero__ndl-fade--left" />
          <div className="hero__ndl-fade hero__ndl-fade--right" />
          <div ref={ndlTrackRef} className="hero__ndl-track">
            {[...ndlClients, ...ndlClients].map((client, i) => (
              <div key={i} className="hero__ndl-card">
                <img src={client.src} alt={client.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
