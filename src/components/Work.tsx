import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Work.css'

// Import client logos
import logoAmayu from '../assets/client_logo/amayu.png'
import logoAmodini from '../assets/client_logo/amodini.png'
import logoAquaAce from '../assets/client_logo/aqua ace.png'
import logoAruwa from '../assets/client_logo/aruwa.png'
import logoAuthentics from '../assets/client_logo/authentics.png'
import logoBabyMonk from '../assets/client_logo/babymonk.png'
import logoBlba from '../assets/client_logo/blba.png'
import logoDhun from '../assets/client_logo/dhun.png'
import logoEcofit from '../assets/client_logo/ecofit.png'
import logoGhumar from '../assets/client_logo/ghumar.png'
import logoGulabi from '../assets/client_logo/gulabi.png'
import logoJaipurStudio from '../assets/client_logo/jaipur studio.png'
import logoJkj from '../assets/client_logo/jkj.png'
import logoKaashi from '../assets/client_logo/kaashi.png'
import logoKatha from '../assets/client_logo/katha.png'
import logoLivvasa from '../assets/client_logo/livvasa.png'
import logoPawblaze from '../assets/client_logo/pawblaze.png'
import logoPlusBeauty from '../assets/client_logo/plus beauty.png'
import logoRareblings from '../assets/client_logo/rareblings.png'
import logoReetrang from '../assets/client_logo/reetrang.png'
import logoSanjay from '../assets/client_logo/sanjay.png'
import logoScintaillre from '../assets/client_logo/scintaillre.png'
import logoShashak from '../assets/client_logo/shashak.png'
import logoSpiritual from '../assets/client_logo/spritual senses.png'
import logoTarunima from '../assets/client_logo/tarunima.png'
import logoThatGirl from '../assets/client_logo/that girl.png'
import logoTistabene from '../assets/client_logo/tistabene.png'
import logoToneNTint from '../assets/client_logo/tone n tint.png'
import logoTushti from '../assets/client_logo/tushti.png'
import logoUltimats from '../assets/client_logo/ultimats.png'
import logoUrbannaari from '../assets/client_logo/urbannaari.png'
import logoVaraya from '../assets/client_logo/varaya.png'
import logoWagdo from '../assets/client_logo/wagdo.png'

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

gsap.registerPlugin(ScrollTrigger)

const reels = [
  reel1, reel2, reel3, reel4, reel5, reel6, reel7,
  reel8, reel9, reel10, reel11, reel12, reel13, reel14,
  reel15, reel16, reel17, reel18, reel19, reel20, reel21,
]

const clients = [
  { name: 'Jaipur Studio',    logo: logoJaipurStudio },
  { name: 'Shashak',          logo: logoShashak },
  { name: 'Tarunima',         logo: logoTarunima },
  { name: 'Aqua Ace',         logo: logoAquaAce },
  { name: 'Authentics',       logo: logoAuthentics },
  { name: 'Spiritual Senses', logo: logoSpiritual },
  { name: 'Katha',            logo: logoKatha },
  { name: 'Ghumar',           logo: logoGhumar },
  { name: 'Gulabi',           logo: logoGulabi },
  { name: 'Aruwa',            logo: logoAruwa },
  { name: 'Tushti',           logo: logoTushti },
  { name: 'Wagdo',            logo: logoWagdo },
  { name: 'Ultimats',         logo: logoUltimats },
  { name: 'Tone N Tint',      logo: logoToneNTint },
  { name: 'Amayu',            logo: logoAmayu },
  { name: 'Baby Monk',        logo: logoBabyMonk },
  { name: 'Amodini',          logo: logoAmodini },
  { name: 'Blba',             logo: logoBlba },
  { name: 'Dhun',             logo: logoDhun },
  { name: 'Ecofit',           logo: logoEcofit },
  { name: 'JKJ',              logo: logoJkj },
  { name: 'Kaashi',           logo: logoKaashi },
  { name: 'Livvasa',          logo: logoLivvasa },
  { name: 'Pawblaze',         logo: logoPawblaze },
  { name: 'Plus Beauty',      logo: logoPlusBeauty },
  { name: 'Rareblings',       logo: logoRareblings },
  { name: 'Reetrang',         logo: logoReetrang },
  { name: 'Sanjay',           logo: logoSanjay },
  { name: 'Scintaillre',      logo: logoScintaillre },
  { name: 'That Girl',        logo: logoThatGirl },
  { name: 'Tistabene',        logo: logoTistabene },
  { name: 'Urban Naari',      logo: logoUrbannaari },
  { name: 'Varaya',           logo: logoVaraya },
]

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
    brand: 'Diruno Men\'s Fashion',
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

