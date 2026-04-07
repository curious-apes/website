import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Testimonials.css'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  name: string
  location: string
  role: string
  brand: string
  quote: string
  initial: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Mihir',
    location: 'Surat',
    role: 'Founder',
    brand: "Diruno Men's Fashion",
    quote: 'In the last four months, we have generated revenue from zero to thirty lakh per month. Curious Apes has been instrumental in building our D2C presence from the ground up.',
    initial: 'M',
  },
  {
    name: 'Arun Gupta',
    location: 'Gurugram',
    role: 'Founder',
    brand: 'Ultimats',
    quote: 'Our entire digital marketing requirement is met by Curious Apes. Their structured approach to Meta Ads and performance marketing has delivered consistent, scalable results.',
    initial: 'A',
  },
  {
    name: 'Piyush Soni',
    location: 'Jodhpur',
    role: 'Founder',
    brand: 'Khushbu Jewellers',
    quote: 'The team at Curious Apes truly understands the D2C model. They helped us scale our online jewellery brand with quality creatives and data-driven ad strategies.',
    initial: 'P',
  },
]

function TestimonialCard({ t, active }: { t: Testimonial; active: boolean }) {
  return (
    <div className={`testimonial-card ${active ? 'is-active' : ''}`}>
      <div className="testimonial-card__quote-mark">&ldquo;</div>
      <p className="testimonial-card__text">{t.quote}</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">{t.initial}</div>
        <div className="testimonial-card__meta">
          <span className="testimonial-card__name">{t.name}, {t.location}</span>
          <span className="testimonial-card__role">{t.role}, {t.brand}</span>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 82%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials">
      <div className="container">
        <div ref={containerRef} className="testimonials__inner">
          <div className="section-label testimonials__label">What Our Clients Say</div>
          <div className="testimonials__grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} active={activeTestimonial === i} />
            ))}
          </div>
          <div className="testimonials__dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${activeTestimonial === i ? 'is-active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
