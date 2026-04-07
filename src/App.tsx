import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from '@studio-freight/lenis'
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
import ThemeToggle from './components/ThemeToggle'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const openPopup  = useCallback(() => setPopupOpen(true),  [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

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
        <Blog />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA onEnquiry={openPopup} />
      <ScrollToTop />
      <ThemeToggle />
      <PopupForm open={popupOpen} onClose={closePopup} />
    </>
  )
}

export default App
