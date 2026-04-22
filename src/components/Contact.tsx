import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { saveEnquiry } from '../lib/enquiries'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  phone: string
  website: string
  message: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLFormElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', website: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      const lines = headlineRef.current!.querySelectorAll('.contact__line-inner')
      gsap.fromTo(lines,
        { y: 90, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )

      gsap.fromTo(infoRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 82%' } }
      )

      if (formRef.current) {
        const fields = formRef.current.querySelectorAll('.contact__field, .contact__submit')
        gsap.fromTo(fields,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: formRef.current, start: 'top 82%' } }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

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
      await saveEnquiry({ ...formData, source: 'contact_section' })
      setSubmitted(true)
      gsap.fromTo('.contact__success',
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }
      )
    } catch (err) {
      console.error('Failed to submit enquiry:', err)
      setSubmitError('Something went wrong. Please try again or WhatsApp us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="contact__bg-glow" />

      <div className="container">
        <div className="contact__header">
          <div ref={labelRef} className="section-label">Get In Touch</div>
          <div ref={headlineRef} className="contact__headline">
            <div className="contact__line"><span className="contact__line-inner">Scale Your Brand</span></div>
            <div className="contact__line"><span className="contact__line-inner contact__line-inner--grad">With Us.</span></div>
          </div>
        </div>

        <div className="contact__body">

          {/* ── Left — Info panel ── */}
          <div ref={infoRef} className="contact__info">
            <div className="contact__info-accent" />
            <div className="contact__info-inner">

              <div className="contact__info-badge">
                <span className="contact__info-badge-dot" />
                Available for new projects
              </div>

              <div className="contact__info-title-block">
                <h3>Let's build something remarkable together.</h3>
                <p>We're a performance-first D2C agency helping brands scale from zero to crores.</p>
              </div>

              <div className="contact__info-divider" />

              <div className="contact__info-items">
                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4C2 3.45 2.45 3 3 3H13C13.55 3 14 3.45 14 4V12C14 12.55 13.55 13 13 13H3C2.45 13 2 12.55 2 12V4Z" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2 4L8 8.5L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="contact__info-item-content">
                    <span className="contact__info-item-label">Email</span>
                    <div className="contact__info-item-value">
                      <a href="mailto:info@curiousapes.in">info@curiousapes.in</a>
                    </div>
                  </div>
                </div>

                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 10.5L11 8.5C10.7 8.27 10.27 8.3 10 8.57L9 9.57C8.73 9.83 8.3 9.87 8 9.63C7.1 9 6 7.9 5.37 7C5.13 6.7 5.17 6.27 5.43 6L6.43 5C6.7 4.73 6.73 4.3 6.5 4L4.5 1.5C4.23 1.13 3.7 1.07 3.37 1.4L2.07 2.7C1.5 3.27 1.27 4.07 1.5 4.83C2.27 7.4 5.6 10.73 8.17 11.5C8.93 11.73 9.73 11.5 10.3 10.93L11.6 9.63C11.93 9.3 11.87 8.77 11.5 8.5Z" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="contact__info-item-content">
                    <span className="contact__info-item-label">Call Us</span>
                    <div className="contact__info-item-value">
                      <a href="tel:+919982898842">+91 99828 98842</a>
                      <a href="tel:+917737229230">+91 77372 29230</a>
                    </div>
                  </div>
                </div>

                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.52 10.48 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="contact__info-item-content">
                    <span className="contact__info-item-label">Studio</span>
                    <div className="contact__info-item-value">
                      A-46-A, Vande Mataram Marg,<br />Mansarovar, Jaipur 302020
                    </div>
                  </div>
                </div>

                <div className="contact__info-item">
                  <div className="contact__info-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="contact__info-item-content">
                    <span className="contact__info-item-label">Working Hours</span>
                    <div className="contact__info-item-value">Mon – Sat: 9:00 AM – 7:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="contact__info-divider" />

              <div className="contact__info-socials">
                <a href="https://www.instagram.com/curious.apes/" target="_blank" rel="noreferrer" className="contact__info-social">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/curious-apesin/" target="_blank" rel="noreferrer" className="contact__info-social">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* ── Right — Form panel ── */}
          <div className="contact__form-wrapper">
            <div className="contact__form-header">
              <h3>Send us a message</h3>
              <p>We'll review your details and get back to you within 24 hours.</p>
            </div>

            {!submitted ? (
              <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="contact__label">Your Name *</label>
                    <input type="text" name="name" className="contact__input"
                      placeholder="Full name" value={formData.name}
                      onChange={handleChange} required />
                  </div>
                  <div className="contact__field">
                    <label className="contact__label">Phone Number *</label>
                    <input type="tel" name="phone" className="contact__input"
                      placeholder="+91 99999 99999" value={formData.phone}
                      onChange={handleChange} required />
                  </div>
                </div>

                <div className="contact__field">
                  <label className="contact__label">Website URL</label>
                  <input type="text" name="website" className="contact__input"
                    placeholder="yourbrand.com" value={formData.website}
                    onChange={handleChange} />
                </div>

                <div className="contact__field">
                  <label className="contact__label">Message</label>
                  <textarea name="message" className="contact__textarea" rows={5}
                    placeholder="Tell us about your brand and goals..."
                    value={formData.message} onChange={handleChange} />
                </div>

                <div className="contact__submit">
                  <button type="submit" className="btn btn-primary contact__submit-btn" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Submit Details'}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {submitError
                    ? <p className="contact__note" style={{ color: '#f87171' }}>{submitError}</p>
                    : <p className="contact__note">No spam. We respond within 24 hours.</p>
                  }
                </div>
              </form>
            ) : (
              <div className="contact__success">
                <div className="contact__success-icon">
                  <svg viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="24" stroke="url(#cg)" strokeWidth="1.5"/>
                    <path d="M18 28L24 34L38 20" stroke="url(#cg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="cg" x1="0" y1="0" x2="56" y2="56">
                        <stop stopColor="#00c4d4"/><stop offset="1" stopColor="#00f0ff"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="contact__success-title">Details Received!</h3>
                <p className="contact__success-text">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
