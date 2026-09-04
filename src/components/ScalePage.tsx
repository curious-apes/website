import { useEffect, useMemo, useRef, useState } from 'react'
import { saveScaleLead } from '../lib/scaleLeads'
import './ScalePage.css'

const RESULTS = [
  { amt: '₹3.1 Cr', cat: "Women's apparel", img: 'result-3-1cr.png', alt: 'Shopify dashboard: ₹3.13 Cr gross sales, up 16%' },
  { amt: '₹1.5 Cr', cat: 'Jewellery', img: 'result-1-5cr.png', alt: 'Shopify dashboard: ₹1.54 Cr gross sales, up 135%' },
  { amt: '₹55 L', cat: "Men's wear", img: 'result-55l.png', alt: 'Shopify dashboard: ₹54.16 L gross sales, up 20%' },
  { amt: '₹1.4 Cr', cat: "Women's apparel", img: 'result-1-4cr.png', alt: 'Shopify dashboard: ₹1.44 Cr gross sales, up 54%' },
  { amt: '₹1.3 Cr', cat: "Women's apparel", img: 'result-1-3cr-a.png', alt: 'Shopify dashboard: ₹1.37 Cr gross sales, up 49%' },
  { amt: '₹1.3 Cr', cat: "Women's brand", img: 'result-1-3cr-b.png', alt: 'Shopify dashboard: ₹1.30 Cr gross sales, up 5%' },
]

const CLIENT_LOGOS = [
  ['jisora-CsnC-1mt.webp', 'Jisora'], ['confeeti-LUNq3pvP.webp', 'Confetti'], ['juniper-BbFA-7Tm.webp', 'Juniper'],
  ['stylox-C_wbJJdH.webp', 'Stylox'], ['zolo-BASlicMw.webp', 'Zolo'], ['nangaliaruchira-B4KeGUVt.webp', 'Nangalia Ruchira'],
  ['baori-s_jQhWnZ.webp', 'Baori'], ['ambree-BDk8CYL-.webp', 'Ambraee'], ['aureve-BSX96e7c.webp', 'Aureve'],
  ['bawali-Dt36mH7H.webp', 'Bawali'], ['divena-CC1OO3_6.webp', 'Divena'], ['garden%20need%20logo-Ba6Lrbli.webp', 'Garden Need'],
  ['gemnifest-BSGzw7hA.webp', 'Gemanifest'], ['naarivrse-DvPuS7Er.webp', 'Naarivrse'], ['aqua%20ace-tT05RhjU.webp', 'Aqua Ace'],
  ['authentics-C2GWRY2S.webp', 'Authentics'], ['spritual%20senses-5Xya2lg1.webp', 'Spiritual Senses'], ['ghumar-DagxryhS.webp', 'Ghumar'],
  ['gulabi-Bsl_tMRn.webp', 'Gulabi'], ['wagdo-CGlHMHkY.webp', 'Wagdo'], ['ultimats-BCi-_dbt.webp', 'Ultimats'],
  ['amayu-CyrgmuE4.webp', 'Amayu'], ['babymonk-C3WdrYuq.webp', 'Baby Monk'], ['amodini-D9TCACNg.webp', 'Amodini'],
  ['kaashi-C_ZyoW2U.webp', 'Kaashi'], ['livvasa-Bpmwgsft.webp', 'Livvasa'], ['scintaillre-6cmzpZgF.webp', 'Scintaillre'],
  ['tistabene-BKXsE1q8.webp', 'Tistabene'], ['urbannaari-CF1e6Dcx.webp', 'Urban Naari'], ['varaya-D-I1R5q1.webp', 'Varaya'],
] as const

