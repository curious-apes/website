import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { saveEnquiry } from '../lib/enquiries'
import './PopupForm.css'

interface FormData {
  name: string
  phone: string
  website: string
  message: string
}

interface PopupFormProps {
  open: boolean
  onClose: () => void
}

export default function PopupForm({ open, onClose }: PopupFormProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', website: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  // Animate in / out
  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlayRef.current, { display: 'flex' })
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(cardRef.current,
        { y: 48, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(cardRef.current, { y: 32, opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' })
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' })
          setSubmitted(false)
          setFormData({ name: '', phone: '', website: '', message: '' })
        }
      })
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveEnquiry({ ...formData, source: 'popup' })
    setSubmitted(true)
    gsap.fromTo('.popup-form__success',
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )
  }

  return (
    <div ref={overlayRef} className="popup-overlay" style={{ display: 'none' }} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}>
      <div ref={cardRef} className="popup-card" role="dialog" aria-modal="true">

        {/* Close */}
        <button className="popup-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="popup-header">
              <div className="popup-eyebrow section-label">Let's Talk</div>
              <h2 className="popup-title">Scale Your Brand<br /><span className="popup-title--grad">With Curious Apes.</span></h2>
              <p className="popup-sub">Fill in the details and we'll get back within 24 hours.</p>
            </div>

            <form className="popup-form" onSubmit={handleSubmit}>
              <div className="popup-form__row">
                <div className="popup-form__field">
                  <label className="popup-form__label">Your Name *</label>
                  <input
                    type="text" name="name" required
                    className="popup-form__input"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="popup-form__field">
                  <label className="popup-form__label">Phone Number *</label>
                  <input
                    type="tel" name="phone" required
                    className="popup-form__input"
                    placeholder="+91 99999 99999"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="popup-form__field">
                <label className="popup-form__label">Website URL</label>
                <input
                  type="text" name="website"
                  className="popup-form__input"
                  placeholder="yourbrand.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="popup-form__field">
                <label className="popup-form__label">Message</label>
                <textarea
                  name="message" rows={4}
                  className="popup-form__textarea"
                  placeholder="Tell us about your brand and goals..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary popup-form__submit">
                Send Message
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="popup-form__note">No spam. We respond within 24 hours.</p>
            </form>
          </>
        ) : (
          <div className="popup-form__success">
            <div className="popup-form__success-icon">
              <svg viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="24" stroke="url(#pg)" strokeWidth="1.5"/>
                <path d="M18 28L24 34L38 20" stroke="url(#pg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="56" y2="56">
                    <stop stopColor="#00c4d4"/><stop offset="1" stopColor="#00f0ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="popup-form__success-title">We've Got Your Details!</h3>
            <p className="popup-form__success-text">Our team will reach out within 24 hours. Talk soon!</p>
            <button className="btn btn-outline popup-form__success-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}
