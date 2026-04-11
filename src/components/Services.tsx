import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  id: string
  title: string
  tagline: string
  desc: string
  tags: string[]
  icon: React.ReactNode
  href?: string
}

const services: Service[] = [
  {
    id: '01',
    title: 'Paid Media',
    tagline: 'Meta & Google Ads',
    desc: 'A data-led, structured, and scalable approach to Meta and Google Ads focused on sustainable performance and ROI.',
    tags: ['Meta Ads', 'Google Ads', 'Performance Max', 'ROAS Optimisation'],
    href: '/services/paid-media',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 36L16 26L22 32L30 20L40 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="36" r="3" fill="currentColor" opacity="0.4"/>
        <circle cx="40" cy="28" r="3" fill="currentColor" opacity="0.4"/>
        <path d="M10 14H38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
        <path d="M10 10H26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: '02',
    title: 'Growth Marketing',
    tagline: 'Profitable Scaling',
    desc: 'Driving profitable growth by reducing RTOs, improving contribution margins, increasing prepaid orders, and strengthening retention.',
    tags: ['RTO Reduction', 'Retention', 'Prepaid Orders', 'CAC Optimisation'],
    href: '/services/growth-marketing',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 8L40 18V30L24 40L8 30V18L24 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M24 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 22H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: '03',
    title: 'Visuals & Creative',
    tagline: 'Content that Converts',
    desc: 'UGC videos, CGI and animations, paid collaborations, static ads, branding and packaging — creative that stops the scroll.',
    tags: ['UGC Videos', 'CGI & Animation', 'Static Ads', 'Branding'],
    href: '/services/visuals-creative',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="12" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="22" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 32L16 24L22 30L30 22L42 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="10" r="4" fill="currentColor" opacity="0.25"/>
      </svg>
    ),
  },
  {
    id: '04',
    title: 'Tech & CRO',
    tagline: 'End-to-End eCommerce',
    desc: 'End-to-end e-commerce solutions covering website and app development, CRO, and conversion-focused UI/UX design.',
    tags: ['Shopify Dev', 'CRO', 'UI/UX', 'App Development'],
    href: '/services/tech-cro',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18L8 24L16 30M32 18L40 24L32 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 12L20 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.2"/>
      </svg>
    ),
  },
]

interface Rotation { x: number; y: number }

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 7
    const rotateX = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 5
    setRotation({ x: rotateX, y: rotateY })
  }

  const cardContent = (
    <div
      ref={cardRef}
      className={`service-card ${hovered ? 'is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setRotation({ x: 0, y: 0 }); setHovered(false) }}
      style={{
        transform: `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: hovered ? 'transform 0.1s ease' : 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        '--delay': `${index * 0.08}s`,
      } as React.CSSProperties}
    >
      <div className="service-card__top">
        <span className="service-card__id">{service.id}</span>
        <div className="service-card__icon">{service.icon}</div>
      </div>
      <p className="service-card__tagline">{service.tagline}</p>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__desc">{service.desc}</p>
      <div className="service-card__tags">
        {service.tags.map((tag) => (
          <span key={tag} className="service-card__tag">{tag}</span>
        ))}
      </div>
      <div className="service-card__arrow">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="service-card__glow" />
      <div className="service-card__border-gradient" />
    </div>
  )

  return service.href
    ? <Link to={service.href} style={{ textDecoration: 'none' }}>{cardContent}</Link>
    : cardContent
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      const lines = headlineRef.current!.querySelectorAll('.services__line-inner')
      gsap.fromTo(lines,
        { y: 90, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )

      gsap.fromTo(introRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: introRef.current, start: 'top 84%' } }
      )

      const cards = gridRef.current!.querySelectorAll('.service-card')
      gsap.fromTo(cards,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="services">
      <div className="services__bg-gradient" />

      <div className="container">
        <div className="services__header">
          <div className="services__header-left">
            <div ref={labelRef} className="section-label">What We Do</div>
            <div ref={headlineRef} className="services__headline">
              <div className="services__line"><span className="services__line-inner">Our Core</span></div>
              <div className="services__line"><span className="services__line-inner services__line-inner--grad">Capabilities</span></div>
            </div>
          </div>
          <p ref={introRef} className="services__intro">
            From Paid Media to Tech — we bring every growth lever under one roof,
            delivering a seamless, data-driven path to profitable scale.
          </p>
        </div>

        <div ref={gridRef} className="services__grid">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <div className="services__cta">
          <a href="#contact" className="btn btn-primary">
            Get a Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
