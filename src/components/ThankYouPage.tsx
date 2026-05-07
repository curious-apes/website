import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useDocumentHead } from '../lib/useDocumentHead'
import './ThankYouPage.css'

export default function ThankYouPage() {
  const cardRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<SVGSVGElement>(null)

  useDocumentHead({
    title: 'Thank You — Curious Apes',
    description: 'Your message has been received. The Curious Apes team will respond within 24 hours.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!cardRef.current) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }
    )
    if (checkRef.current) {
      const path = checkRef.current.querySelector<SVGPathElement>('.ty-check__path')
      if (path) {
        const len = path.getTotalLength()
        path.style.strokeDasharray = `${len}`
        path.style.strokeDashoffset = `${len}`
        tl.to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      }
    }
  }, [])

  return (
    <main className="thank-you">
      <div className="thank-you__bg-glow" aria-hidden="true" />

      <div className="container">
        <div className="thank-you__card" ref={cardRef}>
          <div className="thank-you__check">
            <svg ref={checkRef} viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <circle cx="40" cy="40" r="38" stroke="url(#tyGrad)" strokeWidth="1.5" />
              <path
                className="ty-check__path"
                d="M24 40 L36 52 L58 28"
                stroke="url(#tyGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="tyGrad" x1="0" y1="0" x2="80" y2="80">
                  <stop stopColor="#00c4d4" />
                  <stop offset="1" stopColor="#00f0ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="thank-you__title">
            Thank you. <span className="thank-you__title-grad">We&apos;ve got it.</span>
          </h1>

          <p className="thank-you__sub">
            Your message has landed in our inbox. A member of the Curious Apes team will
            get back to you within <strong>24 hours</strong> — usually a lot sooner.
          </p>

          <div className="thank-you__stats">
            <div className="thank-you__stat">
              <span className="thank-you__stat-value">4x</span>
              <span className="thank-you__stat-label">Avg. ROAS</span>
            </div>
            <div className="thank-you__stat-divider" aria-hidden="true" />
            <div className="thank-you__stat">
              <span className="thank-you__stat-value">80Cr+</span>
              <span className="thank-you__stat-label">Revenue Generated</span>
            </div>
            <div className="thank-you__stat-divider" aria-hidden="true" />
            <div className="thank-you__stat">
              <span className="thank-you__stat-value">50+</span>
              <span className="thank-you__stat-label">Brands Scaled</span>
            </div>
          </div>

          <div className="thank-you__actions">
            <Link to="/" className="btn btn-primary thank-you__btn">
              Back to Home
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/blog" className="thank-you__btn-ghost">
              Read our blog
            </Link>
          </div>

          <p className="thank-you__contact">
            Need a faster reply?{' '}
            <a
              href="https://wa.me/919982898842"
              target="_blank"
              rel="noreferrer"
              className="thank-you__contact-link"
            >
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
