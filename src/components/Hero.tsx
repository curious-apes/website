import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'
import ScalingConsole from './ScalingConsole'
import ndlClient1 from '../assets/number_dont_lie/client-1.webp'
import ndlClient2 from '../assets/number_dont_lie/client-2.webp'
import ndlClient3 from '../assets/number_dont_lie/client-3.webp'
import ndlClient4 from '../assets/number_dont_lie/client-4.webp'
import ndlClient5 from '../assets/number_dont_lie/client-5.webp'
import ndlClient7 from '../assets/number_dont_lie/client-7.webp'
import ndlClient8 from '../assets/number_dont_lie/client-8.webp'
import ndlClient9 from '../assets/number_dont_lie/client-9.webp'

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

/* The exact sentences D2C founders say out loud. Rotating these is the hook:
   whichever one is on screen, some visitor is nodding at it. */
const PAINS = [
  'Meta CAC keeps climbing.',
  'ROAS looked great at ₹2L/day. Not at ₹8L.',
  'Great product. Nobody scrolls past it.',
  'Agencies send reports, not revenue.',
  'Traffic is up. Orders aren’t.',
]

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const ndlTrackRef = useRef<HTMLDivElement>(null)

  const [painIndex, setPainIndex] = useState(0)

  // Rotate the pain line. Pure state swap + CSS transition — no layout thrash.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const t = setInterval(() => setPainIndex((i) => (i + 1) % PAINS.length), 3200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 })

      tl.fromTo(badgeRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      )

      const lines = headlineRef.current!.querySelectorAll('.hero__line-inner')
      tl.fromTo(lines,
        { y: 110, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.05, stagger: 0.09, ease: 'power4.out' },
        '-=0.45'
      )

      tl.fromTo(subRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.6'
      )

      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
        '-=0.5'
      )

      tl.fromTo(statsRef.current!.querySelectorAll('.hero__proof-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      )

      tl.fromTo(visualRef.current,
        { y: 36, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.95'
      )

      // NDL infinite marquee — only run while on screen, and never under
      // reduced-motion, so it doesn't burn frames scrolling past.
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (ndlTrackRef.current && !prefersReduced) {
        const marquee = gsap.to(ndlTrackRef.current, {
          xPercent: -50,
          duration: 30,
          ease: 'none',
          repeat: -1,
          paused: true,
        })
        ScrollTrigger.create({
          trigger: ndlTrackRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? marquee.play() : marquee.pause()),
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="hero">
      <div className="hero__noise" />
      <div className="hero__grid-bg" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      <div className="hero__main container">
        {/* SEO H1 — the visible headline is animated <div>s, so the page's real
            <h1> is carried here (visually hidden, still in the DOM for crawlers). */}
        <h1 className="sr-only">E-Commerce Growth Agency That Helps D2C Brands Scale Faster</h1>

        {/* LEFT — Copy */}
        <div className="hero__copy">
          <div ref={badgeRef} className="hero__badge">
            <span className="hero__badge-dot" />
            D2C Growth Partner · 50+ Indian brands scaled
          </div>

          <div ref={headlineRef} className="hero__headline">
            <div className="hero__line">
              <span className="hero__line-inner">Your product</span>
            </div>
            <div className="hero__line">
              <span className="hero__line-inner">deserves better</span>
            </div>
            <div className="hero__line">
              <span className="hero__line-inner hero__line-inner--grad">numbers.</span>
            </div>
          </div>

          {/* The rotating founder-pain line — the "we get it" moment */}
          <div className="hero__pain" aria-live="off">
            <span className="hero__pain-quote">&ldquo;</span>
            <span key={painIndex} className="hero__pain-text">
              {PAINS[painIndex]}
            </span>
          </div>

          <p ref={subRef} className="hero__sub">
            We&apos;re the D2C team brands call when growth stalls. Paid media,
            creative and analytics run as one system — so every rupee of ad
            spend is traceable to revenue, not to a slide deck.
          </p>

          <div ref={ctaRef} className="hero__actions">
            <a href="#contact" className="btn btn-primary hero__cta-primary">
              Get a free growth audit
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="https://www.curiousapes.in/profile/company-profile.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline hero__cta-secondary"
            >
              See our work
            </a>
          </div>

          <div ref={statsRef} className="hero__proof">
            <div className="hero__proof-item">
              <span className="hero__proof-number">₹20Cr+</span>
              <span className="hero__proof-label">Ad spend managed</span>
            </div>
            <div className="hero__proof-item">
              <span className="hero__proof-number">₹80Cr+</span>
              <span className="hero__proof-label">Revenue generated</span>
            </div>
            <div className="hero__proof-item">
              <span className="hero__proof-number">4×</span>
              <span className="hero__proof-label">Average ROAS</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Visual */}
        <div ref={visualRef} className="hero__visual">
          <ScalingConsole />
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
                <img src={client.src} alt={client.alt} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