interface Service { img: string; title: string; desc: string }
const SERVICE_GROUPS: { idx: string; title: string; sub: string; items: Service[] }[] = [
  {
    idx: '01', title: 'Paid media', sub: 'Meta & Google Ads built on clean structure and real funnel data.',
    items: [
      { img: 'data_driven_campaign_optimization.webp', title: 'Data-driven campaign optimisation', desc: 'Week on week CPM, CTR, CPC, ATC% and ROAS tracked at campaign and ad set level to find what to cut and what to scale.' },
      { img: 'Clean_Ad_Structures.webp', title: 'Clean ad structures', desc: 'Separate campaigns for testing, scaling, bestsellers and categories, with a clear split between TOF, MOF and BOF.' },
      { img: 'Focusing_on_high_converting_products.webp', title: 'High-converting products', desc: 'Budget follows the SKUs with real sales velocity and strong ATC%, instead of the whole catalogue.' },
    ],
  },
  {
    idx: '02', title: 'Growth marketing', sub: 'The margin work beyond ads: order value, returns and repeat revenue.',
    items: [
      { img: 'Increasing_AOV.webp', title: 'Increasing AOV', desc: 'Bought together analysis by category drives the cross sell, upsell and cart value offers we put live.' },
      { img: 'Decreasing_RTO_s.webp', title: 'Decreasing RTOs', desc: 'State and pin code RTO analysis, blocking of high RTO pin codes, and prepaid incentives tested at checkout.' },
      { img: 'Retention_Marketing.webp', title: 'Retention marketing', desc: 'Abandoned cart, post purchase and win back flows on WhatsApp, built around actual customer behaviour.' },
    ],
  },
  {
    idx: '03', title: 'Visuals & creative', sub: 'In-house studio and production, guided by creative performance data.',
    items: [
      { img: 'Leveraging_Creative_analytics.webp', title: 'Creative analytics', desc: 'Spend, ROAS and AOV read per creative, so the next shoot is briefed on what is already winning.' },
      { img: 'In_house_video_production_team_and_studio.webp', title: 'In-house production & studio', desc: 'Our own team and studio for UGC, product shoots and commercial ads, all built for performance rather than vanity.' },
      { img: 'Social_media_management.webp', title: 'Social media management', desc: 'Trend led organic content in shareable formats, with reach and recall tracked reel by reel.' },
    ],
  },
  {
    idx: '04', title: 'Tech & CRO', sub: 'A store that converts the traffic you are already paying for.',
    items: [
      { img: 'Conversion_rate_optimization.webp', title: 'Conversion rate optimisation', desc: 'Product page rebuilds covering swatches, sizes, offers and hierarchy, tested against ATC% and conversion rate.' },
      { img: 'Ecommerce_website_development.webp', title: 'E-commerce website development', desc: 'Fast, mobile first Shopify storefronts with optimised product pages and a checkout with no friction.' },
      { img: 'Integrating_third_party_tools.webp', title: 'Apps & integrations', desc: 'Checkout, payments, shipping, returns, WhatsApp and behaviour analytics wired together to lift prepaid share and LTV.' },
    ],
  },
]

const WHATSAPP = '919982898842'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'] as const

