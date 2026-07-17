import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Clients.css'

import logoAmayu from '../assets/client_logo/amayu.webp'
import logoAmodini from '../assets/client_logo/amodini.webp'
import logoAquaAce from '../assets/client_logo/aqua ace.webp'
import logoAruwa from '../assets/client_logo/aruwa.webp'
import logoAuthentics from '../assets/client_logo/authentics.webp'
import logoBabyMonk from '../assets/client_logo/babymonk.webp'
import logoBlba from '../assets/client_logo/blba.webp'
import logoDhun from '../assets/client_logo/dhun.webp'
import logoEcofit from '../assets/client_logo/ecofit.webp'
import logoGhumar from '../assets/client_logo/ghumar.webp'
import logoGulabi from '../assets/client_logo/gulabi.webp'
import logoJaipurStudio from '../assets/client_logo/jaipur studio.webp'
import logoKaashi from '../assets/client_logo/kaashi.webp'
import logoKatha from '../assets/client_logo/katha.webp'
import logoLivvasa from '../assets/client_logo/livvasa.webp'
import logoPawblaze from '../assets/client_logo/pawblaze.webp'
import logoPlusBeauty from '../assets/client_logo/plus beauty.webp'
import logoRareblings from '../assets/client_logo/rareblings.webp'
import logoReetrang from '../assets/client_logo/reetrang.webp'
import logoScintaillre from '../assets/client_logo/scintaillre.webp'
import logoShashak from '../assets/client_logo/shashak.webp'
import logoSpiritual from '../assets/client_logo/spritual senses.webp'
import logoTarunima from '../assets/client_logo/tarunima.webp'
import logoThatGirl from '../assets/client_logo/that girl.webp'
import logoTistabene from '../assets/client_logo/tistabene.webp'
import logoToneNTint from '../assets/client_logo/tone n tint.webp'
import logoTushti from '../assets/client_logo/tushti.webp'
import logoUltimats from '../assets/client_logo/ultimats.webp'
import logoUrbannaari from '../assets/client_logo/urbannaari.webp'
import logoVaraya from '../assets/client_logo/varaya.webp'
import logoWagdo from '../assets/client_logo/wagdo.webp'
import logoAlvino from '../assets/client_logo/alvino.webp'
import logoClazeup from '../assets/client_logo/clazeup.webp'
// New brands (2026-07)
import logoJisora from '../assets/client_logo/jisora.webp'
import logoConfeeti from '../assets/client_logo/confeeti.webp'
import logoJuniper from '../assets/client_logo/juniper.webp'
import logoStylox from '../assets/client_logo/stylox.webp'
import logoZolo from '../assets/client_logo/zolo.webp'
import logoNangalia from '../assets/client_logo/nangaliaruchira.webp'
import logoBaori from '../assets/client_logo/baori.webp'
import logoAmbree from '../assets/client_logo/ambree.webp'
import logoAureve from '../assets/client_logo/aureve.webp'
import logoBawali from '../assets/client_logo/bawali.webp'
import logoDivena from '../assets/client_logo/divena.webp'
import logoGardenNeed from '../assets/client_logo/garden need logo.webp'
import logoGemnifest from '../assets/client_logo/gemnifest.webp'
import logoNaarivrse from '../assets/client_logo/naarivrse.webp'
import logoPlusFor from '../assets/client_logo/plus for.webp'
import logoQl from '../assets/client_logo/ql.webp'
import logoVarde from '../assets/client_logo/varde.webp'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  // New brands first, in the requested top order
  { name: 'Jisora',           logo: logoJisora },
  { name: 'Confetti',         logo: logoConfeeti },
  { name: 'Juniper',          logo: logoJuniper },
  { name: 'Stylox',           logo: logoStylox },
  { name: 'Zolo',             logo: logoZolo },
  { name: 'Nangalia Ruchira', logo: logoNangalia },
  { name: 'Baori',            logo: logoBaori },
  { name: 'Ambree',           logo: logoAmbree },
  { name: 'Aureve',           logo: logoAureve },
  { name: 'Bawali',           logo: logoBawali },
  { name: 'Divena',           logo: logoDivena },
  { name: 'Garden Need',      logo: logoGardenNeed },
  { name: 'Gemnifest',        logo: logoGemnifest },
  { name: 'Naarivrse',        logo: logoNaarivrse },
  { name: 'Plus For',         logo: logoPlusFor },
  { name: 'QL',               logo: logoQl },
  { name: 'Varde',            logo: logoVarde },
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
  { name: 'Kaashi',           logo: logoKaashi },
  { name: 'Livvasa',          logo: logoLivvasa },
  { name: 'Pawblaze',         logo: logoPawblaze },
  { name: 'Plus Beauty',      logo: logoPlusBeauty },
  { name: 'Rareblings',       logo: logoRareblings },
  { name: 'Reetrang',         logo: logoReetrang },
  { name: 'Scintaillre',      logo: logoScintaillre },
  { name: 'That Girl',        logo: logoThatGirl },
  { name: 'Tistabene',        logo: logoTistabene },
  { name: 'Urban Naari',      logo: logoUrbannaari },
  { name: 'Varaya',           logo: logoVaraya },
  { name: 'Alvino',           logo: logoAlvino },
  { name: 'Clazeup',          logo: logoClazeup },
]

// Split into 4 rows for the mobile auto-scrolling marquee (compact fixed height
// no matter how many logos there are).
const marqueeRows = [0, 1, 2, 3].map((r) => clients.filter((_, i) => i % 4 === r))

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )

      const lines = headlineRef.current!.querySelectorAll('.clients__line-inner')
      gsap.fromTo(lines,
        { y: 90, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } }
      )

      const logos = gridRef.current!.querySelectorAll('.clients__item')
      gsap.fromTo(logos,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Mobile marquee runs as a pure CSS compositor animation (smooth, no jump).
  // Pause it when the section is off-screen so it uses zero cycles in the background.
  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('clients__marquee--paused', !entry.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="clients" ref={sectionRef} className="clients">
      <div className="container">
        <div className="clients__header">
          <div ref={labelRef} className="section-label">Our Clients</div>
          <div ref={headlineRef} className="clients__headline">
            <div className="clients__line"><span className="clients__line-inner">Trusted by</span></div>
            <div className="clients__line"><span className="clients__line-inner clients__line-inner--grad">50+ Brands.</span></div>
          </div>
          <p className="clients__intro">
            From ₹0 to 7 Figures a Month. Built to scale, built to last.
          </p>
        </div>

        <div ref={gridRef} className="clients__grid">
          {clients.map((client) => (
            <div key={client.name} className="clients__item">
              <img src={client.logo} alt={client.name} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>

        {/* Mobile-only: auto-scrolling rows (compact, fixed height) */}
        <div ref={marqueeRef} className="clients__marquee" aria-hidden="true">
          {marqueeRows.map((row, ri) => (
            <div key={ri} className="clients__marquee-row">
              <div
                className="clients__marquee-track"
                style={{ ['--dur' as string]: `${32 + ri * 7}s` }}
              >
                {[...row, ...row].map((client, i) => (
                  <div key={i} className="clients__marquee-item">
                    <img src={client.logo} alt={client.name} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
