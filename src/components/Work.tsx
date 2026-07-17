import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'

// Import all reels
import reel1 from '../assets/work/1.mp4'
import reel2 from '../assets/work/2.mp4'
import reel3 from '../assets/work/3.mp4'
import reel4 from '../assets/work/4.mp4'
import reel5 from '../assets/work/5.mp4'
import reel6 from '../assets/work/6.mp4'
import reel7 from '../assets/work/7.mp4'
import reel8 from '../assets/work/8.mp4'
import reel9 from '../assets/work/9.mp4'
import reel10 from '../assets/work/10.mp4'
import reel11 from '../assets/work/11.mp4'
import reel12 from '../assets/work/12.mp4'
import reel13 from '../assets/work/13.mp4'
import reel14 from '../assets/work/14.mp4'
import reel15 from '../assets/work/15.mp4'
import reel16 from '../assets/work/16.mp4'
import reel17 from '../assets/work/17.mp4'
import reel18 from '../assets/work/18.mp4'
import reel19 from '../assets/work/19.mp4'
import reel20 from '../assets/work/20.mp4'
import reel21 from '../assets/work/21.mp4'

// Poster thumbnails (first frame) — shown instantly so the slider isn't blank
// while a reel loads, and so side reels don't have to decode video.
import p1 from '../assets/work/posters/1.webp'
import p2 from '../assets/work/posters/2.webp'
import p3 from '../assets/work/posters/3.webp'
import p4 from '../assets/work/posters/4.webp'
import p5 from '../assets/work/posters/5.webp'
import p6 from '../assets/work/posters/6.webp'
import p7 from '../assets/work/posters/7.webp'
import p8 from '../assets/work/posters/8.webp'
import p9 from '../assets/work/posters/9.webp'
import p10 from '../assets/work/posters/10.webp'
import p11 from '../assets/work/posters/11.webp'
import p12 from '../assets/work/posters/12.webp'
import p13 from '../assets/work/posters/13.webp'
import p14 from '../assets/work/posters/14.webp'
import p15 from '../assets/work/posters/15.webp'
import p16 from '../assets/work/posters/16.webp'
import p17 from '../assets/work/posters/17.webp'
import p18 from '../assets/work/posters/18.webp'
import p19 from '../assets/work/posters/19.webp'
import p20 from '../assets/work/posters/20.webp'
import p21 from '../assets/work/posters/21.webp'

gsap.registerPlugin(ScrollTrigger)

const reels = [
  reel1, reel2, reel3, reel4, reel5, reel6, reel7,
  reel8, reel9, reel10, reel11, reel12, reel13, reel14,
  reel15, reel16, reel17, reel18, reel19, reel20, reel21,
]

const posters = [
  p1, p2, p3, p4, p5, p6, p7,
  p8, p9, p10, p11, p12, p13, p14,
  p15, p16, p17, p18, p19, p20, p21,
]

interface ReelSliderProps {
  startIndex?: number
  label?: string
  heading?: React.ReactNode
}

