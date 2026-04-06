import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'
import apesImg from '../assets/logo.png'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  { id: '01', title: 'Paid Media', desc: 'Meta & Google Ads — structured, scalable, and focused on sustainable performance.' },
  { id: '02', title: 'Creative & Visuals', desc: 'UGC videos, CGI, static ads, branding and packaging that converts.' },
  { id: '03', title: 'Growth Marketing', desc: 'Reducing RTOs, improving margins, increasing prepaid orders and retention.' },
  { id: '04', title: 'Tech & CRO', desc: 'End-to-end Shopify dev, CRO and conversion-focused UI/UX design.' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        }
      )

      const lines = headlineRef.current!.querySelectorAll('.about__line-inner')
      gsap.fromTo(lines,
        { y: 90, opacity: 0, skewY: 3 },
        {
          y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' }
        }
      )

      gsap.fromTo(textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 84%' }
        }
      )

      gsap.fromTo(visualRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'power3.out',
          scrollTrigger: { trigger: visualRef.current, start: 'top 80%' }
        }
      )

      // Parallax on visual
      gsap.to(visualRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Pillars stagger
      const cards = pillarsRef.current!.querySelectorAll('.about__pillar')
      gsap.fromTo(cards,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 82%' }
        }
      )

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about">
      <div className="about__bg-line" />

      <div className="container">
        {/* Top: headline + body */}
        <div className="about__top">
          <div className="about__left">
            <div ref={labelRef} className="section-label">
              Who We Are
            </div>

            <div ref={headlineRef} className="about__headline">
              <div className="about__line"><span className="about__line-inner">One-Stop</span></div>
              <div className="about__line"><span className="about__line-inner about__line-inner--grad">Growth Partner</span></div>
              <div className="about__line"><span className="about__line-inner">for D2C Brands.</span></div>
            </div>

            <div ref={textRef} className="about__text">
              <p>
                We marry Paid Media, Creative, and Technology to create
                high-growth, profitable D2C brands.
              </p>
              <p>
                Curious Apes is a growth marketing company helping Indian D2C brands
                scale profitably through a data-driven, profit-first approach. Based in Jaipur
                with 8+ years of experience and backed by our sister concern The Cogent.
              </p>
              <a href="#services" className="btn btn-outline about__btn">
                Our Services
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right visual — cinematic logo card */}
          <div ref={visualRef} className="about__visual">
            <div className="about__visual-card">
              <img src={apesImg} alt="Curious Apes" className="about__visual-logo" />
              <div className="about__visual-tag">
                <span>Est.</span>
                <span className="about__visual-year">2025</span>
              </div>
              <div className="about__visual-orb" />
            </div>
          </div>
        </div>

        {/* Four pillars */}
        <div ref={pillarsRef} className="about__pillars">
          {pillars.map((p) => (
            <div key={p.id} className="about__pillar">
              <span className="about__pillar-num">{p.id}</span>
              <h3 className="about__pillar-title">{p.title}</h3>
              <p className="about__pillar-desc">{p.desc}</p>
              <div className="about__pillar-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
