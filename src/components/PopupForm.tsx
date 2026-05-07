import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { saveEnquiry } from '../lib/enquiries'
import { submitToZoho } from '../lib/zoho'
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
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', website: '', message: '' })

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

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await saveEnquiry({ ...formData, source: 'popup' })
      // Mirror to Zoho CRM — fire-and-forget; never blocks the user
      submitToZoho({
        name: formData.name,
        phone: formData.phone,
        website: formData.website,
        message: formData.message,
      })
      onClose()
      navigate('/thankyou')
    } catch (err) {
      console.error('Failed to submit enquiry:', err)
      setSubmitError('Something went wrong. Please try again or WhatsApp us directly.')
      setSubmitting(false)
    }
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

          <button type="submit" className="btn btn-primary popup-form__submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Message'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {submitError
            ? <p className="popup-form__note" style={{ color: '#f87171' }}>{submitError}</p>
            : <p className="popup-form__note">No spam. We respond within 24 hours.</p>
          }
        </form>
      </div>
    </div>
  )
}