function ResultsSlider() {
  const railRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = () => {
    const rail = railRef.current
    if (!rail) return
    const slideWidth = (rail.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1
    const step = slideWidth + 16
    setActiveDot(Math.round(rail.scrollLeft / step))
    setAtStart(rail.scrollLeft < 8)
    setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 8)
  }

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const slideWidth = (rail.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0
    rail.scrollLeft += dir * (slideWidth + 16)
  }

  return (
    <section id="results">
      <div className="wrap">
        <div className="shead">
          <div>
            <p className="eyebrow">Results</p>
            <h2>Live Shopify dashboards <span className="grad">from client stores.</span></h2>
            <p>Monthly gross sales, straight from the admin. Not projections.</p>
          </div>
          <div className="navbtns">
            <button aria-label="Previous" disabled={atStart} onClick={() => scrollBy(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button aria-label="Next" disabled={atEnd} onClick={() => scrollBy(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="rail" ref={railRef} onScroll={() => window.requestAnimationFrame(sync)}>
          {RESULTS.map((r) => (
            <article className="slide" key={r.img}>
              <div className="h"><div className="amt">{r.amt} <span>/ month</span></div><div className="cat">{r.cat}</div></div>
              <div className="img"><img src={`/scale/assets/results/${r.img}`} alt={r.alt} loading="lazy" /></div>
            </article>
          ))}
        </div>
        <div className="dots" aria-hidden="true">
          {RESULTS.map((r, i) => <i key={r.img} className={i === activeDot ? 'on' : ''} />)}
        </div>
        <p className="note">Brand names withheld under client agreements. References shared on the call.</p>
        <div className="inline-cta">
          <a className="btn sm ghost" href="#book">See what your account could do</a>
        </div>
      </div>
    </section>
  )
}

function Lightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [src, onClose])

  if (!src) return null
  return (
    <div className="lb on" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button className="x" aria-label="Close" onClick={onClose}>&times;</button>
      <div><img src={src} alt={alt} /><p className="cap">{alt}</p></div>
    </div>
  )
}

interface LeadFormState {
  phone: string; brand: string; site: string; sales: string; spend: string; company: string
}
const EMPTY_FORM: LeadFormState = { phone: '', brand: '', site: '', sales: '', spend: '', company: '' }

function LeadForm() {
  const [form, setForm] = useState<LeadFormState>(EMPTY_FORM)
  const [invalid, setInvalid] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const loadedAt = useRef(Date.now())

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const params = new URLSearchParams(window.location.search)
    const out: Record<string, string> = {}
    UTM_KEYS.forEach((k) => { const v = params.get(k); if (v) out[k] = v })
    return out
  }, [])

  const set = (key: keyof LeadFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    if (form.company.trim() !== '') return // honeypot

    const required: (keyof LeadFormState)[] = ['phone', 'brand', 'site', 'sales', 'spend']
    const bad: Record<string, boolean> = {}
    required.forEach((k) => { if (!form[k].trim()) bad[k] = true })
    if (Object.keys(bad).length) {
      setInvalid(bad)
      setStatus('error')
      setErrorMsg('Please complete the highlighted fields.')
      return
    }
    setInvalid({})

    const elapsed = Math.round((Date.now() - loadedAt.current) / 1000)
    if (elapsed < 3) return // bot-speed submission, drop silently

    let site = form.site.trim()
    if (!/^https?:\/\//i.test(site)) site = 'https://' + site

    setStatus('sending')
    try {
      await saveScaleLead({
        phone: form.phone.trim(),
        brand: form.brand.trim(),
        website: site,
        monthlySales: form.sales,
        monthlyAdSpend: form.spend,
        source: 'lead-gen-lp',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        utm,
      })

      try {
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({ event: 'lead_submit', lead: { brand: form.brand, sales: form.sales, spend: form.spend } })
      } catch { /* GTM not present, ignore */ }

      setStatus('sent')

      if (WHATSAPP) {
        const msg = `Hi Curious Apes, I just booked a growth call.\nBrand: ${form.brand}\nWebsite: ${site}\nMonthly sales: ${form.sales}\nMonthly ad spend: ${form.spend}`
        setTimeout(() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank'), 700)
      }
    } catch (err) {
      console.error('Scale lead save failed:', err)
      setStatus('error')
      setErrorMsg('Something went wrong. You can also WhatsApp us on +91 99828 98842.')
    }
  }

  const sent = status === 'sent'

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3>Book your call</h3>
      <p className="fs">Takes 40 seconds. We respond within 24 hours.</p>

      {status === 'error' && <div className="err" style={{ display: 'block' }}>{errorMsg}</div>}

      <div style={{ position: 'absolute', left: -9999 }} aria-hidden="true">
        <label htmlFor="scale-company">Company</label>
        <input id="scale-company" type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} />
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="scale-phone">Phone number</label>
          <input id="scale-phone" type="tel" inputMode="tel" placeholder="+91 98XXX XXXXX" autoComplete="tel"
            className={invalid.phone ? 'is-invalid' : ''} value={form.phone} onChange={set('phone')} disabled={sent} required />
        </div>
        <div className="field">
          <label htmlFor="scale-brand">Brand name</label>
          <input id="scale-brand" type="text" placeholder="Your brand" autoComplete="organization"
            className={invalid.brand ? 'is-invalid' : ''} value={form.brand} onChange={set('brand')} disabled={sent} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="scale-site">Website link</label>
        <input id="scale-site" type="url" inputMode="url" placeholder="https://yourbrand.com" autoComplete="url"
          className={invalid.site ? 'is-invalid' : ''} value={form.site} onChange={set('site')} disabled={sent} required />
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="scale-sales">Monthly sales</label>
          <select id="scale-sales" className={invalid.sales ? 'is-invalid' : ''} value={form.sales} onChange={set('sales')} disabled={sent} required>
            <option value="" disabled>Select</option>
            <option>Under ₹5 L</option><option>₹5 L to ₹20 L</option><option>₹20 L to ₹50 L</option>
            <option>₹50 L to ₹1 Cr</option><option>₹1 Cr to ₹3 Cr</option><option>₹3 Cr+</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="scale-spend">Monthly ad spend</label>
          <select id="scale-spend" className={invalid.spend ? 'is-invalid' : ''} value={form.spend} onChange={set('spend')} disabled={sent} required>
            <option value="" disabled>Select</option>
            <option>Under ₹1 L</option><option>₹1 L to ₹5 L</option><option>₹5 L to ₹15 L</option>
            <option>₹15 L to ₹50 L</option><option>₹50 L+</option>
          </select>
        </div>
      </div>

      <button className="btn" type="submit" disabled={status === 'sending' || sent}>
        {status === 'sending' ? 'Sending…' : sent ? 'Sent' : 'Book my call'}
      </button>
      <p className="fine">No spam. Your details stay with us.</p>
      {sent && <div className="ok" style={{ display: 'block' }}>Thanks, your details are with us. We will call within 24 hours.</div>}
    </form>
  )
}

