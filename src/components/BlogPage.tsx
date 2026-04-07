import { useCallback, useState } from 'react'
import Navbar from './Navbar'
import Blog from './Blog'
import Footer from './Footer'
import PopupForm from './PopupForm'
import FloatingCTA from './FloatingCTA'
import ThemeToggle from './ThemeToggle'
import Cursor from './Cursor'
import './BlogPage.css'

export default function BlogPage() {
  const [popupOpen, setPopupOpen] = useState(false)
  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <section className="blog-page__hero">
          <div className="blog-page__hero-orb blog-page__hero-orb--1" />
          <div className="blog-page__hero-orb blog-page__hero-orb--2" />
          <div className="container blog-page__hero-inner">
            <div className="section-label blog-page__eyebrow">From the Desk</div>
            <h1 className="blog-page__title">
              Insights &amp; <span className="blog-page__title--grad">Playbooks.</span>
            </h1>
            <p className="blog-page__sub">
              Real strategies. Real numbers. No fluff — just what's working
              for Indian D2C brands right now.
            </p>
          </div>
        </section>

        <Blog />
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ThemeToggle />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}
