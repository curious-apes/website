import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Team.css'

gsap.registerPlugin(ScrollTrigger)

interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
  color: string
}

const team: TeamMember[] = [
  {
    name: 'Marcus Reid',
    role: 'Founder & Creative Director',
    bio: 'Former design lead at IDEO. Marcus obsesses over the intersection of aesthetics and function.',
    initials: 'MR',
    color: '#8a6f4e',
  },
  {
    name: 'Priya Kapoor',
    role: 'Head of Technology',
    bio: 'Full-stack engineer with deep WebGL and real-time rendering expertise. Built systems at scale.',
    initials: 'PK',
    color: '#9ab8c8',
  },
  {
    name: 'Leo Santos',
    role: 'Lead UX Designer',
    bio: 'Research-driven designer who spent 5 years at Google shaping enterprise productivity tools.',
    initials: 'LS',
    color: '#a8c8a0',
  },
  {
    name: 'Aiko Tanaka',
    role: 'Motion & 3D Lead',
    bio: 'Digital artist and animator. Her WebGL and Three.js work has been featured at design festivals worldwide.',
    initials: 'AT',
    color: '#c8a0b8',
  },
  {
    name: 'James Okafor',
    role: 'Brand Strategist',
    bio: 'Former McCann executive. James connects brand truth to business outcomes for clients across industries.',
    initials: 'JO',
    color: '#d4a86b',
  },
  {
    name: 'Sofia Reyes',
    role: 'Growth & Analytics',
    bio: 'Data scientist turned growth hacker. Sofia turns complex signals into clear, actionable strategy.',
    initials: 'SR',
    color: '#b0a8c8',
  },
]

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      const lines = headlineRef.current!.querySelectorAll('.team__headline-line span')
      gsap.fromTo(
        lines,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      const cards = gridRef.current!.querySelectorAll('.team-card')
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo(
        quoteRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="team" ref={sectionRef} className="team">
      <div className="container">
        <div className="team__header">
          <div ref={labelRef} className="section-label">
            The Team
          </div>
          <div ref={headlineRef} className="team__headline">
            <div className="team__headline-line">
              <span>Brilliant humans,</span>
            </div>
            <div className="team__headline-line team__headline-line--italic">
              <span>one mission.</span>
            </div>
          </div>
        </div>

        <div ref={gridRef} className="team__grid">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div
                className="team-card__avatar"
                style={{ '--member-color': member.color } as React.CSSProperties}
              >
                <div className="team-card__avatar-bg" />
                <span className="team-card__initials">{member.initials}</span>
                <div className="team-card__ape-icon">
                  <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="24" cy="36" rx="16" ry="14" fill="currentColor" opacity="0.1"/>
                    <ellipse cx="10" cy="32" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(-8 10 32)"/>
                    <ellipse cx="38" cy="32" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(8 38 32)"/>
                    <ellipse cx="13" cy="22" rx="5" ry="6" fill="currentColor" opacity="0.1"/>
                    <ellipse cx="35" cy="22" rx="5" ry="6" fill="currentColor" opacity="0.1"/>
                    <ellipse cx="24" cy="22" rx="13" ry="12" fill="currentColor" opacity="0.18"/>
                    <circle cx="20" cy="20" r="3.5" fill="currentColor" opacity="0.4"/>
                    <circle cx="28" cy="20" r="3.5" fill="currentColor" opacity="0.4"/>
                    <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
                    <circle cx="28" cy="20" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
              </div>

              <div className="team-card__info">
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role" style={{ color: member.color }}>
                  {member.role}
                </p>
                <p className="team-card__bio">{member.bio}</p>
              </div>

              <div className="team-card__social">
                <a href="#" className="team-card__social-link" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </a>
                <a href="#" className="team-card__social-link" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div ref={quoteRef} className="team__quote">
          <div className="team__quote-mark">&ldquo;</div>
          <blockquote className="team__quote-text">
            The best teams are made of people who care deeply about their craft
            and care even more about each other.
          </blockquote>
          <cite className="team__quote-cite">— Marcus Reid, Founder</cite>
        </div>
      </div>
    </section>
  )
}