export default function ScalePage() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    if (!(window as any).dataLayer) {
      ;(function (w: any, d: Document, s: string, l: string, i: string) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        const f = d.getElementsByTagName(s)[0]
        const j = d.createElement(s) as HTMLScriptElement
        const dl = l !== 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode?.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'GTM-KVGDNFH5')
    }
  }, [])

  return (
    <div className="scale-lp">
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KVGDNFH5" height={0} width={0} style={{ display: 'none', visibility: 'hidden' }} title="gtm" />
      </noscript>

      <header>
        <div className="wrap">
          <a href="#top" aria-label="Curious Apes"><img src="/scale/assets/logo.png" alt="Curious Apes" /></a>
          <a className="btn" href="#book">Book a call</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap">
          <p className="eyebrow">Performance marketing for D2C brands</p>
          <h1>Two reasons your brand<br /><span className="grad">isn't scaling profitably.</span></h1>
          <p className="lede">Almost every brand we audit is stuck in one of them. Both are fixable, and both come down to structure rather than budget.</p>

          <div className="plist">
            <div className="p">
              <h2>ROAS never turns profitable</h2>
              <p>Spend rises, ROAS sits between 1.5x and 2x, and the account never crosses the line where ads actually make money.</p>
            </div>
            <div className="p">
              <h2>Growth stalls at breakeven</h2>
              <p>You've found what works. But every attempt to scale past it kills ROAS, lifts RTOs and eats the margin.</p>
            </div>
          </div>

          <div className="statline">
            <div className="s"><div className="n">₹50 Cr+</div><div className="l">Ad budget managed</div></div>
            <div className="s"><div className="n">₹200 Cr+</div><div className="l">Revenue generated</div></div>
            <div className="s"><div className="n">4x</div><div className="l">Average ROAS</div></div>
          </div>

          <div className="inline-cta">
            <a className="btn" href="#book">Book a free growth call</a>
            <span>30 minutes. We audit your account and show you where the money leaks.</span>
          </div>
        </div>
      </section>

      <ResultsSlider />

      <section className="clients">
        <div className="wrap">
          <div className="shead">
            <div>
              <p className="eyebrow">Clients</p>
              <h2>Trusted by <span className="grad">50+ brands.</span></h2>
            </div>
          </div>
          <div className="logos">
            {CLIENT_LOGOS.map(([file, name]) => (
              <div className="logo" key={file}>
                <img
                  src={`https://www.curiousapes.in/assets/${file}`}
                  alt={name}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.parentElement as HTMLElement)?.classList.add('txt')}
                />
                <span className="alt">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="svcsec" style={{ paddingBottom: 24 }}>
        <div className="wrap">
          <p className="eyebrow">What we do</p>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,36px)' }}>Four levers, <span className="grad">one team.</span></h2>
        </div>
      </section>

      {SERVICE_GROUPS.map((group, gi) => (
        <section className="svcsec" style={gi === 0 ? { borderTop: 'none' } : undefined} key={group.title}>
          <div className="wrap">
            <div className="svchead">
              <span className="idx">{group.idx}</span>
              <h2>{group.title}</h2>
              <p>{group.sub}</p>
            </div>
            <div className="trio">
              {group.items.map((item) => (
                <article className="cell" key={item.title}>
                  <button
                    className="shot" type="button" aria-label={`Enlarge: ${item.title}`}
                    onClick={() => setLightbox({ src: `/scale/assets/services/${item.img}`, alt: item.title })}
                    onError={(e) => (e.currentTarget.closest('.cell') as HTMLElement)?.classList.add('noimg')}
                  >
                    <img src={`/scale/assets/services/${item.img}`} alt={item.title} loading="lazy" />
                    <span className="zoom">Click to enlarge</span>
                  </button>
                  <div className="txt"><b>{item.title}</b><p>{item.desc}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: '0 0 68px', borderTop: 'none' }}>
        <div className="wrap"><div className="inline-cta" style={{ marginTop: 0 }}>
          <a className="btn sm ghost" href="#book">Not sure where to start? Book a call</a>
        </div></div>
      </section>

      <section className="cta" id="book">
        <div className="wrap">
          <div className="grid">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>Let's find out <span className="grad">why you're not scaling.</span></h2>
              <p className="p2">A free 30 minute call. You will leave with a clear plan, whether or not you work with us.</p>
              <ul>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>A live audit of your account structure and top spending campaigns</span></li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Where the funnel leaks: ad, product page or checkout</span></li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>A realistic 90 day scaling target and what it will cost</span></li>
              </ul>
              <p className="trust">We take a limited number of brands each month so every account gets senior attention.</p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div>© 2026 Curious Apes · Mansarovar, Jaipur 302020</div>
          <div><a href="tel:+919982898842">+91 99828 98842</a><a href="mailto:info@curiousapes.in">info@curiousapes.in</a></div>
        </div>
      </footer>

      <Lightbox src={lightbox?.src ?? null} alt={lightbox?.alt ?? ''} onClose={() => setLightbox(null)} />

      <div className="stickybar"><a className="btn" href="#book">Book a free growth call</a></div>
    </div>
  )
}