function ReelSlider({ startIndex = 0, label = 'Our Work', heading }: ReelSliderProps) {
  const [active, setActive] = useState(startIndex % reels.length)
  // Only load/play reels once the slider is on screen — keeps the ~4.7MB center
  // reel off the initial page load (it's below the fold).
  const [inView, setInView] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressAnim = useRef<gsap.core.Tween | null>(null)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const total = reels.length

  const goTo = (next: number) => setActive(next)
  const prev = () => goTo((active - 1 + total) % total)
  const next = () => goTo((active + 1) % total)

  // Play active video (only when on screen), pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (inView && i === active) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [active, inView])

  // Progress bar + autoplay advance on video end (paused while off screen)
  useEffect(() => {
    progressAnim.current?.kill()
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
    if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 })
    if (!inView) return

    const vid = videoRefs.current[active]

    const advance = () => goTo((active + 1) % total)

    const startProgress = (duration: number) => {
      progressAnim.current = gsap.to(progressRef.current, {
        scaleX: 1,
        duration,
        ease: 'none',
        onComplete: advance,
      })
    }

    if (!vid) {
      fallbackTimer.current = setTimeout(advance, 6000)
      return
    }

    const onEnd = () => advance()
    vid.addEventListener('ended', onEnd, { once: true })

    const onMeta = () => {
      const dur = vid.duration && isFinite(vid.duration) ? vid.duration : 6
      startProgress(dur)
      fallbackTimer.current = setTimeout(advance, (dur + 1) * 1000)
    }

    if (vid.readyState >= 1) {
      onMeta()
    } else {
      vid.addEventListener('loadedmetadata', onMeta, { once: true })
      fallbackTimer.current = setTimeout(() => {
        startProgress(6)
      }, 500)
    }

    return () => {
      progressAnim.current?.kill()
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      vid.removeEventListener('ended', onEnd)
    }
  }, [active, inView]) // eslint-disable-line react-hooks/exhaustive-deps

  // Defer reel loading: mark in-view when the slider is near the viewport.
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '250px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Scroll-trigger entrance
  useEffect(() => {
    if (!sliderRef.current) return
    gsap.fromTo(sliderRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sliderRef.current, start: 'top 85%' } }
    )
  }, [])

  const getSlotIndex = (offset: number) => (active + offset + total) % total

  return (
    <div ref={sliderRef} className="reel-slider">
      <div className="reel-slider__label section-label">{label}</div>
      {heading && <h2 className="reel-slider__heading">{heading}</h2>}

      <div className="reel-slider__stage">
        <div className="reel-slider__vignette" />

        {[-2, -1].map((offset) => (
          <div
            key={offset}
            className={`reel-slot reel-slot--side reel-slot--left reel-slot--${Math.abs(offset) === 2 ? 'far' : 'near'}`}
            onClick={prev}
          >
            <video
              ref={(el) => { videoRefs.current[getSlotIndex(offset)] = el }}
              src={reels[getSlotIndex(offset)]}
              poster={posters[getSlotIndex(offset)]}
              muted playsInline loop preload="none"
            />
            <div className="reel-slot__overlay" />
          </div>
        ))}

        <div className="reel-slot reel-slot--center">
          <video
            ref={(el) => { videoRefs.current[active] = el }}
            src={reels[active]}
            poster={posters[active]}
            muted playsInline preload="none"
          />
          <div className="reel-slot__counter">
            <span className="reel-slot__counter-curr">{String(active + 1).padStart(2, '0')}</span>
            <span className="reel-slot__counter-sep">/</span>
            <span className="reel-slot__counter-total">{String(total).padStart(2, '0')}</span>
          </div>
          <div className="reel-slot__progress-wrap">
            <div ref={progressRef} className="reel-slot__progress-bar" />
          </div>
        </div>

        {[1, 2].map((offset) => (
          <div
            key={offset}
            className={`reel-slot reel-slot--side reel-slot--right reel-slot--${offset === 2 ? 'far' : 'near'}`}
            onClick={next}
          >
            <video
              ref={(el) => { videoRefs.current[getSlotIndex(offset)] = el }}
              src={reels[getSlotIndex(offset)]}
              poster={posters[getSlotIndex(offset)]}
              muted playsInline loop preload="none"
            />
            <div className="reel-slot__overlay" />
          </div>
        ))}
      </div>

      <div className="reel-slider__nav">
        <button className="reel-slider__btn" onClick={prev} aria-label="Previous reel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="reel-slider__dots">
          {reels.map((_, i) => (
            <button
              key={i}
              className={`reel-slider__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Reel ${i + 1}`}
            />
          ))}
        </div>
        <button className="reel-slider__btn" onClick={next} aria-label="Next reel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="reel-slider__filmstrip">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="reel-slider__filmstrip-hole" />
        ))}
      </div>
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" className="work">
      <div className="container">
        <ReelSlider
          startIndex={0}
          label="Our Work"
          heading={<>Reels That <span className="reel-slider__heading--grad">Convert.</span></>}
        />
      </div>
    </section>
  )
}
