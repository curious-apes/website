import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/curiousapes.in' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/curiousapes' },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const bigTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bigTextRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
        }
      )

      gsap.to(bigTextRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer__big-text" ref={bigTextRef} aria-hidden="true">
        CURIOUS APES
      </div>

      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#hero" className="footer__logo">
              <img
                src="/src/assets/original_logo.webp"
                alt="Curious Apes"
                className="footer__logo-img"
              />
            </a>
            <p className="footer__tagline">
              Growth partner for India&apos;s leading<br />D2C brands. Data-driven. Profit-first.
            </p>
            <a href="mailto:info@curiousapes.in" className="footer__email">
              info@curiousapes.in
            </a>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__link">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-col">
            <h4 className="footer__col-title">Connect</h4>
            <ul className="footer__links">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="footer__link footer__link--social">
                    {link.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="footer__contact-mini">
              <a href="tel:+919982898842" className="footer__phone">+91 99828 98842</a>
              <a href="tel:+917737229230" className="footer__phone">+91 77372 29230</a>
            </div>
          </div>

          <div className="footer__cta-block">
            <h4 className="footer__cta-title">
              Ready to scale your brand?
            </h4>
            <p className="footer__cta-text">
              Let&apos;s build a profitable D2C brand together.
            </p>
            <a href="#contact" className="btn btn-primary footer__cta-btn">
              Get Free Audit
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Curious Apes. All rights reserved.
          </p>
          <p className="footer__address">
            Mansarovar, Jaipur, Rajasthan 302020
          </p>
          <p className="footer__made">
            Made with curiosity &amp; craft
          </p>
        </div>
      </div>
    </footer>
  )
}
