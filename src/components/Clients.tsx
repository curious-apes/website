import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Clients.css'

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
import logoAlvino from '../assets/client_logo/alvino.png'
import logoClazeup from '../assets/client_logo/clazeup.png'

gsap.registerPlugin(ScrollTrigger)

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
  { name: 'Alvino',           logo: logoAlvino },
  { name: 'Clazeup',          logo: logoClazeup },
]

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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
              <img src={client.logo} alt={client.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
