import { useCallback, useState } from 'react'
import Navbar from './Navbar'
import Contact from './Contact'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import Cursor from './Cursor'
import './ContactPage.css'

export default function ContactPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <section className="contact-page__hero">
          <div className="contact-page__hero-orb contact-page__hero-orb--1" />
          <div className="contact-page__hero-orb contact-page__hero-orb--2" />
          <div className="container contact-page__hero-inner">
            <div className="section-label contact-page__eyebrow">Get in Touch</div>
            <h1 className="contact-page__title">
              Let's Build Something<br />
              <span className="contact-page__title--grad">Worth Talking About.</span>
            </h1>
            <p className="contact-page__sub">
              Whether you're starting from scratch or ready to scale — drop us a message
              and we'll get back within 24 hours.
            </p>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ThemeToggle />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
