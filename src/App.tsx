import { useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
// import About from './components/About'
import Clients from './components/Clients'
import Services from './components/Services'
import Work from './components/Work'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import PopupForm from './components/PopupForm'
import FloatingCTA from './components/FloatingCTA'
import ScrollToTop from './components/ScrollToTop'
import type { BlogPost } from './lib/blogs'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App({ blogPosts }: { blogPosts?: BlogPost[] } = {}) {
  const [popupOpen, setPopupOpen] = useState(false)

  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  // Native scrolling (no Lenis) — GSAP ScrollTrigger updates itself on the
  // browser's native scroll, and dropping the smooth-scroll RAF loop removes the
  // per-frame overhead that was amplifying scroll jank.

  // Global click interceptor — catches every href="#contact" link
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a[href="#contact"]')
      if (!target) return
      e.preventDefault()
      openPopup()
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [openPopup])

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        {/* <About /> */}
        <Clients />
        <Services />
        <Work />
        <Testimonials />
        <Blog posts={blogPosts} />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ScrollToTop />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}

export default App
