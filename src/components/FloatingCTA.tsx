import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './FloatingCTA.css'

interface Props {
  onEnquiry: () => void
}

export default function FloatingCTA({ onEnquiry }: Props) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)

  // Show after scrolling past hero
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Entrance animation when first becomes visible
  useEffect(() => {
    if (!visible || !containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }
    )
  }, [visible])

  // Pulse animation on the toggle ring
  useEffect(() => {
    if (!pulseRef.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
    tl.fromTo(
      pulseRef.current,
      { scale: 1, opacity: 0.7 },
      { scale: 2.2, opacity: 0, duration: 1.2, ease: 'power2.out' }
    )
    return () => { tl.kill() }
  }, [])

  // Stagger items in/out on open toggle
  useEffect(() => {
    if (!itemsRef.current) return
    const items = itemsRef.current.querySelectorAll<HTMLElement>('.fcta__item')
    if (open) {
      gsap.fromTo(
        items,
        { y: 20, opacity: 0, scale: 0.7 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, stagger: 0.07, ease: 'back.out(1.7)' }
      )
    } else {
      gsap.to(items, { y: 12, opacity: 0, scale: 0.8, duration: 0.2, stagger: 0.04, ease: 'power2.in' })
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!visible) return null

  return (
    <div ref={containerRef} className="fcta" aria-label="Quick contact options">
      {/* Action items */}
      <div ref={itemsRef} className={`fcta__items ${open ? 'fcta__items--open' : ''}`}>
        {/* Enquiry Form */}
        <div className="fcta__item fcta__item--enquiry">
          <span className="fcta__label">Enquiry</span>
          <button
            className="fcta__btn fcta__btn--enquiry"
            aria-label="Open enquiry form"
            onClick={() => { setOpen(false); onEnquiry() }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {/* WhatsApp */}
        <div className="fcta__item fcta__item--whatsapp">
          <span className="fcta__label">WhatsApp</span>
          <a
            href="https://wa.me/919982898842"
            target="_blank"
            rel="noopener noreferrer"
            className="fcta__btn fcta__btn--whatsapp"
            aria-label="Chat on WhatsApp"
            onClick={() => setOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>
        </div>

        {/* Phone Call */}
        <div className="fcta__item fcta__item--call">
          <span className="fcta__label">Call Us</span>
          <a
            href="tel:+919982898842"
            className="fcta__btn fcta__btn--call"
            aria-label="Call us"
            onClick={() => setOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.32-1.32a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main toggle button */}
      <button
        ref={toggleRef}
        className={`fcta__toggle ${open ? 'fcta__toggle--open' : ''}`}
        aria-label={open ? 'Close quick contact' : 'Open quick contact'}
        onClick={() => setOpen(prev => !prev)}
      >
        <span ref={pulseRef} className="fcta__pulse" />
        <span className="fcta__toggle-icon fcta__toggle-icon--close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
        <span className="fcta__toggle-icon fcta__toggle-icon--open">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.32-1.32a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </span>
      </button>
    </div>
  )
}