const marqueeItems = [
  'Paid Media', 'Growth Marketing', 'UGC Creatives', 'Shopify Dev',
  'CRO', 'Meta Ads', 'Google Ads', 'D2C Strategy',
  'Email & SMS', 'Brand Identity', 'Analytics', 'Performance',
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

interface ReelSliderProps {
  startIndex?: number
  label?: string
  heading?: React.ReactNode
}

function ReelSlider({ startIndex = 0, label = 'Our Work', heading }: ReelSliderProps) {
  const [active, setActive] = useState(startIndex % reels.length)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressAnim = useRef<gsap.core.Tween | null>(null)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const total = reels.length

  const goTo = (next: number) => setActive(next)
  const prev = () => goTo((active - 1 + total) % total)
  const next = () => goTo((active + 1) % total)

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [active])

  // Progress bar + autoplay advance on video end
  useEffect(() => {
    const vid = videoRefs.current[active]
    progressAnim.current?.kill()
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
    if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 })

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
      // Fallback: no video element yet, advance after 6s
      fallbackTimer.current = setTimeout(advance, 6000)
      return
    }

    const onEnd = () => advance()
    vid.addEventListener('ended', onEnd, { once: true })

    const onMeta = () => {
      const dur = vid.duration && isFinite(vid.duration) ? vid.duration : 6
      startProgress(dur)
      // Fallback in case ended event misfires
      fallbackTimer.current = setTimeout(advance, (dur + 1) * 1000)
    }

    if (vid.readyState >= 1) {
      onMeta()
    } else {
      vid.addEventListener('loadedmetadata', onMeta, { once: true })
      // Fallback if metadata never fires
      fallbackTimer.current = setTimeout(() => {
        startProgress(6)
      }, 500)
    }

    return () => {
      progressAnim.current?.kill()
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current)
      vid.removeEventListener('ended', onEnd)
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Left side previews */}
        {[-2, -1].map((offset) => (
          <div
            key={offset}
            className={`reel-slot reel-slot--side reel-slot--left reel-slot--${Math.abs(offset) === 2 ? 'far' : 'near'}`}
            onClick={prev}
          >
            <video
              ref={(el) => { videoRefs.current[getSlotIndex(offset)] = el }}
              src={reels[getSlotIndex(offset)]}
              muted playsInline loop preload="metadata"
            />
            <div className="reel-slot__overlay" />
          </div>
        ))}

        {/* Center — active reel */}
        <div className="reel-slot reel-slot--center">
          <video
            ref={(el) => { videoRefs.current[active] = el }}
            src={reels[active]}
            muted playsInline preload="auto"
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

        {/* Right side previews */}
        {[1, 2].map((offset) => (
          <div
            key={offset}
            className={`reel-slot reel-slot--side reel-slot--right reel-slot--${offset === 2 ? 'far' : 'near'}`}
            onClick={next}
          >
            <video
              ref={(el) => { videoRefs.current[getSlotIndex(offset)] = el }}
              src={reels[getSlotIndex(offset)]}
              muted playsInline loop preload="metadata"
            />
            <div className="reel-slot__overlay" />
          </div>
        ))}
      </div>

      {/* Navigation */}
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

      {/* Film-strip decoration */}
      <div className="reel-slider__filmstrip">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="reel-slider__filmstrip-hole" />
        ))}
      </div>
    </div>
  )
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const clientsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      const lines = headlineRef.current!.querySelectorAll('.work__line-inner')
      gsap.fromTo(lines,
        { y: 90, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )

      const logos = clientsRef.current!.querySelectorAll('.work__client')
      gsap.fromTo(logos,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out',
          scrollTrigger: { trigger: clientsRef.current, start: 'top 82%' } }
      )

      gsap.fromTo(testimonialsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 82%' } }
      )

      const track = marqueeRef.current?.querySelector('.work__marquee-track') as HTMLElement
      if (track) {
        gsap.to(track, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const allMarquee = [...marqueeItems, ...marqueeItems]

  return (
    <section id="work" ref={sectionRef} className="work">
      <div ref={marqueeRef} className="work__marquee">
        <div className="work__marquee-track">
          {allMarquee.map((item, i) => (
            <span key={i} className="work__marquee-item">
              {item}<span className="work__marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="work__header">
          <div ref={labelRef} className="section-label">Our Clients</div>
          <div ref={headlineRef} className="work__headline">
            <div className="work__line"><span className="work__line-inner">Numbers Don&apos;t</span></div>
            <div className="work__line"><span className="work__line-inner work__line-inner--grad">Lie.</span></div>
          </div>
          <p className="work__intro">
            Trusted by 25+ Indian D2C brands. From ₹0 to ₹30L/month. Built to scale, built to last.
          </p>
        </div>

        <div ref={clientsRef} className="work__clients">
          {clients.map((client) => (
            <div key={client.name} className="work__client">
              <img src={client.logo} alt={client.name} />
            </div>
          ))}
        </div>

        {/* Cinematic Reel Slider */}
        <ReelSlider
          startIndex={0}
          label="Our Work"
          heading={<>Reels That <span className="reel-slider__heading--grad">Convert.</span></>}
        />

        <div ref={testimonialsRef} className="work__testimonials">
          <div className="work__testimonials-label section-label">What Our Clients Say</div>
          <div className="work__testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} active={activeTestimonial === i} />
            ))}
          </div>
          <div className="work__testimonials-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`work__dot ${activeTestimonial === i ? 'is-active' : ''}`}
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
